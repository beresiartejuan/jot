import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";
import { ArrowRight, Loader2 } from "lucide-react";

export function SignupPage(): React.JSX.Element {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [validationError, setValidationError] = useState<string | null>(null);
	const { register, isLoading, error, isAuthenticated } = useAuthStore();
	const [, navigate] = useLocation();

	if (isAuthenticated) {
		navigate("/dashboard");
		return <div className="min-h-screen bg-background" />;
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setValidationError(null);

		if (password !== confirmPassword) {
			setValidationError("Passwords do not match.");
			return;
		}

		if (password.length < 8) {
			setValidationError("Password must be at least 8 characters.");
			return;
		}

		await register({ email, username, password });
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
				<div className="mx-auto flex h-16 max-w-7xl items-center">
					<Link href="/" className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
						<img src="/jot-icon.png" alt="" className="size-8" width={32} height={32} />
						<span className="font-heading text-xl font-semibold tracking-tight">Jot</span>
					</Link>
				</div>
			</header>

			<main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-sm">
					<div className="mb-8 text-center">
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
							Create your account
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Start capturing ideas in under a minute.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="jane-doe"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm password</Label>
							<Input
								id="confirm-password"
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>

						{(validationError || error) && (
							<p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
								{validationError || error?.message}
							</p>
						)}

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Creating account…
								</>
							) : (
								<>
									Create account
									<ArrowRight className="size-4" />
								</>
							)}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="font-medium text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
