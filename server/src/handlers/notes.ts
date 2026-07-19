import { Hono } from "hono";
import { authMiddleware } from "@/middleware/auth";
import { verifyAccessToken } from "@/services/auth";
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
} from "@/services/notes";

const notesHandler = new Hono();

notesHandler.get("/:id", async (c) => {
  const noteId = c.req.param("id");
  const authHeader = c.req.header("authorization");
  let userId: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = await verifyAccessToken(authHeader.slice("Bearer ".length));
      userId = payload.sub;
    } catch {
      return c.json({ error: "UNAUTHORIZED", message: "Invalid or expired access token" }, 401);
    }
  }

  const result = await getNote(noteId, userId);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 200);
});

notesHandler.use(authMiddleware);

notesHandler.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const result = await createNote({ ...body, userId });

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 201);
});

notesHandler.get("/", async (c) => {
  const userId = c.get("userId");

  const result = await listNotes(userId);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 200);
});

notesHandler.patch("/:id", async (c) => {
  const userId = c.get("userId");
  const noteId = c.req.param("id");
  const body = await c.req.json();

  const result = await updateNote(noteId, userId, body);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 200);
});

notesHandler.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const noteId = c.req.param("id");

  const result = await deleteNote(noteId, userId);

  if (result.isErr()) {
    const error = result.error;
    return c.json({ error: error.code, message: error.message }, error.statusCode);
  }

  return c.json(result.value, 200);
});

export default notesHandler;
