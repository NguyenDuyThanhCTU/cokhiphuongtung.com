import Link from "next/link";
import type { ProductCtaMode } from "@/features/catalog/types";
import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

type ProductCtaProps = {
  slug: string;
  mode?: ProductCtaMode;
  className?: string;
};

export function ProductCta({ slug, mode = "detail", className }: ProductCtaProps) {
  if (mode === "disabled") {
    return null;
  }

  const href = mode === "contact" ? `${routes.booking}?san-pham=${encodeURIComponent(slug)}` : `/san-pham/${slug}`;
  const label = mode === "contact" ? "Yêu cầu báo giá" : "Xem chi tiết";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800",
        className,
      )}
    >
      {label}
    </Link>
  );
}
