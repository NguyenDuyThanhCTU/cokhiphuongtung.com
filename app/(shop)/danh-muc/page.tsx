import BlogsH1 from "@/components/blogs/BlogsH1";
import {
  CatalogSearchParamsInput,
  parseCatalogListSearchParams,
} from "@/components/catalog/catalog-list-query";
import { CatalogActiveFilters } from "@/components/catalog/CatalogActiveFilters";
import { CatalogEmptyState } from "@/components/catalog/CatalogEmptyState";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
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
import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";

export const metadata: Metadata = {
  title: "Tuyến xe và vé xe Hà Giang",
  description:
    "Xem danh sách tuyến xe, vé xe đi Hà Giang và gửi yêu cầu đặt vé nhanh.",
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
    <>
      <BlogsH1
        Content="Tuyến xe & vé xe"
        description="Chọn tuyến phù hợp, tham khảo giá vé và gửi yêu cầu để được xác nhận nhanh."
      />

      <div className="min-h-screen bg-bgcontent py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6 d:px-0">
          <CatalogCategoryNav categories={categories} />
          <CatalogPageHeader query={query} meta={meta} />

          {/* <CatalogFilters tags={tags} searchParams={searchParams} /> */}

          <CatalogActiveFilters tags={tags} searchParams={searchParams} />

          {catalog.items.length > 0 ? (
            <CatalogGrid
              items={catalog.items}
              hotline={settings.hotline ? settings.hotline : ""}
            />
          ) : (
            <CatalogEmptyState />
          )}

          <CatalogPagination meta={meta} searchParams={searchParams} />
        </div>
      </div>
    </>
  );
}
