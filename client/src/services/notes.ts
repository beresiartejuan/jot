import { api, parseApiError, type ApiError } from "@/lib/api";
import type { CreateNoteInput, Note, UpdateNoteInput } from "@/lib/types";

export async function createNote(input: CreateNoteInput): Promise<Note> {
	const response = await api.post<Note>("/notes", input);
	return response.data;
}

export async function listNotes(): Promise<Note[]> {
	const response = await api.get<Note[]>("/notes");
	return response.data;
}

export async function getNote(id: string): Promise<Note> {
	const response = await api.get<Note>(`/notes/${id}`);
	return response.data;
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
	const response = await api.patch<Note>(`/notes/${id}`, input);
	return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
	const response = await api.delete<Note>(`/notes/${id}`);
	return response.data;
}

export function handleNotesError(error: unknown): ApiError {
	return parseApiError(error);
}
