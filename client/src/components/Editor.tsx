import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "@tiptap/markdown";
import {
	EditorContent,
	type Editor as TiptapEditor,
	useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "./EditorToolbar";
import { Skeleton } from "./ui/skeleton";

export type EditorProps = {
	content: string;
	onChange?: (markdown: string) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
};

export function Editor({
	content,
	onChange,
	placeholder = "Start writing…",
	className,
	disabled = false,
}: EditorProps): React.JSX.Element {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Markdown.configure({
				markedOptions: {
					gfm: true,
					breaks: false,
				},
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
			}),
			Typography,
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
		contentType: "markdown",
		immediatelyRender: false,
		editable: !disabled,
		onUpdate: ({ editor }: { editor: TiptapEditor }) => {
			const markdown = editor.storage.markdown.manager.serialize(
				editor.getJSON(),
			);
			onChange?.(markdown);
		},
	});

	return (
		<div
			className={cn(
				"flex flex-col overflow-hidden rounded-xl border border-input bg-background shadow-sm",
				className,
			)}
		>
			{editor ? (
				<EditorToolbar editor={editor} />
			) : (
				<Skeleton className="h-11 w-full rounded-none border-b" />
			)}
			<div className="relative flex-1 overflow-y-auto">
				{editor ? (
					<EditorContent
						editor={editor}
						className="prose-editor h-full min-h-[24rem] px-5 py-4"
					/>
				) : (
					<Skeleton className="m-5 h-[calc(100%-2rem)] min-h-[24rem]" />
				)}
			</div>
		</div>
	);
}
