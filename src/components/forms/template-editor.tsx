"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import clsx from "clsx";

interface TemplateEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
}

export function TemplateEditor({ value, onChange, className }: TemplateEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={clsx("border rounded-md p-2", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
