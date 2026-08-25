import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getBlogPosts,
  getPostCategories,
} from "@/features/content/services/content.service";
import {
  BlogCategorySearchParams,
  buildCategoryTreeContext,
  filterBlogPostsByCategory,
  findRootCategoryBySlug,
  parseBlogCategorySearchParams,
} from "@/components/blogs/BlogSlug/blog-category-filter";
import BlogCategoryHero from "@/components/blogs/BlogSlug/BlogCategoryHero";
import BlogCategoryFilters from "@/components/blogs/BlogSlug/BlogCategoryFilters";
import BlogCategoryPostGrid from "@/components/blogs/BlogSlug/BlogCategoryPostGrid";
import BlogCategoryPagination from "@/components/blogs/BlogSlug/BlogCategoryPagination";

export type CategoryBlogPageProps = {
  params: {
    slug: string[];
  };
  searchParams?: BlogCategorySearchParams;
};

async function loadCategoryPageData(mainCategorySlug: string) {
  try {
    const [posts, categories] = await Promise.all([
      getBlogPosts(),
      getPostCategories(),
    ]);

    const categoryContext = buildCategoryTreeContext(categories);
    const rootCategory = findRootCategoryBySlug(
      categoryContext,
      mainCategorySlug,
    );

    if (!rootCategory) {
      notFound();
    }

    return {
      posts,
      categoryContext,
      rootCategory,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load category blog page.", error);
    }

    notFound();
  }
}

function getMainCategorySlug(params: CategoryBlogPageProps["params"]) {
  const [mainCategorySlug, ...restSlugs] = params.slug ?? [];

  if (!mainCategorySlug || restSlugs.length > 0) {
    notFound();
  }

  return mainCategorySlug;
}

export async function generateMetadata({
  params,
}: CategoryBlogPageProps): Promise<Metadata> {
  const mainCategorySlug = getMainCategorySlug(params);
  const { rootCategory } = await loadCategoryPageData(mainCategorySlug);

  const title = `${rootCategory.name} - Bài viết`;
  const description =
    rootCategory.description ??
    `Tổng hợp các bài viết mới nhất thuộc chuyên mục ${rootCategory.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/chuyen-muc/${rootCategory.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CategoryBlogPage({
  params,
  searchParams = {},
}: CategoryBlogPageProps) {
  const mainCategorySlug = getMainCategorySlug(params);
  const query = parseBlogCategorySearchParams(searchParams);
  const { posts, categoryContext, rootCategory } =
    await loadCategoryPageData(mainCategorySlug);

  const result = filterBlogPostsByCategory(
    posts,
    rootCategory,
    categoryContext,
    query,
  );

  return (
    <>
      <BlogCategoryHero
        category={rootCategory}
        totalPosts={result.categoryPosts.length}
        filteredPosts={result.totalFiltered}
        searchTerm={query.q}
      />

      <BlogCategoryFilters
        mainCategorySlug={mainCategorySlug}
        childCategories={result.childCategories}
        selectedSubSlugs={result.selectedChildCategories.map(
          (category) => category.slug,
        )}
        q={query.q}
        sort={query.sort}
        limit={query.limit}
      />

      <div className="min-h-screen bg-bgcontent py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6 d:px-0">
          <BlogCategoryPostGrid posts={result.paginatedPosts} />

          <BlogCategoryPagination
            mainCategorySlug={mainCategorySlug}
            currentPage={result.currentPage}
            totalPages={result.totalPages}
            q={query.q}
            selectedSubSlugs={result.selectedChildCategories.map(
              (category) => category.slug,
            )}
            sort={query.sort}
            limit={query.limit}
          />
        </div>
      </div>
    </>
  );
}
