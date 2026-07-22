"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

export function AdminGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || !role) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      router.replace("/admin");
    }
  }, [loading, user, role, allowedRoles, router]);

  if (loading || !user || !role || (allowedRoles && !allowedRoles.includes(role))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-surface-dark">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  return <>{children}</>;
}
