import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
	FileText,
	Scale,
	Shield,
	User,
	Clock,
	Globe,
	Lock,
	AlertCircle,
	Mail,
} from "lucide-react";

const sections = [
	{
		icon: Scale,
		title: "What you are agreeing to",
		content:
			"By using Jot, you accept these Terms and our Privacy Policy. If anything here does not work for you, please do not use the service. We will update these terms as Jot grows, and we will always show the latest effective date at the top of the page.",
	},
	{
		icon: User,
		title: "Your account",
		content:
			"To write and save notes, you need an email, username, and password. Keep your password safe. Jot authenticates you with a short-lived access token (15 minutes) and a long-lived refresh token stored in a secure, httpOnly cookie. You can log out or invalidate every session at once from your account settings.",
	},
	{
		icon: FileText,
		title: "Your notes belong to you",
		content:
			"You keep ownership of everything you create in Jot: notes, tags, and any public content. We only host it so you can access and share it. By default, every note is private. You decide what becomes public.",
	},
	{
		icon: Globe,
		title: "When you make a note public",
		content:
			"Public notes can be read by anyone, even without an account. You are responsible for what you publish. Do not share personal information you should not make public, copyrighted material you do not have rights to, or anything illegal or harmful.",
	},
	{
		icon: Lock,
		title: "What you cannot do",
		content:
			"Do not use Jot to distribute malware, spam, abuse, harassment, illegal content, or to break into accounts or systems. We may suspend or close accounts that violate these rules.",
	},
	{
		icon: Shield,
		title: "How we keep you logged in",
		content:
			"Access tokens expire after 15 minutes. Refresh tokens last up to 72 hours and live in a secure cookie scoped to /api/users. If a refresh token is about to expire, we issue a new one automatically. Use Log out everywhere if you want to invalidate every active session immediately.",
	},
	{
		icon: Clock,
		title: "Service availability",
		content:
			"We work to keep Jot online, but no service is perfect. We do not guarantee 100% uptime. If a note matters to you, especially a public one, keep a backup somewhere safe.",
	},
	{
		icon: AlertCircle,
		title: "Closing your account",
		content:
			"You can delete your account or log out all sessions at any time. We may also suspend or terminate access for violations of these terms, security issues, or legal requirements. When an account is closed, private notes become inaccessible and public notes may be removed.",
	},
];

export function TermsPage(): React.JSX.Element {
	const lastUpdated = "July 19, 2026";

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
						<span className="font-heading text-xl font-semibold tracking-tight">
							Jot
						</span>
					</Link>
					<nav className="flex items-center gap-1">
						<Button variant="ghost" size="sm" asChild>
							<Link href="/">Back home</Link>
						</Button>
					</nav>
				</div>
			</header>

			<main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<div className="mb-12 text-center">
						<h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
							Terms and Conditions
						</h1>
						<p className="mt-4 text-muted-foreground">
							Last updated: {lastUpdated}
						</p>
					</div>

					<div className="space-y-10">
						{sections.map((section) => {
							const Icon = section.icon;
							return (
								<section
									key={section.title}
									className="rounded-2xl border border-border bg-card p-6 shadow-sm"
								>
									<div className="mb-4 flex items-center gap-3">
										<div className="inline-flex rounded-xl bg-leaf-100 p-2.5 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300">
											<Icon className="size-5" aria-hidden="true" />
										</div>
										<h2 className="font-heading text-xl font-semibold text-card-foreground">
											{section.title}
										</h2>
									</div>
									<p className="leading-relaxed text-muted-foreground">
										{section.content}
									</p>
								</section>
							);
						})}
					</div>

					<div className="mt-12 rounded-2xl border border-border bg-leaf-100/60 p-6 dark:bg-leaf-900/40">
						<div className="mb-3 flex items-center gap-3">
							<div className="inline-flex rounded-xl bg-leaf-200 p-2.5 text-leaf-800 dark:bg-leaf-800 dark:text-leaf-200">
								<Mail className="size-5" aria-hidden="true" />
							</div>
							<h2 className="font-heading text-lg font-semibold text-foreground">
								Questions about these terms?
							</h2>
						</div>
						<p className="text-muted-foreground">
							Reach out through the contact channels listed on the Jot
							website. We read every message.
						</p>
					</div>
				</div>
			</main>

			<footer className="border-t border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center gap-2">
						<img
							src="/jot-icon.png"
							alt=""
							className="size-6"
							width={24}
							height={24}
						/>
						<span className="font-heading font-semibold text-foreground">
							Jot
						</span>
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
