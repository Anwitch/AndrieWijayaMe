"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Check, Edit2, FileText, Trash2, X } from "lucide-react";
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

interface PostManagerProps {
  posts: Doc<"posts">[] | undefined;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  onLoadMore: () => void;
}

const emptyPostForm = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
};

const editInputClass =
  "w-full bg-paper border border-line-strong p-1 text-sm outline-none transition-colors focus:border-ink";

export default function PostManager({
  posts,
  status,
  onLoadMore,
}: PostManagerProps) {
  const removePost = useMutation(api.posts.remove);
  const updatePost = useMutation(api.posts.update);
  const [editingPostId, setEditingPostId] = useState<Id<"posts"> | null>(null);
  const [editFormData, setEditFormData] = useState(emptyPostForm);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actionInFlight = useRef(false);

  const startEditing = (post: Doc<"posts">) => {
    if (actionInFlight.current) return;
    setError(null);
    setEditingPostId(post._id);
    setEditFormData({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
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
          "Post operation failed. Please try again.",
        ),
      );
    } finally {
      actionInFlight.current = false;
      setPendingAction(null);
    }
  };

  const saveEdit = () => {
    if (!editingPostId) return;

    const title = editFormData.title.trim();
    const content = editFormData.content.trim();
    if (!title || !content) {
      setError("Post title and content are required.");
      return;
    }

    void runAction(
      `save-${editingPostId}`,
      () =>
        updatePost({
          id: editingPostId,
          title,
          content,
          category: editFormData.category.trim() || "Uncategorized",
          excerpt: editFormData.excerpt.trim(),
        }),
      () => setEditingPostId(null),
    );
  };

  const deletePost = (post: Doc<"posts">) => {
    if (!window.confirm(`Delete "${post.title}" permanently?`)) return;
    void runAction(`delete-${post._id}`, () => removePost({ id: post._id }));
  };

  return (
    <Panel
      size="lg"
      icon={<FileText size={20} className="text-ink-muted" />}
      title="Active Mission Logs"
      aside={<Eyebrow>{posts?.length ?? 0} Loaded Logs</Eyebrow>}
    >
      {error && (
        <FeedbackNote tone="error" className="mb-6">
          {error}
        </FeedbackNote>
      )}

      {posts === undefined ? (
        <div className="animate-pulse space-y-4" aria-label="Loading posts">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-24" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState>No mission logs found in database.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line font-mono text-xs uppercase tracking-widest text-ink-muted">
                <th className="pb-4 font-normal w-32">Date</th>
                <th className="pb-4 font-normal">Log Details</th>
                <th className="pb-4 font-normal w-32">Category</th>
                <th className="pb-4 font-normal text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const isEditing = editingPostId === post._id;
                const isSaving = pendingAction === `save-${post._id}`;
                const isDeleting = pendingAction === `delete-${post._id}`;

                return (
                  <tr
                    key={post._id}
                    className={`group border-b border-line transition-colors ${isEditing ? "bg-accent-subtle/40" : "hover:bg-surface"}`}
                  >
                    {isEditing ? (
                      <>
                        <td className="py-4 align-top font-mono text-xs text-ink-muted">
                          {new Date(post.publishedAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-4 space-y-2">
                          <input
                            aria-label="Post title"
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
                            aria-label="Post content"
                            required
                            value={editFormData.content}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                content: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs min-h-[100px] font-mono`}
                            placeholder="Content (Markdown)"
                          />
                          <input
                            aria-label="Post excerpt"
                            value={editFormData.excerpt}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                excerpt: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs`}
                            placeholder="Excerpt"
                          />
                        </td>
                        <td className="py-4 align-top">
                          <input
                            aria-label="Post category"
                            value={editFormData.category}
                            disabled={isSaving}
                            onChange={(event) =>
                              setEditFormData({
                                ...editFormData,
                                category: event.target.value,
                              })
                            }
                            className={`${editInputClass} text-xs font-mono uppercase`}
                            placeholder="Category"
                          />
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={pendingAction !== null}
                              className="p-1.5 bg-ink text-paper hover:bg-ink-secondary disabled:bg-ink-faint rounded-sm"
                              title="Save post"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPostId(null)}
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
                        <td className="py-4 font-mono text-xs text-ink-muted align-top">
                          {new Date(post.publishedAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(`publish-${post._id}`, () =>
                                  updatePost({
                                    id: post._id,
                                    isPublished: !post.isPublished,
                                  }),
                                )
                              }
                              disabled={pendingAction !== null}
                              className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${post.isPublished ? "text-success bg-success-bg" : "text-ink-faint hover:text-success"}`}
                              title={
                                post.isPublished
                                  ? "Unpublish post"
                                  : "Publish post"
                              }
                            >
                              <Check size={16} />
                            </button>
                            <div>
                              <div className="font-semibold text-lg">
                                {post.title}
                              </div>
                              <div className="text-xs text-ink-muted line-clamp-1 max-w-md">
                                {post.excerpt}
                              </div>
                              <div className="text-xs text-ink-faint font-mono mt-1">
                                /{post.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-top">
                          <span className="font-mono text-xs bg-accent-subtle text-accent px-2 py-1 rounded-full uppercase tracking-widest inline-block">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => startEditing(post)}
                              disabled={pendingAction !== null}
                              className="p-2 text-ink-muted hover:text-ink hover:bg-paper rounded-sm shadow-sm border border-transparent hover:border-line transition-all"
                              title="Edit post"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePost(post)}
                              disabled={pendingAction !== null || isDeleting}
                              className="p-2 text-danger/50 hover:text-danger hover:bg-paper disabled:opacity-40 rounded-sm shadow-sm border border-transparent hover:border-danger-line transition-all"
                              title="Delete post"
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
      {status !== "Exhausted" && posts !== undefined && (
        <Button
          type="button"
          variant="outline"
          onClick={onLoadMore}
          disabled={status === "LoadingMore"}
          className="mt-8 w-full"
        >
          {status === "LoadingMore" ? "Loading Logs..." : "Load More Logs"}
        </Button>
      )}
    </Panel>
  );
}
