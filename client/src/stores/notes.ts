import { create } from "zustand";
import {
	createNote,
	deleteNote,
	getNote,
	handleNotesError,
	listNotes,
	updateNote,
} from "@/services/notes";
import type { ApiError } from "@/lib/api";
import type { CreateNoteInput, Note, UpdateNoteInput } from "@/lib/types";

type NotesState = {
	notes: Note[];
	currentNote: Note | null;
	isLoading: boolean;
	error: ApiError | null;

	listNotes: () => Promise<void>;
	getNote: (id: string) => Promise<void>;
	createNote: (input: CreateNoteInput) => Promise<Note>;
	updateNote: (id: string, input: UpdateNoteInput) => Promise<Note>;
	deleteNote: (id: string) => Promise<void>;
	clearCurrentNote: () => void;
	clearError: () => void;
	reset: () => void;
};

const initialState = {
	notes: [],
	currentNote: null,
	isLoading: false,
	error: null,
};

export const useNotesStore = create<NotesState>((set, get) => ({
	...initialState,

	listNotes: async () => {
		set({ isLoading: true, error: null });
		try {
			const notes = await listNotes();
			set({ notes, isLoading: false });
		} catch (error) {
			set({ isLoading: false, error: handleNotesError(error) });
			throw error;
		}
	},

	getNote: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const note = await getNote(id);
			set({ currentNote: note, isLoading: false });
		} catch (error) {
			set({ isLoading: false, error: handleNotesError(error) });
			throw error;
		}
	},

	createNote: async (input) => {
		set({ isLoading: true, error: null });
		try {
			const note = await createNote(input);
			set({
				notes: [note, ...get().notes],
				currentNote: note,
				isLoading: false,
			});
			return note;
		} catch (error) {
			set({ isLoading: false, error: handleNotesError(error) });
			throw error;
		}
	},

	updateNote: async (id, input) => {
		set({ isLoading: true, error: null });
		try {
			const updated = await updateNote(id, input);
			set({
				notes: get().notes.map((note) => (note.id === id ? updated : note)),
				currentNote: updated,
				isLoading: false,
			});
			return updated;
		} catch (error) {
			set({ isLoading: false, error: handleNotesError(error) });
			throw error;
		}
	},

	deleteNote: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await deleteNote(id);
			set({
				notes: get().notes.filter((note) => note.id !== id),
				currentNote: get().currentNote?.id === id ? null : get().currentNote,
				isLoading: false,
			});
		} catch (error) {
			set({ isLoading: false, error: handleNotesError(error) });
			throw error;
		}
	},

	clearCurrentNote: () => set({ currentNote: null }),

	clearError: () => set({ error: null }),

	reset: () => set({ ...initialState }),
}));
