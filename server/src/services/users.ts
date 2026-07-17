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
import { ConflictError, UnauthorizedError, ValidationError } from "@/errors";

export type CreateUserInput = Omit<NewUser, "passwordHash"> & {
  password: string;
};

export type SafeUser = Omit<User, "passwordHash">;

function toSafeUser(user: User): SafeUser {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function createUser(
  input: CreateUserInput,
): Promise<Result<SafeUser, ValidationError | ConflictError>> {
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

  try {
    const [created] = await db
      .insert(usersTable)
      .values(parsed.data)
      .returning();

    return ok(toSafeUser(selectUserSchema.parse(created)));
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
): Promise<Result<SafeUser, UnauthorizedError | ValidationError>> {
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

  return ok(toSafeUser(selectUserSchema.parse(user)));
}
