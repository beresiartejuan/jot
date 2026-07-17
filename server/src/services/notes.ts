import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { err, ok, type Result } from "neverthrow";
import { db } from "@/db";
import {
  insertNoteSchema,
  insertNoteTagSchema,
  insertTagSchema,
  notesTable,
  noteTagsTable,
  selectNoteSchema,
  tagsTable,
  updateNoteSchema,
  type NewNote,
  type NewNoteTag,
  type NewTag,
  type Note,
  type Tag,
} from "@/db/schema";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/errors";

export type NoteWithTags = Note & { tags: Tag[] };

function mergeNotesWithTags(
  notes: Note[],
  tagsByNoteId: Map<string, Tag[]>,
): NoteWithTags[] {
  return notes.map((note) => ({
    ...note,
    tags: tagsByNoteId.get(note.id) ?? [],
  }));
}

async function loadTagsForNotes(noteIds: string[]): Promise<Map<string, Tag[]>> {
  if (noteIds.length === 0) return new Map();

  const rows = await db
    .select({
      noteId: noteTagsTable.noteId,
      tag: {
        id: tagsTable.id,
        userId: tagsTable.userId,
        name: tagsTable.name,
        color: tagsTable.color,
        createdAt: tagsTable.createdAt,
      },
    })
    .from(noteTagsTable)
    .innerJoin(tagsTable, eq(noteTagsTable.tagId, tagsTable.id))
    .where(inArray(noteTagsTable.noteId, noteIds));

  const tagsByNoteId = new Map<string, Tag[]>();

  for (const row of rows) {
    const list = tagsByNoteId.get(row.noteId) ?? [];
    list.push(row.tag);
    tagsByNoteId.set(row.noteId, list);
  }

  return tagsByNoteId;
}

async function attachTags(
  noteId: string,
  userId: string,
  tagNames: string[],
): Promise<Tag[]> {
  if (tagNames.length === 0) return [];

  const normalizedNames = tagNames
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

  const existingTags = await db
    .select()
    .from(tagsTable)
    .where(
      and(
        eq(tagsTable.userId, userId),
        inArray(tagsTable.name, normalizedNames),
      ),
    );

  const existingByName = new Map(existingTags.map((t) => [t.name, t]));
  const tags: Tag[] = [...existingTags];

  const missingNames = normalizedNames.filter(
    (name) => !existingByName.has(name),
  );

  if (missingNames.length > 0) {
    const newTagsInput: NewTag[] = missingNames.map((name) => ({
      userId,
      name,
    }));

    const parsed = newTagsInput.map((t) => insertTagSchema.parse(t));
    const created = await db
      .insert(tagsTable)
      .values(parsed)
      .returning();

    tags.push(...created);
  }

  const noteTagInputs: NewNoteTag[] = tags.map((tag) => ({
    noteId,
    tagId: tag.id,
  }));

  const parsedNoteTags = noteTagInputs.map((nt) =>
    insertNoteTagSchema.parse(nt),
  );

  await db
    .insert(noteTagsTable)
    .values(parsedNoteTags)
    .onConflictDoNothing();

  return tags;
}

export type CreateNoteInput = Omit<NewNote, "userId"> & {
  userId: string;
  tagNames?: string[];
};

export async function createNote(
  input: CreateNoteInput,
): Promise<Result<NoteWithTags, ValidationError>> {
  const { tagNames, ...noteInput } = input;

  const parsed = insertNoteSchema.safeParse(noteInput);

  if (!parsed.success) {
    return err(new ValidationError("Invalid note data"));
  }

  const [note] = await db
    .insert(notesTable)
    .values(parsed.data)
    .returning();

  const validatedNote = selectNoteSchema.parse(note);
  const tags = await attachTags(
    validatedNote.id,
    validatedNote.userId,
    tagNames ?? [],
  );

  return ok({
    ...validatedNote,
    tags,
  });
}

export async function listNotes(
  userId: string,
): Promise<Result<NoteWithTags[], ValidationError>> {
  if (!userId) {
    return err(new ValidationError("User ID is required"));
  }

  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.userId, userId))
    .orderBy(desc(notesTable.updatedAt));

  const tagsByNoteId = await loadTagsForNotes(notes.map((n) => n.id));

  return ok(mergeNotesWithTags(notes, tagsByNoteId));
}

export async function getNote(
  noteId: string,
  userId?: string,
): Promise<Result<NoteWithTags, NotFoundError | UnauthorizedError>> {
  const conditions = [eq(notesTable.id, noteId)];

  if (userId) {
    conditions.push(
      sql`(${notesTable.userId} = ${userId} OR ${notesTable.isPublic} = true)`,
    );
  } else {
    conditions.push(eq(notesTable.isPublic, true));
  }

  const [note] = await db
    .select()
    .from(notesTable)
    .where(and(...conditions))
    .limit(1);

  if (!note) {
    return err(new NotFoundError("Note"));
  }

  const validatedNote = selectNoteSchema.parse(note);
  const tags = await loadTagsForNotes([validatedNote.id]);

  return ok({
    ...validatedNote,
    tags: tags.get(validatedNote.id) ?? [],
  });
}

export type UpdateNoteInput = Partial<Omit<NewNote, "userId">> & {
  tagNames?: string[];
};

export async function updateNote(
  noteId: string,
  userId: string,
  input: UpdateNoteInput,
): Promise<Result<NoteWithTags, NotFoundError | UnauthorizedError | ValidationError>> {
  const { tagNames, ...noteInput } = input;

  const [existing] = await db
    .select()
    .from(notesTable)
    .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, userId)))
    .limit(1);

  if (!existing) {
    return err(new NotFoundError("Note"));
  }

  const parsed = updateNoteSchema.safeParse(noteInput);

  if (!parsed.success) {
    return err(new ValidationError("Invalid note data"));
  }

  const [note] = await db
    .update(notesTable)
    .set(parsed.data)
    .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, userId)))
    .returning();

  const validatedNote = selectNoteSchema.parse(note);

  if (tagNames !== undefined) {
    await db
      .delete(noteTagsTable)
      .where(eq(noteTagsTable.noteId, validatedNote.id));
    await attachTags(validatedNote.id, validatedNote.userId, tagNames);
  }

  const tags = await loadTagsForNotes([validatedNote.id]);

  return ok({
    ...validatedNote,
    tags: tags.get(validatedNote.id) ?? [],
  });
}

export async function deleteNote(
  noteId: string,
  userId: string,
): Promise<Result<NoteWithTags, NotFoundError | UnauthorizedError>> {
  const noteResult = await getNote(noteId, userId);

  if (noteResult.isErr()) {
    return err(noteResult.error);
  }

  const note = noteResult.value;

  if (note.userId !== userId) {
    return err(new UnauthorizedError("Cannot delete another user's note"));
  }

  await db.delete(notesTable).where(eq(notesTable.id, noteId));

  return ok(note);
}
