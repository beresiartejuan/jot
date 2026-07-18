import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { createHash } from "node:crypto";
import type { SafeUser } from "./users";
import type { User } from "@/db/schema";

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not set");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not set");
}

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 72 * 60 * 60;
export const REFRESH_ROTATION_THRESHOLD_SECONDS = 10 * 60 * 60;

export type AccessTokenPayload = {
  sub: string;
  email: string;
  username: string;
};

export type RefreshTokenPayload = {
  rtk: string;
};

export function computeRefreshTokenKey(user: Pick<User, "id" | "randomKey" | "email">): string {
  return createHash("sha256")
    .update(`${user.id}${user.randomKey}${user.email}`)
    .digest("hex");
}

export function generateRandomKey(): string {
  return nanoid(5);
}

export async function signAccessToken(user: SafeUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    username: user.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(refreshTokenKey: string): Promise<string> {
  return new SignJWT({ rtk: refreshTokenKey })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL_SECONDS}s`)
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET, {
    algorithms: ["HS256"],
  });

  return {
    sub: String(payload.sub),
    email: String(payload.email),
    username: String(payload.username),
  };
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET, {
    algorithms: ["HS256"],
  });

  return {
    rtk: String(payload.rtk),
  };
}

export function getRemainingSeconds(exp: number): number {
  return Math.max(0, Math.floor(exp - Date.now() / 1000));
}
