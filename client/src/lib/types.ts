export type User = {
	id: string;
	email: string;
	username: string;
	createdAt: string;
	updatedAt: string;
};

export type Tag = {
	id: string;
	userId: string;
	name: string;
	color: string | null;
	createdAt: string;
};

export type Note = {
	id: string;
	userId: string;
	title: string;
	content: string;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
	tags: Tag[];
};

export type AuthResponse = {
	user: User;
	accessToken: string;
	expiresIn: number;
};

export type RefreshResponse = {
	accessToken: string;
	expiresIn: number;
};

export type RegisterInput = {
	email: string;
	username: string;
	password: string;
};

export type LoginInput = {
	email: string;
	password: string;
};

export type CreateNoteInput = {
	title: string;
	content: string;
	isPublic?: boolean;
	tagNames?: string[];
};

export type UpdateNoteInput = Partial<CreateNoteInput>;
