import { Hono } from "hono";
import apiHandler from "./handlers";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.route("/api", apiHandler);

export default app;
