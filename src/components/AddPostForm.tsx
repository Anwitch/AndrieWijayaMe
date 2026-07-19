"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  X,
  PenLine,
  Bold,
  Italic,
  List,
  ListOrdered,
  Eye,
  Edit3,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getErrorMessage } from "@/lib/errors";

export default function AddPostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addPost = useMutation(api.posts.create);

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selected = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newText = `${beforeText}${before}${selected}${after}${afterText}`;
    setContent(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos =
          start + before.length + selected.length + after.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!cleanTitle || !cleanContent) {
      setError("Post title and content are required.");
      return;
    }
    if (!slug) {
      setError(
        "The title must contain letters or numbers so a URL slug can be generated.",
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await addPost({
        title: cleanTitle,
        slug,
        content: cleanContent,
        excerpt:
          excerpt.trim() ||
          `${cleanContent.substring(0, 150)}${cleanContent.length > 150 ? "..." : ""}`,
        category: category.trim() || "Uncategorized",
        isPublished: true,
      });
      setTitle("");
      setContent("");
      setCategory("");
      setExcerpt("");
      setIsOpen(false);
      setTab("edit");
    } catch (submitError) {
      setError(
        getErrorMessage(
          submitError,
          "Failed to publish post. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-sm"
      >
        <PenLine size={14} /> New Mission Log
      </button>
    );
  }

  return (
    <div className="border border-black p-6 bg-white animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold">
          New Mission Log
        </h3>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(false);
          }}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-black disabled:text-gray-200"
          aria-label="Close post form"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="post-title"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
            >
              Title
            </label>
            <input
              id="post-title"
              disabled={isSubmitting}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
              placeholder="e.g. My First Mission Log"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="post-category"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
            >
              Category
            </label>
            <input
              id="post-category"
              disabled={isSubmitting}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
              placeholder="e.g. Engineering, Research, Travel"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="post-excerpt"
            className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
          >
            Excerpt (Optional)
          </label>
          <input
            id="post-excerpt"
            disabled={isSubmitting}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
            placeholder="Short summary of the post"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-gray-50 p-1 border border-gray-200">
            <div className="flex gap-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setTab("edit")}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors ${tab === "edit" ? "bg-black text-white" : "hover:bg-gray-200"}`}
              >
                <Edit3 size={12} /> Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setTab("preview")}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors ${tab === "preview" ? "bg-black text-white" : "hover:bg-gray-200"}`}
              >
                <Eye size={12} /> Preview
              </button>
            </div>

            {tab === "edit" && (
              <div className="flex gap-1 border-l border-gray-200 pl-1 ml-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("**", "**")}
                  className="p-1 hover:bg-white transition-colors"
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("*", "*")}
                  className="p-1 hover:bg-white transition-colors"
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("\n- ")}
                  className="p-1 hover:bg-white transition-colors"
                  title="Bullet List"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("\n1. ")}
                  className="p-1 hover:bg-white transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered size={14} />
                </button>
              </div>
            )}
          </div>

          {tab === "edit" ? (
            <textarea
              aria-label="Post content"
              ref={textareaRef}
              disabled={isSubmitting}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="border border-gray-200 p-3 outline-none text-sm min-h-[400px] font-mono focus:border-black transition-colors"
              placeholder="# Introduction..."
            />
          ) : (
            <div className="border border-gray-200 p-8 min-h-[400px] bg-white overflow-y-auto">
              <article
                className="prose prose-slate max-w-none prose-sm
                prose-headings:text-[var(--text-primary)] prose-headings:font-semibold
                prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-[var(--text-primary)] prose-strong:font-semibold
                prose-code:text-[var(--accent-primary)] prose-code:bg-[var(--bg-surface)] prose-code:px-1 prose-code:rounded-sm
                prose-pre:bg-[var(--text-primary)] prose-pre:text-white prose-pre:rounded-sm"
              >
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="text-gray-300 italic font-mono text-xs uppercase tracking-widest">
                    Waiting for transmission... (No content to preview)
                  </div>
                )}
              </article>
            </div>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 bg-black text-white py-3 text-xs font-mono uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? "Publishing Log..." : "Publish Mission Log"}
        </button>
      </form>
    </div>
  );
}
