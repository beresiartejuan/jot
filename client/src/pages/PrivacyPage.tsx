import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
	Database,
	Eye,
	Lock,
	Globe,
	Clock,
	Mail,
	UserCog,
	Cookie,
	Server,
	ShieldCheck,
} from "lucide-react";

const summaryItems = [
	{
		icon: Database,
		label: "What we collect",
		value: "Email, username, password hash, notes, tags, and basic usage data.",
	},
	{
		icon: Eye,
		label: "What we do with it",
		value: "Run your account, keep Jot secure, and improve the product.",
	},
	{
		icon: Clock,
		label: "How long we keep it",
		value: "Until you delete your account, or as required by law.",
	},
	{
		icon: UserCog,
		label: "Your rights",
		value: "Access, update, export, or delete your data at any time.",
	},
];

const sections = [
	{
		icon: Database,
		title: "Information we collect",
		content: `
We collect only what Jot needs to work.

**Account information**: email address, username, and a hashed version of your password. We do not store plain-text passwords.

**Your content**: notes, titles, tags, and the public/private setting you choose for each note.

**Usage data**: basic event logs such as when you create or update a note, error logs, and device type. This helps us keep the service running and fix bugs.

**Technical data**: IP address, browser type, and information needed to secure your session.

We do not collect payment information, location data beyond IP-derived region, health data, biometric data, or data about children.
		`,
	},
	{
		icon: Eye,
		title: "How we use your information",
		content: `
We use your data to:

- Provide and maintain your account, notes, and tags.
- Authenticate you and keep you signed in across sessions.
- Secure Jot against abuse, fraud, and unauthorized access.
- Improve the product based on how people use it.
- Respond to support requests and legal obligations.

We do not sell your personal information. We do not use your notes to train third-party AI models.
		`,
	},
	{
		icon: Server,
		title: "How we share information",
		content: `
We share data only when necessary:

**Service providers**: hosting, database, and error-tracking services that help run Jot. They only access data needed to perform their work and are bound by confidentiality and security obligations.

**Legal requirements**: we may disclose information if required by law, court order, or to protect rights, safety, or security.

**With your consent**: when you choose to make a note public, that note is visible to anyone who accesses it.
		`,
	},
	{
		icon: Globe,
		title: "Where your data is stored",
		content: `
Your data is stored in the cloud through our database and hosting providers. Those providers may process data in regions outside your own. We rely on standard contractual safeguards and security practices to protect your information wherever it is processed.
		`,
	},
	{
		icon: Clock,
		title: "How long we keep your data",
		content: `
We keep your account and content for as long as your account is active. If you delete your account, we remove your private notes and personal information within a reasonable period, unless we need to retain something for legal or security reasons.

Public notes remain visible until you delete them or close your account.

Refresh tokens expire after 72 hours. Access tokens expire after 15 minutes.
		`,
	},
	{
		icon: UserCog,
		title: "Your choices and rights",
		content: `
Depending on where you live, you may have rights to:

- Access the personal information we hold about you.
- Correct inaccurate account information.
- Delete your account and associated data.
- Export your notes for portability.
- Object to or limit certain processing.
- Withdraw consent where processing is consent-based.

To exercise these rights, contact us through the channels listed on the Jot website. We will respond as quickly as we can.
		`,
	},
	{
		icon: Cookie,
		title: "Cookies and tokens",
		content: `
Jot uses a small number of cookies and tokens to keep you signed in:

**Access token**: a short-lived token stored in memory by the app. It lasts 15 minutes and is sent with each authenticated request.

**Refresh token**: a long-lived token stored in a secure, httpOnly, SameSite=Strict cookie scoped to /api/users. It lasts up to 72 hours and is automatically rotated near expiration.

**Theme preference**: we store your selected light/dark/system mode in localStorage so the site looks right when you return.

We do not use advertising or third-party tracking cookies.
		`,
	},
	{
		icon: Lock,
		title: "Security",
		content: `
We protect your data with encryption in transit, hashed passwords, secure authentication tokens, access controls, and regular dependency updates. No system is perfectly secure, but we take security seriously and will notify you of any breach that affects your personal information as required by law.
		`,
	},
	{
		icon: ShieldCheck,
		title: "Children's privacy",
		content: `
Jot is not directed at children under 13, and we do not knowingly collect information from them. If you believe a child has created an account without permission, contact us and we will delete the account.
		`,
	},
];

export function PrivacyPage(): React.JSX.Element {
	const lastUpdated = "July 19, 2026";

	const renderParagraphs = (text: string) =>
		text.trim().split("\n\n").map((paragraph) => {
			if (paragraph.startsWith("- ")) {
				const items = paragraph.split("\n").map((line) => line.replace(/^- /, ""));
				return (
					<ul className="my-3 list-disc space-y-1 pl-5 text-muted-foreground">
						{items.map((item) => (
							<li key={item.slice(0, 40)}>{item}</li>
						))}
					</ul>
				);
			}

			if (paragraph.startsWith("**") && paragraph.includes("**:")) {
				const [boldPart, ...rest] = paragraph.split(":");
				const label = boldPart.replace(/\*\*/g, "").trim();
				const body = rest.join(":").trim();
				return (
					<p key={label} className="my-3 text-muted-foreground">
						<strong className="text-card-foreground">{label}:</strong> {body}
					</p>
				);
			}

			return (
				<p key={paragraph.slice(0, 40)} className="my-3 text-muted-foreground">
					{paragraph}
				</p>
			);
		});

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
							Privacy Policy
						</h1>
						<p className="mt-4 text-muted-foreground">
							Last updated: {lastUpdated}
						</p>
					</div>

					<div className="mb-12 grid gap-4 sm:grid-cols-2">
						{summaryItems.map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.label}
									className="rounded-2xl border border-border bg-card p-5 shadow-sm"
								>
									<div className="mb-3 inline-flex rounded-xl bg-leaf-100 p-2 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300">
										<Icon className="size-4" aria-hidden="true" />
									</div>
									<p className="text-sm font-semibold text-card-foreground">
										{item.label}
									</p>
									<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
										{item.value}
									</p>
								</div>
							);
						})}
					</div>

					<div className="mb-10 rounded-2xl border border-leaf-200 bg-leaf-100/50 p-6 dark:border-leaf-800 dark:bg-leaf-900/40">
						<p className="text-sm leading-relaxed text-leaf-900 dark:text-leaf-100">
							<strong>Plain-language summary:</strong> Jot collects the bare
							minimum needed to run your account: your email, username, password
							hash, notes, and tags. We use it to provide the service, keep your
							account safe, and make Jot better. You can delete your account and
							data at any time. We do not sell your information.
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
									{renderParagraphs(section.content)}
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
								Questions about your privacy?
							</h2>
						</div>
						<p className="text-muted-foreground">
							Contact us through the channels listed on the Jot website. We
							read every message and will help you exercise your rights.
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							This policy is for informational purposes and is not legal advice.
							Please have a qualified attorney review it before publication.
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
