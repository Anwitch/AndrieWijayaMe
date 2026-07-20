"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, X } from "lucide-react";
import {
  Button,
  FeedbackNote,
  inputUnderlineClass,
  labelClass,
} from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";

export default function AddProjectForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [link, setLink] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProject = useMutation(api.projects.addProject);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    if (!cleanTitle || !cleanDescription) {
      setError("Project title and description are required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await addProject({
        title: cleanTitle,
        description: cleanDescription,
        tags: tags.trim(),
        year: year.trim(),
        link: link.trim() || undefined,
        isPublished,
      });
      setTitle("");
      setDescription("");
      setTags("");
      setYear(new Date().getFullYear().toString());
      setLink("");
      setIsPublished(true);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        getErrorMessage(
          submitError,
          "Failed to create project. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button type="button" onClick={() => setIsOpen(true)} className="py-2">
        <Plus size={14} /> Add Project
      </Button>
    );
  }

  return (
    <div className="border border-ink p-6 bg-paper animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest font-semibold">
          New Mission / Project
        </h3>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(false);
          }}
          disabled={isSubmitting}
          className="text-ink-muted hover:text-ink disabled:text-ink-faint"
          aria-label="Close project form"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="project-title" className={labelClass}>
            Project Title
          </label>
          <input
            id="project-title"
            disabled={isSubmitting}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputUnderlineClass}
            placeholder="e.g. Kedut - Kemana Duitku?"
          />
        </div>

        <label
          className={`flex items-center gap-3 border border-line p-3 ${labelClass}`}
        >
          <input
            type="checkbox"
            checked={isPublished}
            disabled={isSubmitting}
            onChange={(event) => setIsPublished(event.target.checked)}
          />
          Publish immediately on the public projects archive
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="project-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="project-description"
            disabled={isSubmitting}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={`${inputUnderlineClass} min-h-[80px] resize-none`}
            placeholder="What does this project do?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="project-tags" className={labelClass}>
              Tags (comma separated)
            </label>
            <input
              id="project-tags"
              disabled={isSubmitting}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputUnderlineClass}
              placeholder="Next.js, Tailwind"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="project-year" className={labelClass}>
              Year
            </label>
            <input
              id="project-year"
              disabled={isSubmitting}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputUnderlineClass}
              placeholder="2026"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="project-link" className={labelClass}>
            Project URL (Optional)
          </label>
          <input
            id="project-link"
            type="url"
            disabled={isSubmitting}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputUnderlineClass}
            placeholder="https://..."
          />
        </div>

        {error && <FeedbackNote tone="error">{error}</FeedbackNote>}

        <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
          {isSubmitting ? "Saving Project..." : "Initialize & Save Project"}
        </Button>
      </form>
    </div>
  );
}
