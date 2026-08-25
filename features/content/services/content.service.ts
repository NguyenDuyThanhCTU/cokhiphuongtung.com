import { notFound } from "next/navigation";
import { publicApiFetch } from "@/lib/api/public-api";
import { cacheTags } from "@/lib/cache/cache-tags";
import type { PaginatedResponse } from "@/lib/types/api";
import type {
  BannerItem,
  BlogPost,
  FaqItem,
  HomeContent,
  PostCategory,
  StaticPage,
  Testimonial,
} from "@/features/content/types";
import {
  bannerListSchema,
  blogPostListSchema,
  blogPostSchema,
  faqListSchema,
  homeContentSchema,
  postCategoryListSchema,
  staticPageSchema,
  testimonialListSchema,
} from "@/features/content/schemas/content.schema";
import { asArray, normalizeString, unwrapApiData } from "@/lib/utils/api-normalizers";

function extractResponseData(payload: unknown): unknown {
  return unwrapApiData(payload);
}

function extractListData(payload: unknown): unknown {
  return asArray(payload);
}

function normalizeFaqItem(value: unknown): unknown {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  const item = value as Record<string, unknown>;
  const category = item.category;
  const normalizedCategory =
    normalizeString(category) ??
    (typeof category === "object" && category !== null
      ? normalizeString((category as Record<string, unknown>).name) ??
        normalizeString((category as Record<string, unknown>).title)
      : undefined);

  return {
    ...item,
    category: normalizedCategory,
  };
}

function reportContentFallback(resource: string, error: unknown) {
  console.error(
    `Failed to load ${resource}; using an empty fallback.`,
    process.env.NODE_ENV === "development" ? error : undefined,
  );
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/home", {
      next: {
        tags: [
          cacheTags.home,
          cacheTags.settings,
          cacheTags.catalog,
          cacheTags.posts,
          cacheTags.faq,
          cacheTags.banners,
          cacheTags.testimonials,
        ],
      },
    });

    return homeContentSchema.parse(extractResponseData(payload));
  } catch (error) {
    reportContentFallback("home content", error);
    return {};
  }
}

export async function getBanners(): Promise<BannerItem[]> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/banners", {
      next: { tags: [cacheTags.banners, cacheTags.home] },
    });

    return bannerListSchema.parse(extractListData(payload));
  } catch (error) {
    reportContentFallback("banners", error);
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const payload = await publicApiFetch<PaginatedResponse<BlogPost> | unknown>("/api/public/posts", {
      next: { tags: [cacheTags.posts] },
    });

    return blogPostListSchema.parse(extractListData(payload));
  } catch (error) {
    reportContentFallback("blog posts", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const payload = await publicApiFetch<unknown>(`/api/public/posts/${encodeURIComponent(slug)}`, {
    next: { tags: [cacheTags.posts] },
  });

  const parsed = blogPostSchema.safeParse(extractResponseData(payload));
  if (!parsed.success) {
    notFound();
  }

  return parsed.data;
}

export async function getPostCategories(): Promise<PostCategory[]> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/post-categories", {
      next: { tags: [cacheTags.posts, cacheTags.postCategories] },
    });

    return postCategoryListSchema.parse(extractListData(payload));
  } catch (error) {
    reportContentFallback("post categories", error);
    return [];
  }
}

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/faqs", {
      next: { tags: [cacheTags.faq] },
    });

    return faqListSchema.parse(asArray(payload).map(normalizeFaqItem));
  } catch (error) {
    reportContentFallback("FAQs", error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/testimonials", {
      next: { tags: [cacheTags.testimonials] },
    });

    return testimonialListSchema.parse(extractListData(payload));
  } catch (error) {
    reportContentFallback("testimonials", error);
    return [];
  }
}

export async function getStaticPageBySlug(slug: string): Promise<StaticPage> {
  const payload = await publicApiFetch<unknown>(`/api/public/pages/${encodeURIComponent(slug)}`, {
    next: { tags: [cacheTags.pages] },
  });

  const parsed = staticPageSchema.safeParse(extractResponseData(payload));
  if (!parsed.success) {
    notFound();
  }

  return parsed.data;
}
