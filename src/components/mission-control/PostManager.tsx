"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Check, Edit2, FileText, Trash2, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
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
    <section className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-gray-400" />
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            Active Mission Logs
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
          {posts?.length ?? 0} Loaded Logs
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

      {posts === undefined ? (
        <div className="animate-pulse space-y-4" aria-label="Loading posts">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 bg-gray-50" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 text-gray-400 font-mono text-xs uppercase tracking-widest">
          No mission logs found in database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 font-mono text-[10px] uppercase tracking-widest text-gray-400">
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
                    className={`group border-b border-gray-50 transition-colors ${isEditing ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                  >
                    {isEditing ? (
                      <>
                        <td className="py-4 align-top text-[10px] font-mono text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString()}
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
                            className="w-full bg-white border border-gray-300 p-1 font-bold"
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
                            className="w-full bg-white border border-gray-300 p-1 text-xs min-h-[100px] font-mono"
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
                            className="w-full bg-white border border-gray-300 p-1 text-[10px]"
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
                            className="w-full bg-white border border-gray-300 p-1 text-[10px] font-mono uppercase"
                            placeholder="Category"
                          />
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={pendingAction !== null}
                              className="p-1.5 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 rounded-sm"
                              title="Save post"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPostId(null)}
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
                        <td className="py-4 font-mono text-[10px] text-gray-400 align-top">
                          {new Date(post.publishedAt).toLocaleDateString()}
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
                              className={`p-1.5 rounded-full transition-all disabled:opacity-40 ${post.isPublished ? "text-green-500 bg-green-50" : "text-gray-300 hover:text-green-400"}`}
                              title={
                                post.isPublished
                                  ? "Unpublish post"
                                  : "Publish post"
                              }
                            >
                              <Check size={16} />
                            </button>
                            <div>
                              <div className="font-bold text-lg">
                                {post.title}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-md">
                                {post.excerpt}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono mt-1">
                                /{post.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-top">
                          <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full uppercase tracking-widest inline-block border border-blue-100">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-4 text-right align-top">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => startEditing(post)}
                              disabled={pendingAction !== null}
                              className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-sm shadow-sm border border-transparent hover:border-gray-200 transition-all"
                              title="Edit post"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePost(post)}
                              disabled={pendingAction !== null || isDeleting}
                              className="p-2 text-red-300 hover:text-red-600 hover:bg-white disabled:opacity-40 rounded-sm shadow-sm border border-transparent hover:border-red-100 transition-all"
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
        <button
          type="button"
          onClick={onLoadMore}
          disabled={status === "LoadingMore"}
          className="mt-8 w-full border border-gray-200 py-3 font-mono text-xs uppercase tracking-widest text-gray-500 hover:border-black hover:text-black disabled:text-gray-300"
        >
          {status === "LoadingMore" ? "Loading Logs..." : "Load More Logs"}
        </button>
      )}
    </section>
  );
}
