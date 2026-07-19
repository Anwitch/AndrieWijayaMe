"use client";

import { useState, useRef } from "react";
import { Edit2, Check, X, Bold, Italic, List, ListOrdered } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getErrorMessage } from "@/lib/errors";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<unknown>;
  label: string;
  multiline?: boolean;
}

export default function EditableText({
  value,
  onSave,
  label,
  multiline = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = `editable-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (saveError) {
      setError(
        getErrorMessage(
          saveError,
          `Failed to save ${label}. Please try again.`,
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setCurrentValue(value);
    setIsEditing(false);
  };

  const startEditing = () => {
    setError(null);
    setCurrentValue(value);
    setIsEditing(true);
  };

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selected = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newText = `${beforeText}${before}${selected}${after}${afterText}`;
    setCurrentValue(newText);

    // Focus back and set cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos =
          start + before.length + selected.length + after.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full animate-fade-in-up">
        <div className="flex justify-between items-center">
          <label
            htmlFor={inputId}
            className="font-mono text-[10px] uppercase tracking-widest text-gray-400"
          >
            {label}
          </label>

          {/* Toolbar */}
          {multiline && (
            <div className="flex gap-1 border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => insertText("**", "**")}
                className="p-1 hover:bg-white transition-colors"
                title="Bold"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => insertText("*", "*")}
                className="p-1 hover:bg-white transition-colors"
                title="Italic"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => insertText("\n- ")}
                className="p-1 hover:bg-white transition-colors"
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => insertText("\n1. ")}
                className="p-1 hover:bg-white transition-colors"
                title="Numbered List"
              >
                <ListOrdered size={14} />
              </button>
            </div>
          )}
        </div>

        {multiline ? (
          <textarea
            id={inputId}
            ref={textareaRef}
            disabled={isSaving}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-full border border-black p-3 text-lg leading-relaxed outline-none min-h-[200px] font-sans"
            autoFocus
          />
        ) : (
          <input
            id={inputId}
            type="text"
            disabled={isSaving}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-full border-b border-black py-1 text-xl font-semibold outline-none font-sans"
            autoFocus
          />
        )}

        {error && (
          <p
            role="alert"
            className="border border-red-200 bg-red-50 p-2 text-xs not-italic text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest"
          >
            <Check size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 border border-black hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-widest"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="prose prose-slate max-w-none pr-20 prose-p:leading-relaxed prose-p:text-gray-800 prose-strong:text-black prose-p:mb-4">
        {value ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="text-left text-gray-400 italic hover:text-black transition-colors"
          >
            No content set for {label}. Click to edit.
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={startEditing}
        className="absolute right-0 top-0 flex items-center gap-1 p-2 bg-white shadow-sm border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors font-mono text-[10px] uppercase tracking-widest"
        title={`Edit ${label}`}
      >
        <Edit2 size={14} />
        Edit
      </button>
    </div>
  );
}
