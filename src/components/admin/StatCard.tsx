import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accentColor?: string;
}

export function StatCard({ label, value, icon: Icon, accentColor = "text-accent" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-line bg-paper p-5 dark:border-line-dark dark:bg-surface-dark-card">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 ${accentColor}`}>
        <Icon size={18} />
      </div>
      <p className="mt-4 font-display text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
