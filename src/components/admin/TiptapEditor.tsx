"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/data/admin-media";
import { useAuth } from "@/context/AuthContext";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
        active ? "bg-accent text-white" : "text-ink hover:bg-accent/10 hover:text-accent dark:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer nofollow" } }),
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: "rounded-lg mx-auto" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Maqola matnini shu yerga yozing..." }),
    ],
    content,
    onUpdate: ({ editor: editorInstance }) => onChange(editorInstance.getHTML()),
    editorProps: {
      attributes: { class: "tiptap-editor-content" },
    },
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor || !user) return;
      const toastId = toast.loading("Rasm yuklanmoqda...");
      try {
        const { url } = await uploadFile(file, "news-images", user.uid);
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Rasm qo'shildi", { id: toastId });
      } catch {
        toast.error("Rasmni yuklab bo'lmadi", { id: toastId });
      }
    },
    [editor, user]
  );

  const handleAddLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Havola manzilini kiriting:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleAddYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube video havolasini kiriting:");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor rounded-lg border border-line dark:border-line-dark">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line p-2 dark:border-line-dark">
        <ToolbarButton label="Qalin" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton label="Kursiv" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton label="Tagiga chizish" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="Chizib o'tish" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={15} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-line dark:bg-line-dark" />
        <ToolbarButton label="Sarlavha 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton label="Sarlavha 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={15} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-line dark:bg-line-dark" />
        <ToolbarButton label="Ro'yxat" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton label="Raqamli ro'yxat" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton label="Iqtibos" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={15} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-line dark:bg-line-dark" />
        <ToolbarButton label="Chapga tekislash" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton label="Markazga tekislash" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton label="O'ngga tekislash" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={15} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-line dark:bg-line-dark" />
        <ToolbarButton label="Havola" active={editor.isActive("link")} onClick={handleAddLink}>
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="Rasm qo'shish" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="YouTube video" onClick={handleAddYoutube}>
          <YoutubeIcon size={15} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-line dark:bg-line-dark" />
        <ToolbarButton label="Bekor qilish" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton label="Qaytarish" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageUpload(file);
            e.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
