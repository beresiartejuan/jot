import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { createUser, login, logoutAllSessions, refreshAccessToken } from "@/services/users";
import { authMiddleware } from "@/middleware/auth";

const REFRESH_COOKIE_NAME = "refresh_token";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict" as const,
  maxAge: 72 * 60 * 60,
  path: "/api/users",
};

function setRefreshTokenCookie(c: Parameters<typeof setCookie>[0], token: string, maxAge = REFRESH_COOKIE_OPTIONS.maxAge) {
  setCookie(c, REFRESH_COOKIE_NAME, token, { ...REFRESH_COOKIE_OPTIONS, maxAge });
}

function clearRefreshTokenCookie(c: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(c, REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_OPTIONS.path });
}

const usersHandler = new Hono();

usersHandler.post("/register", async (c) => {
  const body = await c.req.json();
  const result = await createUser(body);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  const { user, tokens } = result.value;
  setRefreshTokenCookie(c, tokens.refreshToken, tokens.refreshTokenExpiresIn);

  return c.json({ user, accessToken: tokens.accessToken, expiresIn: tokens.accessTokenExpiresIn }, 201);
});

usersHandler.post("/login", async (c) => {
  const body = await c.req.json();
  const result = await login(body);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  const { user, tokens } = result.value;
  setRefreshTokenCookie(c, tokens.refreshToken, tokens.refreshTokenExpiresIn);

  return c.json({ user, accessToken: tokens.accessToken, expiresIn: tokens.accessTokenExpiresIn }, 200);
});

usersHandler.post("/refresh", async (c) => {
  const refreshToken = c.req.header("cookie")?.match(/refresh_token=([^;]+)/)?.[1];

  if (!refreshToken) {
    return c.json({ error: "UNAUTHORIZED", message: "Refresh token not found" }, 401);
  }

  const result = await refreshAccessToken(refreshToken);

  if (result.isErr()) {
    const error = result.error;
    clearRefreshTokenCookie(c);
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  const { accessToken, accessTokenExpiresIn, newRefreshToken, newRefreshTokenExpiresIn } = result.value;

  if (newRefreshToken) {
    setRefreshTokenCookie(c, newRefreshToken, newRefreshTokenExpiresIn);
  }

  return c.json({ accessToken, expiresIn: accessTokenExpiresIn }, 200);
});

usersHandler.post("/logout", async (c) => {
  clearRefreshTokenCookie(c);
  return c.json({ message: "Logged out" }, 200);
});

usersHandler.use(authMiddleware);

usersHandler.post("/logout-all", async (c) => {
  const userId = c.get("userId");
  const result = await logoutAllSessions(userId);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  clearRefreshTokenCookie(c);
  return c.json({ message: "All sessions logged out", user: result.value }, 200);
});

export default usersHandler;
