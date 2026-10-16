import Hero from "@/components/home/Hero";
import CustomerReviewSection from "@/components/home/CustomerReviewSection";
import HomeBookingSteps from "@/components/home/HomeBookingSteps";
import HomeIntro from "@/components/home/HomeIntro";
import HomeNews from "@/components/home/HomeNews";
import HomeProducts from "@/components/home/HomeProducts";
import {
  getAllCatalogItems,
  getCatalogCategories,
} from "@/features/catalog/services/catalog.service";
import {
  getBanners,
  getBlogPosts,
  getOptionalBlogPostBySlug,
  getTestimonials,
} from "@/features/content/services/content.service";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

const INTRODUCTION_POST_SLUG = "gioi-thieu-ve-co-khi-phuong-tung";

function getPostTimestamp(value?: string | null) {
  const timestamp = Date.parse(value ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export default async function Home() {
  const [
    settings,
    banners,
    products,
    categories,
    posts,
    testimonials,
    introductionPost,
  ] = await Promise.all([
    getPublicSiteSettings(),
    getBanners(),
    getAllCatalogItems({ sort: "sort_order" }),
    getCatalogCategories(),
    getBlogPosts(),
    getTestimonials(),
    getOptionalBlogPostBySlug(INTRODUCTION_POST_SLUG),
  ]);
  const introduction =
    introductionPost ??
    posts.find((post) => post.slug === INTRODUCTION_POST_SLUG);
  const news = posts
    .filter(
      (post) =>
        post.id !== introduction?.id && post.category?.slug === "tin-tuc",
    )
    .sort(
      (a, b) =>
        getPostTimestamp(b.publishedAt ?? b.createdAt) -
        getPostTimestamp(a.publishedAt ?? a.createdAt),
    )
    .slice(0, 3);

  return (
    <div className="mb-3">
      <Hero Data={banners} settings={settings} />
      <div className="">
        <HomeIntro post={introduction} settings={settings} />
        <HomeProducts Data={products} categories={categories} />
      </div>
      <HomeBookingSteps />
      <CustomerReviewSection settings={settings} testimonials={testimonials} />
      <HomeNews Data={news} />
    </div>
  );
}
