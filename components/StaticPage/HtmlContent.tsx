import { cn } from "@/lib/utils/cn";

type HtmlContentProps = {
  html: string;
  className?: string;
};

export function HtmlContent({ html, className }: HtmlContentProps) {
  return (
    <div
      className={cn(
        "space-y-4 text-sm leading-7 text-zinc-700 ck-content",
        className,
      )}
      // Backend content must be sanitized before it reaches the public website.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
