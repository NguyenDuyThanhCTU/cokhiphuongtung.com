import type { PostCategory } from "@/features/content/types";

export type BlogCategoryHeroProps = {
  category: PostCategory;
  totalPosts: number;
  filteredPosts: number;
  searchTerm?: string;
};

export default function BlogCategoryHero({
  category,
  totalPosts,
  filteredPosts,
  searchTerm,
}: BlogCategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-white py-12">
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-400" />

      <div className="d:w-[1400px] d:mx-auto p:w-auto p:mx-2">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full bg-brand-400 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-950">
            Chuyên mục
          </p>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            {category.name}
          </h1>

          {category.description ? (
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
              {category.description}
            </p>
          ) : (
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
              Tổng hợp các bài viết mới nhất thuộc chuyên mục {category.name}.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-600">
            <span className="rounded-full border border-brand-200 bg-white px-4 py-2 font-medium shadow-sm">
              {totalPosts} bài viết trong chuyên mục
            </span>

            {filteredPosts !== totalPosts ? (
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium shadow-sm">
                {filteredPosts} bài viết phù hợp
              </span>
            ) : null}

            {searchTerm ? (
              <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-medium text-blue-700">
                Từ khóa: {searchTerm}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
