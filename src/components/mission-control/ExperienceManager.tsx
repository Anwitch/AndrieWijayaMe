"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import {
  Button,
  EmptyState,
  Eyebrow,
  FeedbackNote,
  Panel,
  Skeleton,
  inputClass,
  labelClass,
} from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";

const emptyForm = {
  title: "",
  period: "",
  description: "",
  role: "",
  capabilities: "",
  base: "",
  organization: "",
  projectSlug: "",
};

type ExperienceForm = typeof emptyForm;

const FIELDS: Array<{
  key: keyof ExperienceForm;
  label: string;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
}> = [
  {
    key: "title",
    label: "Title",
    placeholder: "e.g. ATEROSTOP — PKM Karsa Cipta 2026",
    required: true,
  },
  { key: "period", label: "Period", placeholder: "2026", required: true },
  {
    key: "description",
    label: "Description",
    placeholder: "What was it, and what did you do?",
    required: true,
    multiline: true,
  },
  { key: "role", label: "Peran", placeholder: "Optional" },
  { key: "capabilities", label: "Kapabilitas", placeholder: "Optional" },
  { key: "base", label: "Basis", placeholder: "Optional" },
  {
    key: "organization",
    label: "Organization (JSON-LD)",
    placeholder: "Optional — defaults to the title",
  },
  {
    key: "projectSlug",
    label: "Related project slug",
    placeholder: "Optional — links to /projects/<slug>",
  },
];

export default function ExperienceManager() {
  const experiences = useQuery(api.experiences.listAll);
  const addExperience = useMutation(api.experiences.addExperience);
  const updateExperience = useMutation(api.experiences.updateExperience);
  const moveExperience = useMutation(api.experiences.moveExperience);
  const removeExperience = useMutation(api.experiences.removeExperience);

  // null = closed, "new" = add form, otherwise the entry being edited.
  const [editing, setEditing] = useState<Id<"experiences"> | "new" | null>(
    null,
  );
  const [form, setForm] = useState<ExperienceForm>(emptyForm);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actionInFlight = useRef(false);

  const runAction = async (
    action: () => Promise<unknown>,
    onSuccess?: () => void,
  ) => {
    if (actionInFlight.current) return;
    actionInFlight.current = true;
    setError(null);
    setPending(true);
    try {
      await action();
      onSuccess?.();
    } catch (actionError) {
      setError(
        getErrorMessage(
          actionError,
          "Experience operation failed. Please try again.",
        ),
      );
    } finally {
      actionInFlight.current = false;
      setPending(false);
    }
  };

  const startEditing = (experience: Doc<"experiences">) => {
    setError(null);
    setEditing(experience._id);
    setForm({
      title: experience.title,
      period: experience.period,
      description: experience.description,
      role: experience.role ?? "",
      capabilities: experience.capabilities ?? "",
      base: experience.base ?? "",
      organization: experience.organization ?? "",
      projectSlug: experience.projectSlug ?? "",
    });
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (editing === null) return;
    const close = () => setEditing(null);
    void runAction(
      () =>
        editing === "new"
          ? addExperience(form)
          : updateExperience({ id: editing, ...form }),
      close,
    );
  };

  const remove = (experience: Doc<"experiences">) => {
    if (!window.confirm(`Delete "${experience.title}" permanently?`)) return;
    void runAction(() => removeExperience({ id: experience._id }));
  };

  return (
    <Panel
      size="lg"
      icon={<Briefcase size={20} className="text-ink-muted" />}
      title="Experience"
      subtitle="Shown under Pengalaman on the homepage, after the profile entry"
      aside={
        editing === null && (
          <Button
            type="button"
            className="py-2"
            onClick={() => {
              setError(null);
              setForm(emptyForm);
              setEditing("new");
            }}
          >
            <Plus size={14} /> Add Experience
          </Button>
        )
      }
    >
      {error && (
        <FeedbackNote tone="error" className="mb-6">
          {error}
        </FeedbackNote>
      )}

      {editing !== null && (
        <form
          onSubmit={save}
          className="mb-8 grid grid-cols-1 gap-4 border border-ink p-6 sm:grid-cols-2"
        >
          {FIELDS.map((field) => {
            const id = `experience-${field.key}`;
            const shared = {
              id,
              value: form[field.key],
              required: field.required,
              disabled: pending,
              placeholder: field.placeholder,
              onChange: (
                event: React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement
                >,
              ) => setForm({ ...form, [field.key]: event.target.value }),
            };
            return (
              <div
                key={field.key}
                className={`flex flex-col gap-1 ${field.multiline ? "sm:col-span-2" : ""}`}
              >
                <label htmlFor={id} className={labelClass}>
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    {...shared}
                    className={`${inputClass} min-h-[100px]`}
                  />
                ) : (
                  <input {...shared} className={inputClass} />
                )}
              </div>
            );
          })}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Experience"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {experiences === undefined ? (
        <div
          className="animate-pulse space-y-4"
          aria-label="Loading experiences"
        >
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : experiences.length === 0 ? (
        <EmptyState>No experience entries yet.</EmptyState>
      ) : (
        <ul>
          {experiences.map((experience, index) => (
            <li
              key={experience._id}
              className="flex items-start justify-between gap-4 border-b border-line py-4"
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() =>
                    void runAction(() =>
                      updateExperience({
                        id: experience._id,
                        isPublished: !experience.isPublished,
                      }),
                    )
                  }
                  disabled={pending}
                  className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${experience.isPublished ? "text-success bg-success-bg" : "text-ink-faint hover:text-success"}`}
                  title={
                    experience.isPublished
                      ? "Unpublish experience"
                      : "Publish experience"
                  }
                >
                  {experience.isPublished ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
                <div>
                  <div className="font-semibold text-lg">
                    {experience.title}
                  </div>
                  <Eyebrow as="div">{experience.period}</Eyebrow>
                  <div className="mt-1 text-xs text-ink-muted line-clamp-2 max-w-md">
                    {experience.description}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    void runAction(() =>
                      moveExperience({ id: experience._id, direction: "up" }),
                    )
                  }
                  disabled={pending || index === 0}
                  className="p-2 text-ink-muted hover:text-ink disabled:text-ink-faint"
                  title="Move experience up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void runAction(() =>
                      moveExperience({
                        id: experience._id,
                        direction: "down",
                      }),
                    )
                  }
                  disabled={pending || index === experiences.length - 1}
                  className="p-2 text-ink-muted hover:text-ink disabled:text-ink-faint"
                  title="Move experience down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => startEditing(experience)}
                  disabled={pending}
                  className="p-2 text-ink-muted hover:text-ink disabled:text-ink-faint"
                  title="Edit experience"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(experience)}
                  disabled={pending}
                  className="p-2 text-danger/50 hover:text-danger disabled:opacity-40"
                  title="Delete experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
