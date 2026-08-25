import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

import type { CatalogCategory } from "@/features/catalog/types";

export function CatalogCategoryNav({ categories }: { categories: CatalogCategory[] }) {
  const visibleCategories = categories.filter((category) => category.isActive !== false);
  if (!visibleCategories.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-slate-950">Nhóm tuyến xe</h2>
        <span className="text-xs font-semibold text-slate-500">Chọn danh mục để xem vé xe phù hợp</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 d:grid-cols-4">
        {visibleCategories.slice(0, 8).map((category) => (
          <Link key={category.id} href={`/danh-muc/${category.slug}`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-300 hover:bg-brand-50">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-100 text-brand-800">
              {category.thumbnailUrl ? <Image src={category.thumbnailUrl} alt="" fill sizes="48px" className="object-cover" /> : <MapPinned size={21} />}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="line-clamp-2 text-sm leading-5 text-slate-900">{category.name}</strong>
            </span>
            <ArrowRight size={15} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
          </Link>
        ))}
      </div>
    </section>
  );
}
