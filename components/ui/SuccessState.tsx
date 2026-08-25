import { cn } from "@/lib/utils/cn";

type SuccessStateProps = {
  message?: string;
  className?: string;
};

export function SuccessState({ message = "Thao tác thành công.", className }: SuccessStateProps) {
  return (
    <div className={cn("rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800", className)}>
      {message}
    </div>
  );
}
