import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { PostCategory } from "@/features/content/types";

export default function BlogCategoryDirectory({ categories }: { categories: PostCategory[] }) {
  const visibleCategories = categories.filter((category) => category.isActive !== false && !category.parentId);
  if (!visibleCategories.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-black text-slate-950">Chuyên mục bài viết</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Chọn chủ đề để xem kinh nghiệm và thông tin kỹ thuật phù hợp.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 d:grid-cols-3">
        {visibleCategories.map((category) => (
          <Link key={category.id} href={`/chuyen-muc/${category.slug}`} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:bg-brand-50">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800"><BookOpen size={20} /></span>
            <span className="min-w-0 flex-1"><strong className="block text-slate-950">{category.name}</strong>{category.description ? <span className="mt-1 line-clamp-1 block text-xs text-slate-500">{category.description}</span> : null}</span>
            <ArrowRight size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
          </Link>
        ))}
      </div>
    </section>
  );
}
