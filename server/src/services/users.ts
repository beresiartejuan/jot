import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { db } from "@/db";
import {
  insertUserSchema,
  selectUserSchema,
  usersTable,
  type NewUser,
  type User,
} from "@/db/schema";

export type CreateUserInput = Omit<NewUser, "passwordHash"> & {
  password: string;
};

export type SafeUser = Omit<User, "passwordHash">;

function toSafeUser(user: User): SafeUser {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function createUser(input: CreateUserInput): Promise<SafeUser> {
  const { password, ...rest } = input;

  const passwordHash = await bcryptjs.hash(password, 10);

  const parsed = insertUserSchema.parse({
    ...rest,
    passwordHash,
  });

  const [created] = await db.insert(usersTable).values(parsed).returning();

  return toSafeUser(selectUserSchema.parse(created));
}

export type LoginInput = {
  email: string;
  password: string;
};

export async function login(input: LoginInput): Promise<SafeUser | null> {
  const { email, password } = input;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) return null;

  const isValid = await bcryptjs.compare(password, user.passwordHash);

  if (!isValid) return null;

  return toSafeUser(selectUserSchema.parse(user));
}
