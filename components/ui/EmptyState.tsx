import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function EmptyState({
  title = "Chưa có dữ liệu.",
  description,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("rounded-lg border border-dashed border-zinc-300 p-8 text-center", className)}>
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      {description ? <p className="mt-2 text-sm text-zinc-600">{description}</p> : null}
    </div>
  );
}
