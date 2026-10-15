import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogsH1 from "@/components/blogs/BlogsH1";
import BlogViewSwitcher from "@/components/blogs/BlogViewSwitcher";
import {
  buildCategoryTreeContext,
  filterBlogPostsByCategory,
} from "@/components/blogs/BlogSlug/blog-category-filter";
import {
  getBlogPosts,
  getOptionalBlogPostBySlug,
  getPostCategories,
} from "@/features/content/services/content.service";

export type CategoryBlogPageProps = {
  params: {
    slug: string[];
  };
};

async function loadCategoryPageData(
  categorySlug: string,
  includePostContent = false,
) {
  try {
    const [posts, categories] = await Promise.all([
      getBlogPosts(),
      getPostCategories(),
    ]);
    const categoryContext = buildCategoryTreeContext(categories);
    const category = categoryContext.flatCategories.find(
      (item) => item.slug === categorySlug,
    );

    if (!category) notFound();

    const result = filterBlogPostsByCategory(posts, category, categoryContext, {
      q: "",
      subSlugs: [],
      sort: "newest",
      page: 1,
      limit: 9,
    });

    const postsWithContent = includePostContent
      ? await Promise.all(
          result.filteredPosts.map(async (post) => {
            const detailedPost = await getOptionalBlogPostBySlug(post.slug);
            return detailedPost ? { ...post, ...detailedPost } : post;
          }),
        )
      : result.filteredPosts;

    return {
      category,
      posts: postsWithContent,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load category blog page.", error);
    }

    notFound();
  }
}

function getCategorySlug(params: CategoryBlogPageProps["params"]) {
  const [categorySlug, ...restSlugs] = params.slug ?? [];

  if (!categorySlug || restSlugs.length > 0) notFound();

  return categorySlug;
}

export async function generateMetadata({
  params,
}: CategoryBlogPageProps): Promise<Metadata> {
  const categorySlug = getCategorySlug(params);
  const { category } = await loadCategoryPageData(categorySlug);
  const title =
    category.slug === "du-an" ? "Dự án đã triển khai" : category.name;
  const description =
    category.description ??
    `Tổng hợp các bài viết mới nhất thuộc chuyên mục ${category.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/chuyen-muc/${category.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function CategoryBlogPage({
  params,
}: CategoryBlogPageProps) {
  const categorySlug = getCategorySlug(params);
  const gridOnly = categorySlug === "tin-tuc" || categorySlug === "du-an";
  const { category, posts } = await loadCategoryPageData(
    categorySlug,
    !gridOnly,
  );

  return (
    <>
      <BlogsH1 Content={category.name} />
      <div className="min-h-screen">
        <BlogViewSwitcher
          posts={posts}
          categorySlug={category.slug}
          gridOnly={gridOnly}
        />
      </div>
    </>
  );
}
