import {
  CatalogSearchParamsInput,
  parseCatalogListSearchParams,
} from "@/components/catalog/catalog-list-query";
import { CatalogActiveFilters } from "@/components/catalog/CatalogActiveFilters";
import { CatalogEmptyState } from "@/components/catalog/CatalogEmptyState";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { CatalogPageHeader } from "@/components/catalog/CatalogPageHeader";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import {
  getCatalogCategories,
  getCatalogItems,
  getCatalogTags,
} from "@/features/catalog/services/catalog.service";
import type { CatalogListResult } from "@/features/catalog/types";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm cơ khí",
  description:
    "Khám phá sản phẩm cơ khí, sắt mỹ thuật và các hạng mục thi công của Cơ Khí Phương Tùng.",
  alternates: { canonical: "/danh-muc" },
};

type CatalogPageProps = {
  searchParams?: CatalogSearchParamsInput;
};

function getSafeMeta(
  catalog: CatalogListResult,
  fallback: { page: number; limit: number },
): NonNullable<CatalogListResult["meta"]> {
  return (
    catalog.meta ?? {
      page: fallback.page,
      limit: fallback.limit,
      total: catalog.items.length,
      totalPages: 1,
    }
  );
}

export default async function CatalogPage({
  searchParams = {},
}: CatalogPageProps) {
  const query = parseCatalogListSearchParams(searchParams);

  const [catalog, categories, tags, settings] = await Promise.all([
    getCatalogItems(query),
    getCatalogCategories(),
    getCatalogTags(),
    getPublicSiteSettings(),
  ]);

  const meta = getSafeMeta(catalog, {
    page: query.page ?? 1,
    limit: query.limit ?? 12,
  });

  return (
      <div className="min-h-screen bg-[url(https://www.vstarcam.com/wp-content/uploads/2022/11/CS49-K%E8%8B%B1%E6%96%87%E8%AF%A6%E6%83%85%E9%A1%B5_14.jpg)] bg-cover bg-no-repeat">
        <div className="min-h-screen bg-[rgba(255,255,255,0.85)] py-5">
          <CatalogPageHeader query={query} meta={meta} />

          <CatalogActiveFilters tags={tags} searchParams={searchParams} />

          <div className="mt-4">{catalog.items.length > 0 ? (
            <CatalogGrid
              items={catalog.items}
              hotline={settings.hotline ? settings.hotline : ""}
            />
          ) : (
            <CatalogEmptyState />
          )}</div>

          <CatalogPagination meta={meta} searchParams={searchParams} />
      </div>
    </div>
  );
}
