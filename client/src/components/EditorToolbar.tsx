import type { Editor as TiptapEditor } from "@tiptap/react";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	Quote,
	Redo,
	Undo,
} from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export type EditorToolbarProps = {
	editor: TiptapEditor;
};

export function EditorToolbar({
	editor,
}: EditorToolbarProps): React.JSX.Element {
	const setLink = () => {
		const previousUrl = editor.getAttributes("link").href as string;
		const url = window.prompt("URL", previousUrl);

		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	};

	const ToolbarButton = ({
		pressed,
		onClick,
		icon: Icon,
		label,
		disabled = false,
	}: {
		pressed?: boolean;
		onClick: () => void;
		icon: React.ComponentType<{ className?: string }>;
		label: string;
		disabled?: boolean;
	}) => (
		<Toggle
			pressed={pressed ?? false}
			onPressedChange={onClick}
			disabled={disabled}
			aria-label={label}
			className={cn(
				"size-8 rounded-md border border-transparent p-1.5 data-[state=on]:border-input data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
				disabled && "opacity-50",
			)}
		>
			<Icon className="size-4" />
		</Toggle>
	);

	return (
		<div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/40 px-3 py-2">
			<div className="flex items-center gap-1 pr-2">
				<ToolbarButton
					icon={Undo}
					label="Undo"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				/>
				<ToolbarButton
					icon={Redo}
					label="Redo"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
				/>
			</div>

			<div className="flex items-center gap-1 border-l border-border px-2">
				<ToolbarButton
					icon={Heading1}
					label="Heading 1"
					pressed={editor.isActive("heading", { level: 1 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				/>
				<ToolbarButton
					icon={Heading2}
					label="Heading 2"
					pressed={editor.isActive("heading", { level: 2 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				/>
				<ToolbarButton
					icon={Heading3}
					label="Heading 3"
					pressed={editor.isActive("heading", { level: 3 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				/>
			</div>

			<div className="flex items-center gap-1 border-l border-border px-2">
				<ToolbarButton
					icon={Bold}
					label="Bold"
					pressed={editor.isActive("bold")}
					onClick={() => editor.chain().focus().toggleBold().run()}
				/>
				<ToolbarButton
					icon={Italic}
					label="Italic"
					pressed={editor.isActive("italic")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
				/>
				<ToolbarButton
					icon={Code}
					label="Inline code"
					pressed={editor.isActive("code")}
					onClick={() => editor.chain().focus().toggleCode().run()}
				/>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Add link"
					className="size-8 rounded-md border border-transparent p-1.5 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-accent"
					data-state={editor.isActive("link") ? "active" : "inactive"}
					onClick={setLink}
					aria-pressed={editor.isActive("link")}
				>
					<LinkIcon className="size-4" />
				</Button>
			</div>

			<div className="flex items-center gap-1 border-l border-border px-2">
				<ToolbarButton
					icon={List}
					label="Bullet list"
					pressed={editor.isActive("bulletList")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
				/>
				<ToolbarButton
					icon={ListOrdered}
					label="Ordered list"
					pressed={editor.isActive("orderedList")}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
				/>
				<ToolbarButton
					icon={Quote}
					label="Blockquote"
					pressed={editor.isActive("blockquote")}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
				/>
			</div>
		</div>
	);
}
