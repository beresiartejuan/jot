import { create } from "zustand";
import {
	handleAuthError,
	login,
	logout,
	logoutAll,
	refresh,
	register,
} from "@/services/auth";
import type { ApiError } from "@/lib/api";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/lib/types";

type AuthState = {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: ApiError | null;

	setUser: (user: User | null) => void;
	setAccessToken: (token: string | null) => void;
	register: (input: RegisterInput) => Promise<void>;
	login: (input: LoginInput) => Promise<void>;
	refresh: () => Promise<void>;
	logout: () => Promise<void>;
	logoutAll: () => Promise<void>;
	clearError: () => void;
	reset: () => void;
};

const initialState = {
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

function applyAuthResponse(
	set: (partial: Partial<AuthState>) => void,
	response: AuthResponse
): void {
	set({
		user: response.user,
		accessToken: response.accessToken,
		isAuthenticated: true,
		isLoading: false,
		error: null,
	});
}

export const useAuthStore = create<AuthState>((set) => ({
	...initialState,

	setUser: (user) => set({ user }),

	setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: !!accessToken }),

	register: async (input) => {
		set({ isLoading: true, error: null });
		try {
			const response = await register(input);
			applyAuthResponse(set, response);
		} catch (error) {
			set({ isLoading: false, error: handleAuthError(error) });
			throw error;
		}
	},

	login: async (input) => {
		set({ isLoading: true, error: null });
		try {
			const response = await login(input);
			applyAuthResponse(set, response);
		} catch (error) {
			set({ isLoading: false, error: handleAuthError(error) });
			throw error;
		}
	},

	refresh: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await refresh();
			set({
				accessToken: response.accessToken,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			set({ isLoading: false, error: handleAuthError(error), isAuthenticated: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await logout();
			set({ ...initialState });
		} catch (error) {
			set({ isLoading: false, error: handleAuthError(error) });
			throw error;
		}
	},

	logoutAll: async () => {
		set({ isLoading: true, error: null });
		try {
			await logoutAll();
			set({ ...initialState });
		} catch (error) {
			set({ isLoading: false, error: handleAuthError(error) });
			throw error;
		}
	},

	clearError: () => set({ error: null }),

	reset: () => set({ ...initialState }),
}));
