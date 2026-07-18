import { createMiddleware } from "hono/factory";
import { verifyAccessToken } from "@/services/auth";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "UNAUTHORIZED", message: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = await verifyAccessToken(token);
    c.set("userId", payload.sub);
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "UNAUTHORIZED", message: "Invalid or expired access token" }, 401);
  }
});

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
    user: {
      sub: string;
      email: string;
      username: string;
    };
  }
}
