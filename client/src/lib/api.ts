import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type ApiError = {
	code: string;
	message: string;
	status?: number;
};

export const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
	// Refresh cookie is scoped to /api/users, but /api/users/* requests will
	// carry it automatically because withCredentials is true and the backend
	// allows the frontend origin.
});

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

export function setAccessToken(token: string | null): void {
	accessToken = token;
}

export function getAccessToken(): string | null {
	return accessToken;
}

function subscribeRefresh(callback: (token: string) => void): void {
	refreshSubscribers.push(callback);
}

function onRefreshed(token: string): void {
	refreshSubscribers.forEach((callback) => {
		callback(token);
	});
	refreshSubscribers = [];
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	if (accessToken && config.headers) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve) => {
					subscribeRefresh((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(api(originalRequest));
					});
				});
			}

			isRefreshing = true;

			try {
				const response = await axios.post<{ accessToken: string; expiresIn: number }>(
					`${API_BASE_URL}/api/users/refresh`,
					{},
					{ withCredentials: true }
				);

				const newToken = response.data.accessToken;
				setAccessToken(newToken);
				onRefreshed(newToken);

				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				setAccessToken(null);
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export function parseApiError(error: unknown): ApiError {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data;
		return {
			code: typeof data?.error === "string" ? data.error : "UNKNOWN_ERROR",
			message: typeof data?.message === "string" ? data.message : error.message,
			status: error.response?.status,
		};
	}

	if (error instanceof Error) {
		return { code: "UNKNOWN_ERROR", message: error.message };
	}

	return { code: "UNKNOWN_ERROR", message: "An unexpected error occurred" };
}
