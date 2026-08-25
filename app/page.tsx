import CustomerReviewSection from "@/components/home/CustomerReviewSection";
import Hero from "@/components/home/Hero";
import HomeBookingSteps from "@/components/home/HomeBookingSteps";
import HomeCategories from "@/components/home/HomeCategories";
import HomeFAQSection from "@/components/home/HomeFAQSection";
import HomeNews from "@/components/home/HomeNews";
import HomeProducts from "@/components/home/HomeProducts";
import HomeRouteCategories from "@/components/home/HomeRouteCategories";
import { getCatalogCategories, getCatalogItems } from "@/features/catalog/services/catalog.service";
import { getBanners, getBlogPosts, getFaqs, getTestimonials } from "@/features/content/services/content.service";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

export default async function Home() {
  const [settings, banners, categories, featuredCatalog, posts, faqs, testimonials] = await Promise.all([
    getPublicSiteSettings(),
    getBanners(),
    getCatalogCategories(),
    getCatalogItems({ featured: true, limit: 6, sort: "sort_order" }),
    getBlogPosts(),
    getFaqs(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero Data={banners} settings={settings} />
      <HomeCategories categories={categories} />
      <HomeProducts title="Tuyến xe và vé xe nổi bật" Data={featuredCatalog.items} settings={settings} />
      <HomeBookingSteps />
      <HomeRouteCategories categories={categories} settings={settings} />
      <CustomerReviewSection settings={settings} testimonials={testimonials} />
      <HomeFAQSection settings={settings} faqs={faqs} />
      <HomeNews Data={posts} />
    </>
  );
}
