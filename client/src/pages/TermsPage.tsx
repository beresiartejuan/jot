import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Scale, Shield, User, Clock, Globe, Lock, AlertCircle } from "lucide-react";

const sections = [
  {
    icon: Scale,
    title: "1. Acceptance of Terms",
    content:
      "By creating an account or using Jot, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, do not use the service. We may update these terms as the product evolves; continued use after changes means you accept the revised terms.",
  },
  {
    icon: User,
    title: "2. Accounts and Eligibility",
    content:
      "You must provide a valid email address, username, and password to register. You are responsible for keeping your credentials secure. Jot uses short-lived access tokens (15 minutes) and long-lived refresh tokens (72 hours) stored in secure, httpOnly cookies scoped to /api/users. You may log out or invalidate all sessions at any time.",
  },
  {
    icon: FileText,
    title: "3. Your Content",
    content:
      "You retain ownership of the notes, tags, and other content you create. By default, notes are private and visible only to you. When you mark a note as public, you grant Jot the right to host and display that note to anyone with the link or access to public browsing areas.",
  },
  {
    icon: Globe,
    title: "4. Public Notes",
    content:
      "Public notes can be read without authentication. You are solely responsible for the content you publish publicly. Do not share personal data, copyrighted material you do not own, or content that violates applicable laws or the rights of others.",
  },
  {
    icon: Lock,
    title: "5. Prohibited Use",
    content:
      "You may not use Jot to distribute malware, spam, hate speech, harassment, illegal content, or to attempt unauthorized access to accounts or systems. We reserve the right to suspend or terminate accounts that violate these rules.",
  },
  {
    icon: Shield,
    title: "6. Security and Tokens",
    content:
      "Jot issues access tokens and refresh tokens for authentication. Access tokens expire after 15 minutes. Refresh tokens last up to 72 hours and are automatically rotated when close to expiration. You can invalidate all refresh tokens via the logout-all feature.",
  },
  {
    icon: Clock,
    title: "7. Service Availability",
    content:
      "We aim to keep Jot available, but we do not guarantee uptime. Notes are stored on our chosen database infrastructure. We recommend keeping backups of anything critical, especially content you publish publicly.",
  },
  {
    icon: AlertCircle,
    title: "8. Termination",
    content:
      "You may delete your account or log out all sessions at any time. We may suspend or terminate access for violations of these terms, security concerns, or legal requirements. Upon termination, your private notes will no longer be accessible and public notes may be removed.",
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
            <span className="font-heading text-xl font-semibold tracking-tight">Jot</span>
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
                <section key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Contact
            </h2>
            <p className="mt-2 text-muted-foreground">
              If you have questions about these terms, contact us through the
              channels provided on the Jot website.
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
