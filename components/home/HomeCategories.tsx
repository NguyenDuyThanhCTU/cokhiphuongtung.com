import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

import type { CatalogCategory } from "@/features/catalog/types";

export default function HomeCategories({ categories }: { categories: CatalogCategory[] }) {
  const visibleCategories = categories
    .filter((category) => category.isActive !== false)
    .slice(0, 6);

  if (visibleCategories.length === 0) return null;

  return (
    <section className="bg-white py-14 d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Danh mục sản phẩm</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Giải pháp cho từng hạng mục</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Khám phá các nhóm sản phẩm cơ khí, sắt mỹ thuật và hạng mục thi công.</p>
          </div>
          <Link href="/danh-muc" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-700 transition hover:text-brand-500">
            Xem tất cả sản phẩm <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 d:grid-cols-3">
          {visibleCategories.map((category, index) => (
            <Link key={category.id} href={`/danh-muc/${category.slug}`} className="group relative min-h-[230px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              {category.thumbnailUrl ? (
                <Image src={category.thumbnailUrl} alt={category.name} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-55" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,184,0,0.55),transparent_35%),linear-gradient(135deg,#111827,#1f2937)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
              <div className="relative flex min-h-[230px] flex-col justify-between p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-400 text-slate-950"><Layers3 size={21} aria-hidden="true" /></span>
                  <span className="text-xs font-bold text-white/60">0{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold leading-snug">{category.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{category.description || "Xem mẫu, thông tin kỹ thuật và gửi yêu cầu báo giá theo kích thước."}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
