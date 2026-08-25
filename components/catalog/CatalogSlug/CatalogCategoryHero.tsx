import Link from "next/link";
import Image from "next/image";
import type { CatalogCategory } from "@/features/catalog/types";
import type { CatalogCategoryBreadcrumb } from "./catalog-category-tree";

type CatalogCategoryHeroProps = {
  category: CatalogCategory;
  breadcrumbs: CatalogCategoryBreadcrumb[];
  total?: number;
};

export function CatalogCategoryHero({
  category,
  breadcrumbs,
  total,
}: CatalogCategoryHeroProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <nav
            className="flex flex-wrap items-center gap-2 text-sm text-zinc-500"
            aria-label="Breadcrumb"
          >
            <Link
              href="/danh-muc"
              className="font-medium text-zinc-600 hover:text-brand-700"
            >
              Tuyến xe
            </Link>
            {breadcrumbs.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-2">
                <span className="text-zinc-300">/</span>
                <span className="font-medium text-zinc-700">{item.name}</span>
              </span>
            ))}
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-950">
              Danh mục
            </span>

            {typeof total === "number" ? (
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                {total} tuyến/vé phù hợp
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            {category.name}
          </h1>

          {category.description ? (
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
              {category.description}
            </p>
          ) : (
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
              Khám phá các tuyến xe, vé xe và thông tin dịch vụ thuộc danh mục {category.name}.
            </p>
          )}
        </div>

        {category.thumbnailUrl ? (
          <div className="relative min-h-[240px] overflow-hidden bg-zinc-100 lg:min-h-full">
            <Image
              src={category.thumbnailUrl}
              alt={category.name}
              fill
              sizes="(max-width: 1023px) 100vw, 420px"
              className="object-cover transition duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
          </div>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center bg-gradient-to-br from-brand-100 to-zinc-100 px-8 text-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
                Danh mục tuyến xe
              </p>
              <p className="mt-3 text-2xl font-bold text-zinc-900">
                {category.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
