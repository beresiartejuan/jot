import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Tag, Share2, RefreshCw, ArrowRight, Sparkles } from "lucide-react";

const features = [
	{
		icon: FileText,
		title: "Write freely",
		description:
			"Capture ideas, drafts, and reminders in a clean editor designed to get out of your way.",
	},
	{
		icon: Tag,
		title: "Organize with tags",
		description:
			"Group notes by topic so you can find the right thought the moment you need it.",
	},
	{
		icon: Share2,
		title: "Share publicly",
		description:
			"Mark any note as public and share it with a link. Keep the rest private by default.",
	},
	{
		icon: RefreshCw,
		title: "Stay in sync",
		description:
			"Your notes follow you across devices with secure tokens and automatic refresh.",
	},
];

const steps = [
	{
		step: "01",
		title: "Create an account",
		description: "Sign up in seconds. No credit card, no clutter.",
	},
	{
		step: "02",
		title: "Write your first note",
		description: "Add a title, content, and tags that make sense to you.",
	},
	{
		step: "03",
		title: "Share or keep it",
		description: "Publish it for the world or lock it away for your eyes only.",
	},
];

export function LandingPage(): React.JSX.Element {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<Link
						href="/"
						className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
					>
						<img
							src="/jot-icon.png"
							alt=""
							className="size-8"
							width={32}
							height={32}
						/>
						<span className="font-heading text-xl font-semibold tracking-tight">Jot</span>
					</Link>
					<nav className="hidden items-center gap-1 sm:flex">
						<Button variant="ghost" size="sm" asChild>
							<Link href="/explore">Explore</Link>
						</Button>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/login">Log in</Link>
						</Button>
						<Button size="sm" asChild>
							<Link href="/signup">Start writing</Link>
						</Button>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
					<div className="absolute inset-0 -z-10 bg-gradient-to-br from-leaf-100/60 via-background to-leaf-200/30 dark:from-leaf-900/30 dark:to-leaf-950" />
					<div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
						<div className="max-w-2xl">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-leaf-100/60 px-3 py-1 text-xs font-medium text-leaf-800 dark:border-leaf-800 dark:bg-leaf-900/60 dark:text-leaf-200">
								<Sparkles className="size-3.5" aria-hidden="true" />
								<span>Notes that grow with you</span>
							</div>
							<h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								Capture ideas.{" "}
								<span className="text-primary">Share the good ones.</span>
							</h1>
							<p className="mt-6 text-lg leading-relaxed text-muted-foreground">
								Jot is a minimal notes app built for people who want to write fast,
								organize lightly, and publish selectively. Your thoughts, your tags,
								your audience.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-3">
								<Button size="lg" asChild>
									<Link href="/signup">
										Start writing
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<Link href="/explore">Browse public notes</Link>
								</Button>
							</div>
							<p className="mt-4 text-sm text-muted-foreground">
								No account required to read public notes.
							</p>
						</div>

						<div className="relative mx-auto w-full max-w-md lg:max-w-none">
							<div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-leaf-300/30 to-leaf-500/20 blur-2xl dark:from-leaf-700/20 dark:to-leaf-500/10" />
							<article className="relative rounded-2xl border border-border bg-card p-6 shadow-xl shadow-leaf-900/5 dark:shadow-black/20">
								<div className="mb-4 flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-leaf-400" />
									<div className="h-3 w-3 rounded-full bg-leaf-300" />
									<div className="h-3 w-3 rounded-full bg-sage-200" />
								</div>
								<h3 className="font-heading text-lg font-semibold text-card-foreground">
									Product roadmap — Q3
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									1. Launch beta landing page
									<br />
									2. Add collaborative tags
									<br />
									3. Publish first public note
								</p>
								<div className="mt-5 flex flex-wrap gap-2">
									<span className="inline-flex items-center rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-medium text-leaf-800 dark:bg-leaf-900 dark:text-leaf-200">
										work
									</span>
									<span className="inline-flex items-center rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-medium text-leaf-800 dark:bg-leaf-900 dark:text-leaf-200">
										ideas
									</span>
									<span className="inline-flex items-center rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-medium text-leaf-800 dark:bg-leaf-900 dark:text-leaf-200">
										public
									</span>
								</div>
								<div className="mt-6 flex items-center justify-between border-t border-border pt-4">
									<span className="text-xs text-muted-foreground">
										Last edited just now
									</span>
									<Share2 className="size-4 text-leaf-500" aria-hidden="true" />
								</div>
							</article>
						</div>
					</div>
				</section>

				<section className="px-4 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="mb-12 max-w-2xl">
							<h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
								Everything you need, nothing you do not
							</h2>
							<p className="mt-4 text-muted-foreground">
								A focused toolset for capturing, finding, and sharing your notes.
							</p>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{features.map((feature) => {
								const Icon = feature.icon;
								return (
									<div
										key={feature.title}
										className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-leaf-300 hover:shadow-md dark:hover:border-leaf-700"
									>
										<div className="mb-4 inline-flex rounded-xl bg-leaf-100 p-3 text-leaf-700 transition-colors group-hover:bg-leaf-200 dark:bg-leaf-900 dark:text-leaf-300 dark:group-hover:bg-leaf-800">
											<Icon className="size-5" aria-hidden="true" />
										</div>
										<h3 className="font-heading text-lg font-semibold text-card-foreground">
											{feature.title}
										</h3>
										<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
											{feature.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				<section className="border-y border-border bg-leaf-100/40 px-4 py-20 dark:bg-leaf-900/20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							How it works
						</h2>
						<div className="mt-12 grid gap-8 md:grid-cols-3">
							{steps.map((item, index) => (
								<div key={item.step} className="relative">
									{index !== steps.length - 1 && (
										<div className="absolute left-8 top-12 hidden h-px w-[calc(100%-2rem)] bg-border md:block" />
									)}
									<div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-leaf-300 bg-leaf-200/60 text-xl font-semibold text-leaf-900 dark:border-leaf-700 dark:bg-leaf-800 dark:text-leaf-100">
										{item.step}
									</div>
									<h3 className="font-heading text-lg font-semibold text-foreground">
										{item.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="px-4 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl rounded-3xl bg-leaf-700 px-6 py-16 text-center text-white shadow-xl shadow-leaf-900/15 dark:bg-leaf-600 sm:px-12">
						<h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
							Ready to jot something down?
						</h2>
						<p className="mx-auto mt-4 max-w-lg text-leaf-100">
							Create your free account and start building your personal
							knowledge garden today.
						</p>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<Button
								size="lg"
								variant="secondary"
								className="bg-white text-leaf-800 hover:bg-leaf-50"
								asChild
							>
								<Link href="/signup">Create free account</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-leaf-500/40 bg-transparent text-white hover:bg-leaf-600 hover:text-white"
								asChild
							>
								<Link href="/explore">Explore notes</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center gap-2">
						<img
							src="/jot-icon.png"
							alt=""
							className="size-6"
							width={24}
							height={24}
						/>
						<span className="font-heading font-semibold text-foreground">Jot</span>
					</div>
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Jot. Capture, organize, share.
					</p>
					<div className="flex gap-4 text-sm text-muted-foreground">
						<Link href="/privacy" className="hover:text-foreground">
							Privacy
						</Link>
						<Link href="/terms" className="hover:text-foreground">
							Terms
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
