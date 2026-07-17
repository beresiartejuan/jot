import { Hono } from "hono";
import { createUser, login } from "@/services/users";
import { AppError } from "@/errors";

const usersHandler = new Hono();

usersHandler.post("/register", async (c) => {
  const body = await c.req.json();
  const result = await createUser(body);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 201);
});

usersHandler.post("/login", async (c) => {
  const body = await c.req.json();
  const result = await login(body);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 200);
});

export default usersHandler;
