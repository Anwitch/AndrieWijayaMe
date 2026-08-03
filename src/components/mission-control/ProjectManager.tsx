"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Settings,
  Star,
  Trash2,
  X,
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
} from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";
import CoverPicker from "./CoverPicker";

interface ProjectManagerProps {
  projects: Doc<"projects">[] | undefined;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  onLoadMore: () => void;
}

const emptyProjectForm = {
  title: "",
  description: "",
  year: "",
  tags: "",
  link: "",
  slug: "",
  caseStudy: "",
  coverMediaId: undefined as Id<"media"> | undefined,
};

const editInputClass =
  "w-full bg-paper border border-line-strong p-1 text-sm outline-none transition-colors focus:border-ink";

export default function ProjectManager({
  projects,
  status,
  onLoadMore,
}: ProjectManagerProps) {
  const removeProject = useMutation(api.projects.removeProject);
  const updateProject = useMutation(api.projects.updateProject);
  const moveProject = useMutation(api.projects.moveProject);
  const [editingProjectId, setEditingProjectId] =
    useState<Id<"projects"> | null>(null);
  const [editFormData, setEditFormData] = useState(emptyProjectForm);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actionInFlight = useRef(false);

  const startEditing = (project: Doc<"projects">) => {
    if (actionInFlight.current) return;
    setError(null);
    setEditingProjectId(project._id);
    setEditFormData({
      title: project.title,
      description: project.description,
      year: project.year,
      tags: project.tags,
      link: project.link ?? "",
      slug: project.slug ?? "",
      caseStudy: project.caseStudy ?? "",
      coverMediaId: project.coverMediaId ?? undefined,
    });
  };

  const runAction = async (
    key: string,
    action: () => Promise<unknown>,
    onSuccess?: () => void,
  ) => {
    if (actionInFlight.current) return;
    actionInFlight.current = true;
    setError(null);
    setPendingAction(key);
    try {
      await action();
      onSuccess?.();
    } catch (actionError) {
      setError(
        getErrorMessage(
          actionError,
          "Project operation failed. Please try again.",
        ),
      );
    } finally {
      actionInFlight.current = false;
      setPendingAction(null);
    }
  };

  const saveEdit = () => {
    if (!editingProjectId) return;

    const title = editFormData.title.trim();
    const description = editFormData.description.trim();
    if (!title || !description) {
      setError("Project title and description are required.");
      return;
    }

    void runAction(
      `save-${editingProjectId}`,
      () =>
        updateProject({
          id: editingProjectId,
          title,
          description,
          year: editFormData.year.trim(),
          tags: editFormData.tags.trim(),
          link: editFormData.link.trim(),
          slug: editFormData.slug.trim(),
          caseStudy: editFormData.caseStudy.trim(),
          coverMediaId: editFormData.coverMediaId ?? null,
        }),
      () => setEditingProjectId(null),
    );
  };

  const move = (project: Doc<"projects">, direction: "up" | "down") => {
    void runAction(`move-${project._id}`, () =>
      moveProject({ id: project._id, direction }),
    );
  };

  const deleteProject = (project: Doc<"projects">) => {
    if (!window.confirm(`Delete "${project.title}" permanently?`)) return;
    void runAction(`delete-${project._id}`, () =>
      removeProject({ id: project._id }),
    );
  };

  return (
    <Panel
      size="lg"
      icon={<Settings size={20} className="text-ink-muted" />}
      title="Active Projects"
      aside={<Eyebrow>{projects?.length ?? 0} Loaded Missions</Eyebrow>}
    >
      {error && (
        <FeedbackNote tone="error" className="mb-6">
          {error}
        </FeedbackNote>
      )}

      {projects === undefined ? (
        <div className="animate-pulse space-y-4" aria-label="Loading projects">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-24" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState>No projects found in database.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
            This order drives the homepage and the public archive
          </p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line font-mono text-xs uppercase tracking-widest text-ink-muted">
                <th className="pb-4 font-normal w-24">Year</th>
                <th className="pb-4 font-normal">Mission Details</th>
                <th className="pb-4 font-normal w-32">Tags</th>
                <th className="pb-4 font-normal text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                const isEditing = editingProjectId === project._id;
                const isSaving = pendingAction === `save-${project._id}`;
                const isDeleting = pendingAction === `delete-${project._id}`;
                const isPublished = project.isPublished !== false;
                const isFirst = index === 0;
                const isLast =
                  index === projects.length - 1 && status === "Exhausted";

                return (
                  <tr
                    key={project._id}
                    className={`group border-b border-line transition-colors ${isEditing ? "bg-accent-subtle/40" : "hover:bg-surface"}`}
                  >
                    {isEditing ? (
                      <>
                        <td className="py-4 align-top">
                          <input
                            aria-label="Project year"
                            value={editFormData.year}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                year: event.target.value,
                              })
                            }
                            className={`${editInputClass} font-mono`}
                          />
                        </td>
                        <td className="py-4 space-y-2">
                          <input
                            aria-label="Project title"
                            required
                            value={editFormData.title}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                title: event.target.value,
                              })
                            }
                            className={`${editInputClass} font-semibold`}
                            placeholder="Title"
                          />
                          <textarea
                            aria-label="Project description"
                            required
                            value={editFormData.description}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                description: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs min-h-[60px]`}
                            placeholder="Description"
                          />
                          <input
                            aria-label="Project URL"
                            type="url"
                            value={editFormData.link}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                link: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs font-mono`}
                            placeholder="https://example.com"
                          />
                          <input
                            aria-label="Project slug"
                            value={editFormData.slug}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                slug: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs font-mono`}
                            placeholder="slug-halaman-detail"
                          />
                          <textarea
                            aria-label="Project case study"
                            value={editFormData.caseStudy}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                caseStudy: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs min-h-[120px] font-mono`}
                            placeholder="Case study (Markdown)"
                          />
                          <CoverPicker
                            purpose="project-cover"
                            value={editFormData.coverMediaId}
                            disabled={isSaving}
                            onChange={(mediaId) =>
                              setEditFormData({
                                ...editFormData,
                                coverMediaId: mediaId ?? undefined,
                              })
                            }
                          />
                        </td>
                        <td className="py-4 align-top">
                          <input
                            aria-label="Project tags"
                            value={editFormData.tags}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                tags: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs font-mono uppercase`}
                          />
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={pendingAction !== null}
                              className="p-1.5 bg-ink text-paper hover:bg-ink-secondary disabled:bg-ink-faint rounded-sm"
                              title="Save project"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProjectId(null)}
                              disabled={pendingAction !== null}
                              className="p-1.5 border border-line-strong bg-paper hover:bg-surface disabled:text-ink-faint rounded-sm"
                              title="Cancel editing"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 font-mono text-sm align-top">
                          {project.year}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(`publish-${project._id}`, () =>
                                  updateProject({
                                    id: project._id,
                                    isPublished: !isPublished,
                                  }),
                                )
                              }
                              disabled={pendingAction !== null}
                              className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${isPublished ? "text-success bg-success-bg" : "text-ink-faint hover:text-success"}`}
                              title={isPublished ? "Unpublish project" : "Publish project"}
                            >
                              {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(`feature-${project._id}`, () =>
                                  updateProject({
                                    id: project._id,
                                    isFeatured: !project.isFeatured,
                                  }),
                                )
                              }
                              disabled={pendingAction !== null}
                              className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${project.isFeatured ? "text-warning bg-warning-bg shadow-sm" : "text-ink-faint hover:text-warning"}`}
                              title={
                                project.isFeatured
                                  ? "Remove from featured projects"
                                  : "Add to featured projects"
                              }
                            >
                              <Star
                                size={16}
                                fill={
                                  project.isFeatured ? "currentColor" : "none"
                                }
                              />
                            </button>
                            <div>
                              <div className="font-semibold text-lg">
                                {project.title}
                              </div>
                              <div className="text-xs text-ink-muted line-clamp-1 max-w-md">
                                {project.description}
                              </div>
                              {project.link && (
                                <div className="text-xs text-ink-faint font-mono mt-1">
                                  {project.link}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-top">
                          <span className="font-mono text-xs bg-surface px-2 py-1 rounded-full uppercase tracking-widest inline-block">
                            {project.tags}
                          </span>
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end items-start gap-2">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => move(project, "up")}
                                disabled={pendingAction !== null || isFirst}
                                className="p-2 text-ink-muted hover:text-ink hover:bg-paper disabled:text-ink-faint disabled:hover:bg-transparent rounded-sm border border-transparent hover:border-line transition-all"
                                title="Move project up"
                              >
                                <ChevronUp size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => move(project, "down")}
                                disabled={pendingAction !== null || isLast}
                                className="p-2 text-ink-muted hover:text-ink hover:bg-paper disabled:text-ink-faint disabled:hover:bg-transparent rounded-sm border border-transparent hover:border-line transition-all"
                                title="Move project down"
                              >
                                <ChevronDown size={16} />
                              </button>
                            </div>
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => startEditing(project)}
                                disabled={pendingAction !== null}
                                className="p-2 text-ink-muted hover:text-ink hover:bg-paper rounded-sm shadow-sm border border-transparent hover:border-line transition-all"
                                title="Edit project"
                              >
                                <Edit2 size={16} />
                              </button>
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-ink-muted hover:text-ink hover:bg-paper rounded-sm shadow-sm border border-transparent hover:border-line transition-all"
                                  title="Open project"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteProject(project)}
                                disabled={pendingAction !== null || isDeleting}
                                className="p-2 text-danger/50 hover:text-danger hover:bg-paper disabled:opacity-40 rounded-sm shadow-sm border border-transparent hover:border-danger-line transition-all"
                                title="Delete project"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {status !== "Exhausted" && projects !== undefined && (
        <Button
          type="button"
          variant="outline"
          onClick={onLoadMore}
          disabled={status === "LoadingMore"}
          className="mt-8 w-full"
        >
          {status === "LoadingMore" ? "Loading Missions..." : "Load More Missions"}
        </Button>
      )}
    </Panel>
  );
}
