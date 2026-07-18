import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { err, ok, type Result } from "neverthrow";
import { db } from "@/db";
import {
  insertUserSchema,
  selectUserSchema,
  usersTable,
  type NewUser,
  type User,
} from "@/db/schema";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  type AppError,
} from "@/errors";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  computeRefreshTokenKey,
  generateRandomKey,
  getRemainingSeconds,
  REFRESH_ROTATION_THRESHOLD_SECONDS,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth";

export type CreateUserInput = Omit<NewUser, "passwordHash" | "randomKey" | "refreshTokenKey"> & {
  password: string;
};

export type SafeUser = Omit<User, "passwordHash" | "randomKey" | "refreshTokenKey">;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

function toSafeUser(user: User): SafeUser {
  const { passwordHash, randomKey, refreshTokenKey, ...safeUser } = user;
  return safeUser;
}

async function buildAuthTokens(user: SafeUser & Pick<User, "refreshTokenKey">): Promise<AuthTokens> {
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(user),
    signRefreshToken(user.refreshTokenKey),
  ]);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenExpiresIn: 72 * 60 * 60,
  };
}

export async function createUser(
  input: CreateUserInput,
): Promise<Result<{ user: SafeUser; tokens: AuthTokens }, ValidationError | ConflictError>> {
  const { password, ...rest } = input;

  if (!password || password.length < 8) {
    return err(new ValidationError("Password must be at least 8 characters"));
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  const parsed = insertUserSchema.safeParse({
    ...rest,
    passwordHash,
  });

  if (!parsed.success) {
    return err(new ValidationError("Invalid user data"));
  }

  const id = parsed.data.id ?? crypto.randomUUID();
  const randomKey = generateRandomKey();
  const refreshTokenKey = computeRefreshTokenKey({
    id,
    email: parsed.data.email,
    randomKey,
  });

  try {
    const [created] = await db
      .insert(usersTable)
      .values({
        ...parsed.data,
        id,
        randomKey,
        refreshTokenKey,
      })
      .returning();

    const safeUser = toSafeUser(selectUserSchema.parse(created));
    const tokens = await buildAuthTokens({ ...safeUser, refreshTokenKey });

    return ok({ user: safeUser, tokens });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return err(new ConflictError("Email or username already exists"));
    }

    throw error;
  }
}

export type LoginInput = {
  email: string;
  password: string;
};

export async function login(
  input: LoginInput,
): Promise<Result<{ user: SafeUser; tokens: AuthTokens }, UnauthorizedError | ValidationError>> {
  const { email, password } = input;

  if (!email || !password) {
    return err(new ValidationError("Email and password are required"));
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return err(new UnauthorizedError("Invalid credentials"));
  }

  const isValid = await bcryptjs.compare(password, user.passwordHash);

  if (!isValid) {
    return err(new UnauthorizedError("Invalid credentials"));
  }

  const safeUser = toSafeUser(selectUserSchema.parse(user));
  const tokens = await buildAuthTokens({ ...safeUser, refreshTokenKey: user.refreshTokenKey });

  return ok({ user: safeUser, tokens });
}

type DecodedRefreshToken = {
  refreshTokenKey: string;
  exp: number;
};

export async function decodeRefreshToken(
  token: string,
): Promise<Result<DecodedRefreshToken, UnauthorizedError>> {
  try {
    const payload = await verifyRefreshToken(token);
    return ok({ refreshTokenKey: payload.rtk, exp: 0 });
  } catch {
    return err(new UnauthorizedError("Invalid or expired refresh token"));
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<
  Result<
    { accessToken: string; accessTokenExpiresIn: number; newRefreshToken?: string; newRefreshTokenExpiresIn?: number },
    UnauthorizedError | NotFoundError
  >
> {
  let refreshPayload: Awaited<ReturnType<typeof verifyRefreshToken>>;
  let exp = 0;

  try {
    const result = await verifyRefreshToken(refreshToken);
    refreshPayload = result;

    const decoded = JSON.parse(Buffer.from(refreshToken.split(".")[1], "base64url").toString("utf8")) as {
      exp?: number;
    };
    exp = decoded.exp ?? 0;
  } catch {
    return err(new UnauthorizedError("Invalid or expired refresh token"));
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.refreshTokenKey, refreshPayload.rtk))
    .limit(1);

  if (!user) {
    return err(new UnauthorizedError("Invalid or expired refresh token"));
  }

  const safeUser = toSafeUser(selectUserSchema.parse(user));
  const accessToken = await signAccessToken(safeUser);

  const remainingSeconds = getRemainingSeconds(exp);

  if (remainingSeconds <= REFRESH_ROTATION_THRESHOLD_SECONDS) {
    const newRandomKey = generateRandomKey();
    const newRefreshTokenKey = computeRefreshTokenKey({
      id: user.id,
      email: user.email,
      randomKey: newRandomKey,
    });

    await db
      .update(usersTable)
      .set({ randomKey: newRandomKey, refreshTokenKey: newRefreshTokenKey })
      .where(eq(usersTable.id, user.id));

    const newRefreshToken = await signRefreshToken(newRefreshTokenKey);

    return ok({
      accessToken,
      accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
      newRefreshToken,
      newRefreshTokenExpiresIn: 72 * 60 * 60,
    });
  }

  return ok({
    accessToken,
    accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
}

export async function logoutAllSessions(
  userId: string,
): Promise<Result<SafeUser, NotFoundError>> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  if (!user) {
    return err(new NotFoundError("User"));
  }

  const newRandomKey = generateRandomKey();
  const newRefreshTokenKey = computeRefreshTokenKey({
    id: user.id,
    email: user.email,
    randomKey: newRandomKey,
  });

  const [updated] = await db
    .update(usersTable)
    .set({ randomKey: newRandomKey, refreshTokenKey: newRefreshTokenKey })
    .where(eq(usersTable.id, user.id))
    .returning();

  return ok(toSafeUser(selectUserSchema.parse(updated)));
}

export async function findUserById(
  userId: string,
): Promise<Result<SafeUser, NotFoundError>> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  if (!user) {
    return err(new NotFoundError("User"));
  }

  return ok(toSafeUser(selectUserSchema.parse(user)));
}
