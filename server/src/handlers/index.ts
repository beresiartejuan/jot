import { Hono } from "hono";
import notesHandler from "./notes";
import usersHandler from "./users";

const apiHandler = new Hono();

apiHandler.route("/users", usersHandler);
apiHandler.route("/notes", notesHandler);

export default apiHandler;
