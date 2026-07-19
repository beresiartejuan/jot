import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle(): React.JSX.Element {
	const { theme, setTheme, resolvedTheme } = useTheme();

	const cycle = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	const label =
		theme === "system"
			? `System (${resolvedTheme})`
			: theme.charAt(0).toUpperCase() + theme.slice(1);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={cycle}
			aria-label={`Theme: ${label}. Click to cycle.`}
			title={label}
		>
			<Sun
				className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				aria-hidden="true"
			/>
			<Moon
				className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				aria-hidden="true"
			/>
			<SunMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all data-[active=true]:rotate-0 data-[active=true]:scale-100" />
			<span className="sr-only">{label}</span>
		</Button>
	);
}
