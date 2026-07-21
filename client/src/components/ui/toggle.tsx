import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "",
				outline:
					"border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-9 px-3",
				sm: "h-8 px-2",
				lg: "h-10 px-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof toggleVariants> & {
		pressed?: boolean;
		onPressedChange?: (pressed: boolean) => void;
		asChild?: boolean;
	};

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
	(
		{ className, variant, size, pressed, onPressedChange, asChild, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				ref={ref}
				data-state={pressed ? "on" : "off"}
				onClick={() => onPressedChange?.(!pressed)}
				className={cn(toggleVariants({ variant, size, className }))}
				{...props}
			/>
		);
	},
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
