import Hero from "@/components/home/Hero";
import CustomerReviewSection from "@/components/home/CustomerReviewSection";
import HomeBookingSteps from "@/components/home/HomeBookingSteps";
import HomeIntro from "@/components/home/HomeIntro";
import HomeNews from "@/components/home/HomeNews";
import HomeProducts from "@/components/home/HomeProducts";
import { getCatalogCategories, getCatalogItems } from "@/features/catalog/services/catalog.service";
import type { CatalogItem } from "@/features/catalog/types";
import {
  getBanners,
  getBlogPosts,
  getOptionalBlogPostBySlug,
  getTestimonials,
} from "@/features/content/services/content.service";
import { isPostInGroup } from "@/features/content/utils/post-groups";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

const CATALOG_PAGE_SIZE = 60;
const INTRODUCTION_POST_SLUG = "gioi-thieu-ve-co-khi-phuong-tung";

async function getAllHomeCatalogItems(): Promise<CatalogItem[]> {
  const firstPage = await getCatalogItems({ page: 1, limit: CATALOG_PAGE_SIZE, sort: "sort_order" });
  const totalPages = Math.max(firstPage.meta?.totalPages ?? 1, 1);
  const remainingPages = totalPages > 1
    ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => getCatalogItems({ page: index + 2, limit: CATALOG_PAGE_SIZE, sort: "sort_order" })))
    : [];
  const uniqueItems = new Map<string, CatalogItem>();
  [firstPage, ...remainingPages].forEach((page) => page.items.forEach((item) => uniqueItems.set(item.id || item.slug, item)));
  return Array.from(uniqueItems.values());
}

export default async function Home() {
  const [settings, banners, categories, products, posts, testimonials, introductionPost] = await Promise.all([
    getPublicSiteSettings(),
    getBanners(),
    getCatalogCategories(),
    getAllHomeCatalogItems(),
    getBlogPosts(),
    getTestimonials(),
    getOptionalBlogPostBySlug(INTRODUCTION_POST_SLUG),
  ]);
  const introduction =
    introductionPost ??
    posts.find((post) => post.slug === INTRODUCTION_POST_SLUG);
  const news = posts.filter((post) => post.id !== introduction?.id && !isPostInGroup(post, "du-an") && !isPostInGroup(post, "video"));

  return (
    <div className="mb-3">
      <Hero Data={banners} settings={settings} />
      <div className="mx-auto mt-5 flex flex-col gap-4 p:w-auto d:w-[1200px]">
        <HomeIntro post={introduction} settings={settings} />
        <HomeProducts Data={products} categories={categories} />
      </div>
      <HomeBookingSteps />
      <CustomerReviewSection settings={settings} testimonials={testimonials} />
      <HomeNews Data={news} />
    </div>
  );
}
