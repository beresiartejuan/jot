import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth";
import { useNotesStore } from "@/stores/notes";
import {
	Plus,
	Trash2,
	Loader2,
	MoreVertical,
	LogOut,
	StickyNote,
	Globe,
	Lock,
	Eye,
	Construction,
	Search,
} from "lucide-react";

function formatDate(date: string): string {
	return new Date(date).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

export function DashboardPage(): React.JSX.Element {
	const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
	const { notes, isLoading: notesLoading, error, listNotes, createNote, deleteNote } = useNotesStore();
	const [, navigate] = useLocation();

	const [newTitle, setNewTitle] = useState("");
	const [newTags, setNewTags] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			navigate("/login");
		}
	}, [authLoading, isAuthenticated, navigate]);

	useEffect(() => {
		if (isAuthenticated) {
			listNotes();
		}
	}, [isAuthenticated, listNotes]);

	const handleCreate = useCallback(async () => {
		const title = newTitle.trim();
		if (!title) return;

		const tagNames = newTags
			.split(",")
			.map((tag) => tag.trim().toLowerCase())
			.filter(Boolean);

		await createNote({ title, content: "", tagNames });
		setNewTitle("");
		setNewTags("");
		setIsCreateDialogOpen(false);
	}, [newTitle, newTags, createNote]);

	const handleDelete = useCallback(
		async (id: string) => {
			setDeletingId(id);
			await deleteNote(id);
			setDeletingId(null);
		},
		[deleteNote],
	);

	const handleLogout = useCallback(async () => {
		await logout();
		navigate("/login");
	}, [logout, navigate]);

	if (authLoading || !isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	const filteredNotes = notes.filter((note) => {
		const query = searchQuery.toLowerCase();
		return (
			note.title.toLowerCase().includes(query) ||
			note.tags.some((tag) => tag.name.toLowerCase().includes(query))
		);
	});

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Header */}
			<header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/" className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
							<img src="/jot-icon.png" alt="" className="size-7" width={28} height={28} />
							<span className="font-heading text-lg font-semibold tracking-tight">Jot</span>
						</Link>
						<Separator orientation="vertical" className="hidden h-6 sm:block" />
						<span className="hidden text-sm text-muted-foreground sm:block">Dashboard</span>
					</div>

					<div className="flex items-center gap-2">
						<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
							<DialogTrigger asChild>
								<Button size="sm">
									<Plus className="size-4" />
									<span className="hidden sm:inline">New note</span>
									<span className="sm:hidden">New</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Create a new note</DialogTitle>
									<DialogDescription>
										Give it a title and some tags. You will be able to add content soon.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="note-title">Title</Label>
										<Input
											id="note-title"
											placeholder="e.g., Weekend ideas"
											value={newTitle}
											onChange={(e) => setNewTitle(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="note-tags">Tags</Label>
										<Input
											id="note-tags"
											placeholder="ideas, personal, work"
											value={newTags}
											onChange={(e) => setNewTags(e.target.value)}
										/>
										<p className="text-xs text-muted-foreground">Separate tags with commas.</p>
									</div>
								</div>
								<DialogFooter>
									<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleCreate} disabled={!newTitle.trim()}>
										Create note
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="rounded-full">
									<Avatar className="size-8">
										<AvatarFallback className="bg-leaf-100 text-leaf-800 dark:bg-leaf-900 dark:text-leaf-100">
											{user?.username?.slice(0, 2).toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<div className="px-2 py-1.5">
									<p className="text-sm font-medium text-foreground">{user?.username}</p>
									<p className="text-xs text-muted-foreground">{user?.email}</p>
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem disabled>
									<Construction className="mr-2 size-4" />
									Account settings
									<Badge variant="outline" className="ml-auto">Soon</Badge>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 size-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Main */}
			<main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-6xl">
					<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
								Your notes
							</h1>
							<p className="text-sm text-muted-foreground">
								{notes.length} {notes.length === 1 ? "note" : "notes"} saved
							</p>
						</div>
						<div className="relative max-w-xs">
							<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search notes or tags…"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					{error && (
						<div className="mb-6 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
							{error.message}
						</div>
					)}

					{notesLoading ? (
						<div className="flex h-48 items-center justify-center">
							<Loader2 className="size-8 animate-spin text-primary" />
						</div>
					) : filteredNotes.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
							<div className="mb-4 inline-flex rounded-2xl bg-leaf-100 p-4 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300">
								<StickyNote className="size-8" />
							</div>
							<h3 className="font-heading text-lg font-semibold text-card-foreground">
								{searchQuery ? "No notes match your search" : "No notes yet"}
							</h3>
							<p className="mt-2 max-w-xs text-sm text-muted-foreground">
								{searchQuery
									? "Try a different keyword or tag."
									: "Create your first note to start building your personal knowledge garden."}
							</p>
							{!searchQuery && (
								<Button className="mt-6" onClick={() => setIsCreateDialogOpen(true)}>
									<Plus className="size-4" />
									Create note
								</Button>
							)}
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{filteredNotes.map((note) => (
								<article
									key={note.id}
									className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-leaf-300 hover:shadow-md dark:hover:border-leaf-700"
								>
									<div className="mb-3 flex items-start justify-between gap-3">
										<div className="flex items-center gap-2">
											{note.isPublic ? (
												<Globe className="size-4 text-leaf-500" aria-label="Public note" />
											) : (
												<Lock className="size-4 text-muted-foreground" aria-label="Private note" />
											)}
											<span className="text-xs text-muted-foreground">
												{formatDate(note.updatedAt)}
											</span>
										</div>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="-mr-2 -mt-2 size-8 opacity-0 group-hover:opacity-100">
													<MoreVertical className="size-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem disabled>
													<Eye className="mr-2 size-4" />
													View content
													<Badge variant="outline" className="ml-auto">Soon</Badge>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleDelete(note.id)}
													disabled={deletingId === note.id}
													className="text-destructive focus:text-destructive"
												>
													{deletingId === note.id ? (
														<Loader2 className="mr-2 size-4 animate-spin" />
													) : (
														<Trash2 className="mr-2 size-4" />
													)}
													Delete note
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									<h3 className="font-heading text-base font-semibold text-card-foreground">
										{note.title}
									</h3>

									{note.tags.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-1.5">
											{note.tags.map((tag) => (
												<Badge key={tag.id} variant="secondary" className="text-xs">
													{tag.name}
												</Badge>
											))}
										</div>
									)}

									<div className="mt-auto flex items-center gap-2 pt-4">
										<Button
											variant="outline"
											size="sm"
											className="w-full"
											disabled
										>
											<Construction className="mr-2 size-4" />
											Edit content
										</Button>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
