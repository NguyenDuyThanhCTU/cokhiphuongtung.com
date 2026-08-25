import { cn } from "@/lib/utils/cn";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({ message = "Đang tải dữ liệu...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex min-h-40 items-center justify-center text-sm text-zinc-600", className)}>
      {message}
    </div>
  );
}
