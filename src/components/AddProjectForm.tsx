"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, X } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

export default function AddProjectForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [link, setLink] = useState("");
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
      });
      setTitle("");
      setDescription("");
      setTags("");
      setYear(new Date().getFullYear().toString());
      setLink("");
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
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-sm"
      >
        <Plus size={14} /> Add Project
      </button>
    );
  }

  return (
    <div className="border border-black p-6 bg-white animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold">
          New Mission / Project
        </h3>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(false);
          }}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-black disabled:text-gray-200"
          aria-label="Close project form"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="project-title"
            className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
          >
            Project Title
          </label>
          <input
            id="project-title"
            disabled={isSubmitting}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
            placeholder="e.g. Kedut - Kemana Duitku?"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="project-description"
            className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
          >
            Description
          </label>
          <textarea
            id="project-description"
            disabled={isSubmitting}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm min-h-[80px] resize-none"
            placeholder="What does this project do?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="project-tags"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
            >
              Tags (comma separated)
            </label>
            <input
              id="project-tags"
              disabled={isSubmitting}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
              placeholder="Next.js, Tailwind"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="project-year"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
            >
              Year
            </label>
            <input
              id="project-year"
              disabled={isSubmitting}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
              placeholder="2026"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="project-link"
            className="font-mono text-[10px] uppercase tracking-widest text-gray-500"
          >
            Project URL (Optional)
          </label>
          <input
            id="project-link"
            type="url"
            disabled={isSubmitting}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
            placeholder="https://..."
          />
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
          {isSubmitting ? "Saving Project..." : "Initialize & Save Project"}
        </button>
      </form>
    </div>
  );
}
