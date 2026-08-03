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
import {
  Button,
  FeedbackNote,
  inputUnderlineClass,
  labelClass,
} from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";

export default function AddPostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [titleId, setTitleId] = useState("");
  const [contentId, setContentId] = useState("");
  const [excerptId, setExcerptId] = useState("");
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
        titleId: titleId.trim(),
        excerptId: excerptId.trim(),
        contentId: contentId.trim(),
        isPublished: true,
      });
      setTitle("");
      setContent("");
      setCategory("");
      setExcerpt("");
      setTitleId("");
      setContentId("");
      setExcerptId("");
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
      <Button type="button" onClick={() => setIsOpen(true)} className="py-2">
        <PenLine size={14} /> New Mission Log
      </Button>
    );
  }

  return (
    <div className="border border-ink p-6 bg-paper animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest font-semibold">
          New Mission Log
        </h3>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(false);
          }}
          disabled={isSubmitting}
          className="text-ink-muted hover:text-ink disabled:text-ink-faint"
          aria-label="Close post form"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="post-title" className={labelClass}>
              Title
            </label>
            <input
              id="post-title"
              disabled={isSubmitting}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputUnderlineClass}
              placeholder="e.g. My First Mission Log"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="post-category" className={labelClass}>
              Category
            </label>
            <input
              id="post-category"
              disabled={isSubmitting}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputUnderlineClass}
              placeholder="e.g. Engineering, Research, Travel"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="post-excerpt" className={labelClass}>
            Excerpt (Optional)
          </label>
          <input
            id="post-excerpt"
            disabled={isSubmitting}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={inputUnderlineClass}
            placeholder="Short summary of the post"
          />
        </div>

        <div className="border-t border-line pt-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Indonesian (ID) — optional translation
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="post-title-id" className={labelClass}>
                Judul (Bahasa Indonesia)
              </label>
              <input
                id="post-title-id"
                disabled={isSubmitting}
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                className={inputUnderlineClass}
                placeholder="Judul terjemahan (opsional)"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="post-excerpt-id" className={labelClass}>
                Ringkasan (Bahasa Indonesia)
              </label>
              <input
                id="post-excerpt-id"
                disabled={isSubmitting}
                value={excerptId}
                onChange={(e) => setExcerptId(e.target.value)}
                className={inputUnderlineClass}
                placeholder="Ringkasan terjemahan (opsional)"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="post-content-id" className={labelClass}>
                Konten (Bahasa Indonesia, Markdown)
              </label>
              <textarea
                id="post-content-id"
                disabled={isSubmitting}
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                className="border border-line p-3 outline-none text-sm min-h-[200px] font-mono focus:border-ink transition-colors"
                placeholder="Terjemahan konten lengkap (opsional)"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-surface p-1 border border-line">
            <div className="flex gap-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setTab("edit")}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors ${tab === "edit" ? "bg-ink text-paper" : "hover:bg-line"}`}
              >
                <Edit3 size={12} /> Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setTab("preview")}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors ${tab === "preview" ? "bg-ink text-paper" : "hover:bg-line"}`}
              >
                <Eye size={12} /> Preview
              </button>
            </div>

            {tab === "edit" && (
              <div className="flex gap-1 border-l border-line pl-1 ml-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("**", "**")}
                  className="p-1 hover:bg-paper transition-colors"
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("*", "*")}
                  className="p-1 hover:bg-paper transition-colors"
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("\n- ")}
                  className="p-1 hover:bg-paper transition-colors"
                  title="Bullet List"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => insertText("\n1. ")}
                  className="p-1 hover:bg-paper transition-colors"
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
              className="border border-line p-3 outline-none text-sm min-h-[400px] font-mono focus:border-ink transition-colors"
              placeholder="# Introduction..."
            />
          ) : (
            <div className="border border-line p-8 min-h-[400px] bg-paper overflow-y-auto">
              <article
                className="prose max-w-none prose-sm
                prose-headings:text-ink prose-headings:font-semibold
                prose-p:text-ink-secondary prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-ink prose-strong:font-semibold
                prose-code:text-accent prose-code:bg-accent-subtle prose-code:px-1 prose-code:rounded-sm
                prose-pre:bg-ink prose-pre:text-paper prose-pre:rounded-sm"
              >
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="text-ink-faint italic font-mono text-xs uppercase tracking-widest">
                    Waiting for transmission... (No content to preview)
                  </div>
                )}
              </article>
            </div>
          )}
        </div>

        {error && <FeedbackNote tone="error">{error}</FeedbackNote>}

        <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
          {isSubmitting ? "Publishing Log..." : "Publish Mission Log"}
        </Button>
      </form>
    </div>
  );
}
