"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, FileText, CalendarClock, Eye, Loader2 } from "lucide-react";
import { getDashboardStats, type DashboardStats } from "@/lib/data/admin";
import { StatCard } from "@/components/admin/StatCard";
import { formatCompactNumber, formatDateTime } from "@/lib/utils/format";
import { ROLE_LABELS } from "@/lib/constants";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Statistika</h1>
      <p className="mt-1 text-sm text-muted">Saytning umumiy ko'rsatkichlari</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Jami maqolalar" value={stats.totalArticles} icon={Newspaper} />
        <StatCard label="Chop etilgan" value={stats.publishedArticles} icon={FileText} />
        <StatCard label="Bugungi maqolalar" value={stats.todayArticles} icon={CalendarClock} />
        <StatCard label="Jami o'qilishlar" value={formatCompactNumber(stats.totalViews)} icon={Eye} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-5 dark:border-line-dark dark:bg-surface-dark-card">
          <h2 className="font-display text-lg font-bold">Eng mashhur maqolalar</h2>
          <ul className="mt-4 space-y-3">
            {stats.topArticles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/admin/maqolalar/${article.id}`}
                  className="flex items-center justify-between gap-3 text-sm hover:text-accent"
                >
                  <span className="line-clamp-1">{article.title}</span>
                  <span className="shrink-0 font-mono text-xs text-muted">
                    {formatCompactNumber(article.views)}
                  </span>
                </Link>
              </li>
            ))}
            {stats.topArticles.length === 0 && (
              <p className="text-sm text-muted">Hozircha maqolalar yo'q.</p>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-paper p-5 dark:border-line-dark dark:bg-surface-dark-card">
          <h2 className="font-display text-lg font-bold">Oxirgi foydalanuvchilar</h2>
          <ul className="mt-4 space-y-3">
            {stats.recentUsers.map((user) => (
              <li key={user.uid} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{user.displayName || user.email}</p>
                  <p className="text-xs text-muted">{formatDateTime(user.createdAt)}</p>
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] text-accent">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </li>
            ))}
            {stats.recentUsers.length === 0 && (
              <p className="text-sm text-muted">Hozircha foydalanuvchilar yo'q.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
