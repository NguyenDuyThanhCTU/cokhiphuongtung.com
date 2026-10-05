import Hero from "@/components/home/Hero";
import CustomerReviewSection from "@/components/home/CustomerReviewSection";
import HomeBookingSteps from "@/components/home/HomeBookingSteps";
import HomeIntro from "@/components/home/HomeIntro";
import HomeNews from "@/components/home/HomeNews";
import HomeProducts from "@/components/home/HomeProducts";
import { getHomeCatalog } from "@/features/catalog/services/home-catalog.service";
import {
  getBanners,
  getBlogPosts,
  getOptionalBlogPostBySlug,
  getTestimonials,
} from "@/features/content/services/content.service";
import { isPostInGroup } from "@/features/content/utils/post-groups";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

// Render fresh HTML for every visit; the catalog service shares API responses
// for five seconds and coalesces concurrent refreshes on each server process.
export const revalidate = 0;
export const fetchCache = "default-cache";
const INTRODUCTION_POST_SLUG = "gioi-thieu-ve-co-khi-phuong-tung";

export default async function Home() {
  const [settings, banners, catalog, posts, testimonials, introductionPost] = await Promise.all([
    getPublicSiteSettings(),
    getBanners(),
    getHomeCatalog(),
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
        <HomeProducts Data={catalog.products} categories={catalog.categories} />
      </div>
      <HomeBookingSteps />
      <CustomerReviewSection settings={settings} testimonials={testimonials} />
      <HomeNews Data={news} />
    </div>
  );
}
