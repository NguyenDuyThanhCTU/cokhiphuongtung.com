"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Không thể tải dữ liệu.",
  message = "Vui lòng thử lại.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-6 text-center", className)}>
      <p className="text-sm font-semibold text-red-900">{title}</p>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <Button className="mt-4" variant="secondary" onClick={onRetry}>
          Thử lại
        </Button>
      ) : null}
    </div>
  );
}
