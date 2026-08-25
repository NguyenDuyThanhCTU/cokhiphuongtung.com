import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import {
  getCatalogCategories,
  getCatalogItems,
  getCatalogTags,
} from "@/features/catalog/services/catalog.service";
import type { CatalogListResult } from "@/features/catalog/types";
import {
  parseCatalogListSearchParams,
  SearchParamsRecord,
} from "@/components/catalog/CatalogSlug/catalog-list-query";
import {
  findCatalogCategoryBySlug,
  getCatalogCategoryBreadcrumbs,
  isCatalogCategoryVisible,
} from "@/components/catalog/CatalogSlug/catalog-category-tree";
import { CatalogCategoryHero } from "@/components/catalog/CatalogSlug/CatalogCategoryHero";
import { CatalogChildCategoryNavigator } from "@/components/catalog/CatalogSlug/CatalogChildCategoryNavigator";
import { CatalogActiveFilters } from "@/components/catalog/CatalogSlug/CatalogActiveFilters";
import { CatalogPagination } from "@/components/catalog/CatalogSlug/CatalogPagination";
import { CatalogEmptyState } from "@/components/catalog/CatalogSlug/CatalogEmptyState";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

type CatalogCategoryPageProps = {
  params: {
    slug: string[];
  };
  searchParams?: SearchParamsRecord;
};

type CatalogMeta = NonNullable<CatalogListResult["meta"]>;

function getCategorySlug(params: CatalogCategoryPageProps["params"]) {
  if (!params.slug?.length || params.slug.length !== 1) {
    return null;
  }

  const slug = params.slug[0]?.trim();

  return slug || null;
}

function getSafeCatalogMeta(
  catalog: CatalogListResult,
  fallback: Pick<CatalogMeta, "page" | "limit">,
): CatalogMeta {
  return (
    catalog.meta ?? {
      page: fallback.page,
      limit: fallback.limit,
      total: catalog.items.length,
      totalPages: 1,
    }
  );
}

async function loadCategoryPageData(
  categorySlug: string,
  searchParams: SearchParamsRecord = {},
) {
  const parsedQuery = parseCatalogListSearchParams(searchParams);
  const query = {
    ...parsedQuery,
    category: categorySlug,
  };

  const [catalog, categories, tags] = await Promise.all([
    getCatalogItems(query),
    getCatalogCategories(),
    getCatalogTags(),
  ]);

  const category = findCatalogCategoryBySlug(categories, categorySlug);

  if (!isCatalogCategoryVisible(category)) {
    notFound();
  }

  const meta = getSafeCatalogMeta(catalog, {
    page: query.page ?? 1,
    limit: query.limit ?? 12,
  });

  return {
    catalog,
    categories,
    tags,
    category,
    breadcrumbs: getCatalogCategoryBreadcrumbs(categories, category),
    meta,
  };
}

export async function generateMetadata({
  params,
}: CatalogCategoryPageProps): Promise<Metadata> {
  const categorySlug = getCategorySlug(params);

  if (!categorySlug) {
    return {
      title: "Danh mục tuyến xe",
      description: "Danh sách tuyến xe và vé xe Hà Giang",
    };
  }

  const categories = await getCatalogCategories();
  const category = findCatalogCategoryBySlug(categories, categorySlug);

  if (!isCatalogCategoryVisible(category)) {
    return {
      title: "Danh mục tuyến xe",
      description: "Danh sách tuyến xe và vé xe Hà Giang",
    };
  }

  return {
    title: `${category.name} | Tuyến xe và vé xe Hà Giang`,
    description:
      category.description ??
      `Danh sách tuyến xe và vé xe thuộc danh mục ${category.name}`,
    openGraph: {
      title: `${category.name} | Tuyến xe và vé xe`,
      description:
        category.description ??
        `Danh sách tuyến xe và vé xe thuộc danh mục ${category.name}`,
      images: category.thumbnailUrl ? [category.thumbnailUrl] : undefined,
    },
  };
}

export default async function CatalogCategoryPage({
  params,
  searchParams = {},
}: CatalogCategoryPageProps) {
  const categorySlug = getCategorySlug(params);

  if (!categorySlug) {
    notFound();
  }

  const { catalog, categories, tags, category, breadcrumbs, meta } =
    await loadCategoryPageData(categorySlug, searchParams);
  const basePath = `/danh-muc/${category.slug}`;
  const settings = await getPublicSiteSettings();
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 d:px-0 d:py-12">
      <CatalogCategoryHero
        category={category}
        breadcrumbs={breadcrumbs}
        total={meta.total}
      />

      <CatalogChildCategoryNavigator
        categories={categories}
        currentCategory={category}
      />

      <CatalogActiveFilters
        basePath={basePath}
        searchParams={searchParams}
        tags={tags}
      />

      <div className="min-h-screen py-8">
        <div className="py-5">
          {catalog.items.length ? (
            <>
              <CatalogGrid
                items={catalog.items}
                hotline={settings.hotline ? settings.hotline : ""}
              />
              <CatalogPagination
                basePath={basePath}
                meta={meta}
                searchParams={searchParams}
              />
            </>
          ) : (
            <CatalogEmptyState
              title={`Chưa có tuyến xe hoặc vé xe thuộc danh mục ${category.name}.`}
              description="Nội dung đang được cập nhật. Bạn có thể quay lại danh sách tuyến xe hoặc liên hệ hotline để được tư vấn."
            />
          )}
        </div>
      </div>
    </div>
  );
}
