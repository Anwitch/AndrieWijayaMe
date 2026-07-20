"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import {
  Check,
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
import { getErrorMessage } from "@/lib/errors";

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
};

export default function ProjectManager({
  projects,
  status,
  onLoadMore,
}: ProjectManagerProps) {
  const removeProject = useMutation(api.projects.removeProject);
  const updateProject = useMutation(api.projects.updateProject);
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
        }),
      () => setEditingProjectId(null),
    );
  };

  const deleteProject = (project: Doc<"projects">) => {
    if (!window.confirm(`Delete "${project.title}" permanently?`)) return;
    void runAction(`delete-${project._id}`, () =>
      removeProject({ id: project._id }),
    );
  };

  return (
    <section className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-gray-400" />
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            Active Projects
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
          {projects?.length ?? 0} Loaded Missions
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {projects === undefined ? (
        <div className="animate-pulse space-y-4" aria-label="Loading projects">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 bg-gray-50" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 text-gray-400 font-mono text-xs uppercase tracking-widest">
          No projects found in database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                <th className="pb-4 font-normal w-24">Year</th>
                <th className="pb-4 font-normal">Mission Details</th>
                <th className="pb-4 font-normal w-32">Tags</th>
                <th className="pb-4 font-normal text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const isEditing = editingProjectId === project._id;
                const isSaving = pendingAction === `save-${project._id}`;
                const isDeleting = pendingAction === `delete-${project._id}`;
                const isPublished = project.isPublished !== false;

                return (
                  <tr
                    key={project._id}
                    className={`group border-b border-gray-50 transition-colors ${isEditing ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
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
                            className="w-full bg-white border border-gray-300 p-1 text-sm font-mono"
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
                            className="w-full bg-white border border-gray-300 p-1 font-bold"
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
                            className="w-full bg-white border border-gray-300 p-1 text-xs min-h-[60px]"
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
                            className="w-full bg-white border border-gray-300 p-1 text-[10px] font-mono"
                            placeholder="https://example.com"
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
                            className="w-full bg-white border border-gray-300 p-1 text-[10px] font-mono uppercase"
                          />
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={pendingAction !== null}
                              className="p-1.5 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 rounded-sm"
                              title="Save project"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProjectId(null)}
                              disabled={pendingAction !== null}
                              className="p-1.5 border border-gray-300 bg-white hover:bg-gray-50 disabled:text-gray-300 rounded-sm"
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
                              className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${isPublished ? "text-green-600 bg-green-50" : "text-gray-300 hover:text-green-500"}`}
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
                              className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${project.isFeatured ? "text-yellow-500 bg-yellow-50 shadow-sm" : "text-gray-300 hover:text-yellow-400"}`}
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
                              <div className="font-bold text-lg">
                                {project.title}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-md">
                                {project.description}
                              </div>
                              {project.link && (
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                  {project.link}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-top">
                          <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 rounded-full uppercase tracking-widest inline-block">
                            {project.tags}
                          </span>
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => startEditing(project)}
                              disabled={pendingAction !== null}
                              className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-sm shadow-sm border border-transparent hover:border-gray-200 transition-all"
                              title="Edit project"
                            >
                              <Edit2 size={16} />
                            </button>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-sm shadow-sm border border-transparent hover:border-gray-200 transition-all"
                                title="Open project"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteProject(project)}
                              disabled={pendingAction !== null || isDeleting}
                              className="p-2 text-red-300 hover:text-red-600 hover:bg-white disabled:opacity-40 rounded-sm shadow-sm border border-transparent hover:border-red-100 transition-all"
                              title="Delete project"
                            >
                              <Trash2 size={16} />
                            </button>
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
        <button
          type="button"
          onClick={onLoadMore}
          disabled={status === "LoadingMore"}
          className="mt-8 w-full border border-gray-200 py-3 font-mono text-xs uppercase tracking-widest text-gray-500 hover:border-black hover:text-black disabled:text-gray-300"
        >
          {status === "LoadingMore" ? "Loading Missions..." : "Load More Missions"}
        </button>
      )}
    </section>
  );
}
