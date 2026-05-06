"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Link as LinkIcon,
  ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dashboardpack/core/components/ui/popover";
import { Separator } from "@dashboardpack/core/components/ui/separator";

interface RichTextEditorProps {
  variant?: "full" | "minimal";
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const COLOR_PRESETS = [
  "#000000",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#6b7280",
];

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex items-center justify-center rounded p-1.5 transition-colors",
        "hover:bg-muted disabled:pointer-events-none disabled:opacity-40",
        isActive && "bg-muted text-primary"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return (
    <div className="mx-0.5 flex items-center self-stretch py-0.5">
      <Separator orientation="vertical" />
    </div>
  );
}

export function RichTextEditor({
  variant = "full",
  content = "",
  onChange,
  placeholder = "Start writing...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight,
    ],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const handleLinkInsert = () => {
    const existingHref = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", existingHref);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const handleImageInsert = () => {
    const url = window.prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Toolbar */}
      <div className="rounded-t-lg border border-border bg-muted/30 p-2 flex flex-wrap gap-1">
        {variant === "full" ? (
          <>
            {/* Row 1 */}
            <div className="flex flex-wrap gap-1 w-full">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              {/* Color picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    title="Text Color"
                    className={cn(
                      "inline-flex items-center justify-center rounded p-1.5 transition-colors",
                      "hover:bg-muted"
                    )}
                  >
                    <Palette className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {COLOR_PRESETS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        title={hex}
                        onClick={() => editor.chain().focus().setColor(hex).run()}
                        className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-110"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive("highlight")}
                title="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                isActive={editor.isActive({ textAlign: "left" })}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                isActive={editor.isActive({ textAlign: "center" })}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                isActive={editor.isActive({ textAlign: "right" })}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap gap-1 w-full border-t border-border/50 pt-1 mt-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Ordered List"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Blockquote"
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                title="Code Block"
              >
                <FileCode className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton
                onClick={handleLinkInsert}
                isActive={editor.isActive("link")}
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={handleImageInsert}
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </ToolbarButton>
            </div>
          </>
        ) : (
          /* Minimal variant — single row */
          <div className="flex flex-wrap gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarSeparator />

            <ToolbarButton
              onClick={handleLinkInsert}
              isActive={editor.isActive("link")}
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
          </div>
        )}
      </div>

      {/* Editor content area */}
      <div
        className={cn(
          "rounded-b-lg border border-t-0 border-border",
          variant === "full" ? "min-h-[200px]" : "min-h-[100px]",
          "[&_.tiptap]:outline-none",
          "[&_.tiptap]:p-4",
          "[&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mb-3",
          "[&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:mb-2",
          "[&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mb-2",
          "[&_.tiptap_p]:mb-3 [&_.tiptap_p:last-child]:mb-0",
          "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ul]:mb-3",
          "[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_ol]:mb-3",
          "[&_.tiptap_li]:mb-1",
          "[&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-border [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-muted-foreground [&_.tiptap_blockquote]:mb-3",
          "[&_.tiptap_code]:bg-muted [&_.tiptap_code]:rounded [&_.tiptap_code]:px-1 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:text-sm [&_.tiptap_code]:font-mono",
          "[&_.tiptap_pre]:bg-muted [&_.tiptap_pre]:rounded-lg [&_.tiptap_pre]:p-4 [&_.tiptap_pre]:mb-3 [&_.tiptap_pre]:overflow-x-auto",
          "[&_.tiptap_pre_code]:bg-transparent [&_.tiptap_pre_code]:p-0",
          "[&_.tiptap_a]:text-primary [&_.tiptap_a]:underline [&_.tiptap_a]:underline-offset-2",
          "[&_.tiptap_img]:rounded [&_.tiptap_img]:max-w-full [&_.tiptap_img]:h-auto [&_.tiptap_img]:mb-3",
          "[&_.tiptap_.is-editor-empty:before]:content-[attr(data-placeholder)] [&_.tiptap_.is-editor-empty:before]:text-muted-foreground/60 [&_.tiptap_.is-editor-empty:before]:float-left [&_.tiptap_.is-editor-empty:before]:pointer-events-none [&_.tiptap_.is-editor-empty:before]:h-0"
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
