import {
	AlertCircle,
	ArrowLeft,
	Check,
	Globe,
	Loader2,
	Lock,
	Save,
	StickyNote,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { Editor } from "@/components/Editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/auth";
import { useNotesStore } from "@/stores/notes";

function formatDateTime(date: string): string {
	return new Date(date).toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
}

function parseTagNames(value: string): string[] {
	return value
		.split(",")
		.map((tag) => tag.trim().toLowerCase())
		.filter(Boolean);
}

export function NoteEditPage(): React.JSX.Element {
	const params = useParams<"/notes/:id">();
	const id = params.id;
	const [, navigate] = useLocation();
	const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
	const {
		currentNote,
		isLoading: notesLoading,
		error,
		getNote,
		updateNote,
		clearError,
		clearCurrentNote,
	} = useNotesStore();

	const [title, setTitle] = useState("");
	const [tagsInput, setTagsInput] = useState("");
	const [content, setContent] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
	const [isNotFound, setIsNotFound] = useState(false);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			navigate("/login");
		}
	}, [authLoading, isAuthenticated, navigate]);

	useEffect(() => {
		if (!id || !isAuthenticated) return;

		setIsNotFound(false);
		clearError();
		getNote(id).catch(() => {
			setIsNotFound(true);
		});

		return () => {
			clearCurrentNote();
		};
	}, [id, isAuthenticated, getNote, clearError, clearCurrentNote]);

	useEffect(() => {
		if (currentNote) {
			setTitle(currentNote.title);
			setContent(currentNote.content);
			setIsPublic(currentNote.isPublic);
			setTagsInput(currentNote.tags.map((tag) => tag.name).join(", "));
			setLastSavedAt(currentNote.updatedAt);
			setSaveError(null);
		}
	}, [currentNote]);

	const hasChanges = useMemo(() => {
		if (!currentNote) return false;

		const currentTagNames = currentNote.tags.map((tag) => tag.name).join(",");
		const newTagNames = parseTagNames(tagsInput).join(",");

		return (
			title.trim() !== currentNote.title ||
			content !== currentNote.content ||
			isPublic !== currentNote.isPublic ||
			currentTagNames !== newTagNames
		);
	}, [currentNote, title, content, isPublic, tagsInput]);

	const handleSave = useCallback(async () => {
		if (!id || !hasChanges) return;

		setIsSaving(true);
		setSaveError(null);

		try {
			const updated = await updateNote(id, {
				title: title.trim(),
				content,
				isPublic,
				tagNames: parseTagNames(tagsInput),
			});
			setLastSavedAt(updated.updatedAt);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to save note";
			setSaveError(message);
		} finally {
			setIsSaving(false);
		}
	}, [id, hasChanges, title, content, isPublic, tagsInput, updateNote]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault();
				void handleSave();
			}
		},
		[handleSave],
	);

	if (authLoading || !isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	if (isNotFound) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
				<div className="inline-flex rounded-2xl bg-leaf-100 p-4 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300">
					<StickyNote className="size-8" />
				</div>
				<h1 className="font-heading text-2xl font-semibold text-foreground">
					Note not found
				</h1>
				<p className="max-w-sm text-sm text-muted-foreground">
					The note you are looking for does not exist or you do not have
					permission to view it.
				</p>
				<Button asChild className="mt-2">
					<Link href="/dashboard">
						<ArrowLeft className="mr-2 size-4" />
						Back to dashboard
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Header */}
			<header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
				<div className="mx-auto flex h-16 max-w-5xl items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link href="/dashboard">
								<ArrowLeft className="mr-1.5 size-4" />
								Dashboard
							</Link>
						</Button>
						<Separator orientation="vertical" className="hidden h-6 sm:block" />
						<span className="hidden text-sm text-muted-foreground sm:block">
							{notesLoading ? "Loading note…" : "Editing note"}
						</span>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							{isPublic ? (
								<Globe className="size-4 text-leaf-500" />
							) : (
								<Lock className="size-4" />
							)}
							<span className="hidden sm:inline">
								{isPublic ? "Public" : "Private"}
							</span>
						</div>
						<Button
							onClick={handleSave}
							disabled={!hasChanges || isSaving || notesLoading}
							size="sm"
						>
							{isSaving ? (
								<Loader2 className="mr-1.5 size-4 animate-spin" />
							) : hasChanges ? (
								<Save className="mr-1.5 size-4" />
							) : (
								<Check className="mr-1.5 size-4" />
							)}
							{isSaving ? "Saving…" : hasChanges ? "Save" : "Saved"}
						</Button>
					</div>
				</div>
			</header>

			{/* Main */}
			<main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-5xl flex-col gap-6">
					{error && (
						<div className="flex items-center gap-3 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
							<AlertCircle className="size-4 shrink-0" />
							<span>{error.message}</span>
						</div>
					)}

					{saveError && (
						<div className="flex items-center gap-3 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
							<AlertCircle className="size-4 shrink-0" />
							<span>{saveError}</span>
						</div>
					)}

					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="note-title" className="text-sm font-medium">
							Title
						</Label>
						<Input
							id="note-title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Note title"
							className="h-12 text-lg font-semibold"
							disabled={notesLoading}
						/>
					</div>

					{/* Meta row */}
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="note-tags" className="text-sm font-medium">
								Tags
							</Label>
							<Input
								id="note-tags"
								value={tagsInput}
								onChange={(e) => setTagsInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="ideas, personal, work"
								disabled={notesLoading}
							/>
							<p className="text-xs text-muted-foreground">
								Separate tags with commas.
							</p>
						</div>

						<div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4 sm:flex-col sm:justify-start">
							<div className="space-y-1">
								<Label htmlFor="note-public" className="text-sm font-medium">
									Visibility
								</Label>
								<p className="text-xs text-muted-foreground">
									{isPublic
										? "Anyone with the link can read this note."
										: "Only you can see this note."}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Lock className="size-4 text-muted-foreground" />
								<Switch
									id="note-public"
									checked={isPublic}
									onCheckedChange={setIsPublic}
									disabled={notesLoading}
								/>
								<Globe className="size-4 text-leaf-500" />
							</div>
						</div>
					</div>

					{/* Editor */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">Content</Label>
							<Badge variant="secondary" className="text-xs">
								Markdown
							</Badge>
						</div>
						<Editor
							content={content}
							onChange={setContent}
							placeholder="Start writing your note in Markdown…"
							className="min-h-[28rem]"
							disabled={notesLoading || isSaving}
						/>
					</div>

					{/* Footer info */}
					<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
						<span>
							{lastSavedAt
								? `Last saved ${formatDateTime(lastSavedAt)}`
								: "Not saved yet"}
							{user && ` · ${user.username}`}
						</span>
						<span>Tip: press Ctrl/Cmd + S to save</span>
					</div>
				</div>
			</main>
		</div>
	);
}
