"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Ban, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAllComments, updateCommentStatus, deleteComment } from "@/lib/data/admin-comments";
import { formatDateTime } from "@/lib/utils/format";
import { COMMENT_STATUS_LABELS } from "@/lib/constants";
import type { Comment, CommentStatus } from "@/types";

const STATUS_STYLES: Record<CommentStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-emerald-500/10 text-emerald-600",
  spam: "bg-red-500/10 text-red-600",
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CommentStatus | "all">("all");

  const load = () => {
    setLoading(true);
    getAllComments()
      .then(setComments)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (comment: Comment, status: CommentStatus) => {
    try {
      await updateCommentStatus(comment.id, status);
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, status } : c)));
      toast.success("Holat yangilandi");
    } catch {
      toast.error("Yangilashda xatolik");
    }
  };

  const handleDelete = async (comment: Comment) => {
    if (!window.confirm("Ushbu izohni o'chirasizmi?")) return;
    try {
      await deleteComment(comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
      toast.success("Izoh o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const filtered = comments.filter((c) => filter === "all" || c.status === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Izohlarni boshqarish</h1>
      <p className="mt-1 text-sm text-muted">Foydalanuvchi izohlarini tasdiqlash yoki o'chirish</p>

      <div className="mt-6 flex gap-1.5">
        {(["all", "pending", "approved", "spam"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === status
                ? "bg-accent text-white"
                : "border border-line text-muted hover:border-accent hover:text-accent dark:border-line-dark"
            }`}
          >
            {status === "all" ? "Barchasi" : COMMENT_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={24} />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-line p-4 dark:border-line-dark">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{comment.name}</span>
                    <span className="text-xs text-muted">{comment.email}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[comment.status]}`}>
                      {COMMENT_STATUS_LABELS[comment.status]}
                    </span>
                  </div>
                  <Link
                    href={`/yangilik/${comment.articleSlug}`}
                    target="_blank"
                    className="mt-0.5 block text-xs text-accent hover:underline"
                  >
                    {comment.articleTitle}
                  </Link>
                </div>
                <span className="font-mono text-xs text-muted">{formatDateTime(comment.createdAt)}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{comment.content}</p>
              <div className="mt-3 flex gap-2">
                {comment.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(comment, "approved")}
                    className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium transition hover:border-emerald-500 hover:text-emerald-600 dark:border-line-dark"
                  >
                    <Check size={13} /> Tasdiqlash
                  </button>
                )}
                {comment.status !== "spam" && (
                  <button
                    onClick={() => handleStatusChange(comment, "spam")}
                    className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium transition hover:border-amber-500 hover:text-amber-600 dark:border-line-dark"
                  >
                    <Ban size={13} /> Spam
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment)}
                  className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium transition hover:border-red-500 hover:text-red-500 dark:border-line-dark"
                >
                  <Trash2 size={13} /> O'chirish
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted">Izohlar topilmadi.</p>}
        </div>
      )}
    </div>
  );
}
