"use client";

import { useState } from "react";
import { MessageCircle, Heart, Send } from "lucide-react";
import toast from "react-hot-toast";
import { submitComment, likeComment } from "@/lib/data/comments";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Comment } from "@/types";

interface CommentsSectionProps {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  initialComments: Comment[];
}

export function CommentsSection({
  articleId,
  articleSlug,
  articleTitle,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    setSubmitting(true);
    try {
      await submitComment({
        articleId,
        articleSlug,
        articleTitle,
        name,
        email,
        content,
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setContent("");
      toast.success("Izohingiz yuborildi va moderatsiyadan so'ng chop etiladi");
    } catch {
      toast.error("Izohni yuborib bo'lmadi. Qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedIds.has(commentId)) return;
    setLikedIds((prev) => new Set(prev).add(commentId));
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
    try {
      await likeComment(commentId);
    } catch {
      // revert silently on failure
    }
  };

  return (
    <section className="mt-12 border-t border-line pt-8 dark:border-line-dark">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold">
        <MessageCircle size={20} />
        Izohlar <span className="text-muted">({comments.length})</span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-xl border border-line p-5 dark:border-line-dark">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismingiz"
            required
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email manzilingiz"
            required
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Fikringizni yozing..."
          required
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
        />
        <div className="flex items-center justify-between">
          {submitted && (
            <span className="text-xs text-muted">Izohingiz tasdiqlanishi kutilmoqda.</span>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="ml-auto flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            <Send size={14} />
            {submitting ? "Yuborilmoqda..." : "Izoh qoldirish"}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-display font-semibold text-accent">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{comment.name}</span>
                <span className="font-mono text-xs text-muted">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink/90 dark:text-paper/90">
                {comment.content}
              </p>
              <button
                type="button"
                onClick={() => handleLike(comment.id)}
                className="mt-1.5 flex items-center gap-1 text-xs text-muted transition hover:text-accent"
              >
                <Heart size={12} className={likedIds.has(comment.id) ? "fill-current text-accent" : ""} />
                {comment.likes}
              </button>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted">Hozircha izohlar yo'q. Birinchi bo'lib fikr bildiring!</p>
        )}
      </div>
    </section>
  );
}
