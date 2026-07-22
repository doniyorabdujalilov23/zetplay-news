interface AdSlotProps {
  code?: string;
  label?: string;
  className?: string;
}

export function AdSlot({ code, label = "Reklama", className = "" }: AdSlotProps) {
  if (!code) {
    return (
      <div
        className={`flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-line font-mono text-xs uppercase tracking-widest text-muted dark:border-line-dark ${className}`}
      >
        {label}
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
}
