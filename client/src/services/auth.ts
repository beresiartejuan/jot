import { api, parseApiError, setAccessToken, type ApiError } from "@/lib/api";
import type {
	AuthResponse,
	LoginInput,
	RefreshResponse,
	RegisterInput,
	User,
} from "@/lib/types";

export async function register(input: RegisterInput): Promise<AuthResponse> {
	const response = await api.post<AuthResponse>("/users/register", input);
	setAccessToken(response.data.accessToken);
	return response.data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
	const response = await api.post<AuthResponse>("/users/login", input);
	setAccessToken(response.data.accessToken);
	return response.data;
}

export async function refresh(): Promise<RefreshResponse> {
	const response = await api.post<RefreshResponse>("/users/refresh", {});
	setAccessToken(response.data.accessToken);
	return response.data;
}

export async function logout(): Promise<{ message: string }> {
	const response = await api.post<{ message: string }>("/users/logout", {});
	setAccessToken(null);
	return response.data;
}

export async function logoutAll(): Promise<{ message: string; user: User }> {
	const response = await api.post<{ message: string; user: User }>("/users/logout-all", {});
	setAccessToken(null);
	return response.data;
}

export function handleAuthError(error: unknown): ApiError {
	return parseApiError(error);
}
