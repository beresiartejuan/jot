import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

/**
 * Users
 */
export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  randomKey: text("random_key").notNull(),
  refreshTokenKey: text("refresh_token_key").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export const selectUserSchema = createSelectSchema(usersTable);
export const insertUserSchema = createInsertSchema(usersTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  updatedAt: (schema) => schema.optional(),
});
export const updateUserSchema = createUpdateSchema(usersTable);

/**
 * Notes
 */
export const notesTable = sqliteTable(
  "notes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (table) => [index("notes_user_id_idx").on(table.userId)],
);

export type Note = typeof notesTable.$inferSelect;
export type NewNote = typeof notesTable.$inferInsert;

export const selectNoteSchema = createSelectSchema(notesTable);
export const insertNoteSchema = createInsertSchema(notesTable, {
  id: (schema) => schema.optional(),
  isPublic: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  updatedAt: (schema) => schema.optional(),
});
export const updateNoteSchema = createUpdateSchema(notesTable);

/**
 * Tags
 */
export const tagsTable = sqliteTable(
  "tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [unique("tags_user_name_unique").on(table.userId, table.name)],
);

export type Tag = typeof tagsTable.$inferSelect;
export type NewTag = typeof tagsTable.$inferInsert;

export const selectTagSchema = createSelectSchema(tagsTable);
export const insertTagSchema = createInsertSchema(tagsTable, {
  id: (schema) => schema.optional(),
  color: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
});
export const updateTagSchema = createUpdateSchema(tagsTable);

/**
 * Note-Tags relationship
 */
export const noteTagsTable = sqliteTable(
  "note_tags",
  {
    noteId: text("note_id")
      .notNull()
      .references(() => notesTable.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.noteId, table.tagId] })],
);

export type NoteTag = typeof noteTagsTable.$inferSelect;
export type NewNoteTag = typeof noteTagsTable.$inferInsert;

export const selectNoteTagSchema = createSelectSchema(noteTagsTable);
export const insertNoteTagSchema = createInsertSchema(noteTagsTable);
export const updateNoteTagSchema = createUpdateSchema(noteTagsTable);
