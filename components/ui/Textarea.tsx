import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ className, id, label, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="block text-sm font-medium text-zinc-800">
      {label ? <span className="mb-1 block">{label}</span> : null}
      <textarea
        id={textareaId}
        className={cn(
          "min-h-28 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900",
          className,
        )}
        {...props}
      />
    </label>
  );
}
