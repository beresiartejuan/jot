import { createMiddleware } from "hono/factory";
import { z } from "zod";

const authHeaderSchema = z.string().min(1);

export const authMiddleware = createMiddleware(async (c, next) => {
  const userId = c.req.header("x-user-id");

  const parsed = authHeaderSchema.safeParse(userId);

  if (!parsed.success) {
    return c.json({ error: "Unauthorized", message: "Missing or invalid x-user-id header" }, 401);
  }

  c.set("userId", parsed.data);
  await next();
});

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
  }
}
