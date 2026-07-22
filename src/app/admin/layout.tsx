import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex bg-paper-dim dark:bg-surface-dark">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</div>
      </div>
    </AdminGuard>
  );
}
