import Link from "next/link";
import type { PostCategory } from "@/features/content/types";
import {
  BLOG_SORT_OPTIONS,
  BlogPostSort,
  createCategoryHref,
} from "./blog-category-filter";

export type BlogCategoryFiltersProps = {
  mainCategorySlug: string;
  childCategories: PostCategory[];
  selectedSubSlugs: string[];
  q: string;
  sort: BlogPostSort;
  limit: number;
};

function toggleSubSlug(selectedSubSlugs: string[], slug: string) {
  return selectedSubSlugs.includes(slug)
    ? selectedSubSlugs.filter((item) => item !== slug)
    : [...selectedSubSlugs, slug];
}

export default function BlogCategoryFilters({
  mainCategorySlug,
  childCategories,
  selectedSubSlugs,
  q,
  sort,
  limit,
}: BlogCategoryFiltersProps) {
  return (
    <section className="d:w-[1400px] d:mx-auto p:w-auto p:mx-2 pt-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <form action={`/chuyen-muc/${mainCategorySlug}`} className="min-w-0">
            {selectedSubSlugs.map((subSlug) => (
              <input key={subSlug} type="hidden" name="sub" value={subSlug} />
            ))}
            <input type="hidden" name="sort" value={sort} />
            {limit !== 9 ? (
              <input type="hidden" name="limit" value={limit} />
            ) : null}

            <label
              className="text-sm font-semibold text-zinc-800"
              htmlFor="category-search"
            >
              Tìm trong chuyên mục
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="category-search"
                name="q"
                defaultValue={q}
                placeholder="Nhập từ khóa cần tìm..."
                className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Tìm
              </button>
            </div>
          </form>

          <div>
            <p className="text-sm font-semibold text-zinc-800">Sắp xếp</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {BLOG_SORT_OPTIONS.map((option) => {
                const isActive = option.value === sort;

                return (
                  <Link
                    key={option.value}
                    href={createCategoryHref(mainCategorySlug, {
                      subSlugs: selectedSubSlugs,
                      q,
                      sort: option.value,
                      page: 1,
                      limit,
                    })}
                    className={[
                      "rounded-xl border px-3 py-2 text-center text-xs font-semibold transition",
                      isActive
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600",
                    ].join(" ")}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {childCategories.length > 0 ? (
          <div className="mt-5 border-t border-zinc-100 pt-5">
            <p className="text-sm font-semibold text-zinc-800">
              Danh mục liên quan
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={createCategoryHref(mainCategorySlug, {
                  subSlugs: [],
                  q,
                  sort,
                  page: 1,
                  limit,
                })}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  selectedSubSlugs.length === 0
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600",
                ].join(" ")}
              >
                Tất cả
              </Link>

              {childCategories.map((category) => {
                const nextSubSlugs = toggleSubSlug(
                  selectedSubSlugs,
                  category.slug,
                );
                const isActive = selectedSubSlugs.includes(category.slug);

                return (
                  <Link
                    key={category.id}
                    href={createCategoryHref(mainCategorySlug, {
                      subSlugs: nextSubSlugs,
                      q,
                      sort,
                      page: 1,
                      limit,
                    })}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600",
                    ].join(" ")}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
