import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
	resolvedTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "jot-theme",
	...props
}: ThemeProviderProps): React.JSX.Element {
	const [theme, setThemeState] = useState<Theme>(() => {
		try {
			const stored = localStorage.getItem(storageKey) as Theme | null;
			return stored ?? defaultTheme;
		} catch {
			return defaultTheme;
		}
	});

	const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
		"light",
	);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");

		let applied: "dark" | "light";
		if (theme === "system") {
			applied = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		} else {
			applied = theme;
		}

		root.classList.add(applied);
		setResolvedTheme(applied);
	}, [theme]);

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			if (theme !== "system") return;
			const root = window.document.documentElement;
			root.classList.remove("light", "dark");
			const applied = media.matches ? "dark" : "light";
			root.classList.add(applied);
			setResolvedTheme(applied);
		};

		media.addEventListener("change", handleChange);
		return () => media.removeEventListener("change", handleChange);
	}, [theme]);

	const setTheme = (next: Theme) => {
		try {
			localStorage.setItem(storageKey, next);
		} catch {
			// Storage may be unavailable in private mode or restricted contexts.
		}
		setThemeState(next);
	};

	return (
		<ThemeProviderContext.Provider
			{...props}
			value={{ theme, setTheme, resolvedTheme }}
		>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme(): ThemeProviderState {
	const context = useContext(ThemeProviderContext);
	if (context === initialState) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
