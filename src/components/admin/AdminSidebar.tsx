"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  FolderTree,
  Tags,
  Users,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Statistika", icon: LayoutDashboard },
  { href: "/admin/maqolalar", label: "Yangiliklar", icon: Newspaper, roles: ["admin", "editor"] },
  { href: "/admin/media", label: "Media", icon: ImageIcon, roles: ["admin", "editor"] },
  { href: "/admin/kategoriyalar", label: "Kategoriyalar", icon: FolderTree, roles: ["admin", "editor"] },
  { href: "/admin/teglar", label: "Teglar", icon: Tags, roles: ["admin", "editor"] },
  { href: "/admin/izohlar", label: "Izohlar", icon: MessageSquare, roles: ["admin", "moderator"] },
  { href: "/admin/foydalanuvchilar", label: "Foydalanuvchilar", icon: Users, roles: ["admin"] },
  { href: "/admin/sozlamalar", label: "Sozlamalar", icon: Settings, roles: ["admin"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { role, signOut, user } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)));

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-paper dark:border-line-dark dark:bg-surface-dark-card">
      <div className="border-b border-line p-5 dark:border-line-dark">
        <Link href="/admin" className="font-display text-xl font-bold">
          Zet<span className="text-accent">Play</span>
        </Link>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
          Admin panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-accent text-white"
                  : "text-ink hover:bg-accent/10 hover:text-accent dark:text-paper"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-4 dark:border-line-dark">
        <p className="truncate text-xs text-muted">{user?.email}</p>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-red-50 hover:text-red-600 dark:text-paper dark:hover:bg-red-950/30"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
