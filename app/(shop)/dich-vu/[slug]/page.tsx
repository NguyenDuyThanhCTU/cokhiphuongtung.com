import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCatalogItemBySlug,
  getCatalogItems,
  getCatalogVariants,
} from "@/features/catalog/services/catalog.service";
import type { CatalogItem } from "@/features/catalog/types";
import { getServicePrimaryImage } from "@/components/catalog/Detail/catalog-service-detail";
import { ServiceBreadcrumb } from "@/components/catalog/Detail/ServiceBreadcrumb";
import { ServiceHero } from "@/components/catalog/Detail/ServiceHero";
import { ServiceQuickInfo } from "@/components/catalog/Detail/ServiceQuickInfo";
import { ServiceContent } from "@/components/catalog/Detail/ServiceContent";
import { ServiceVariantList } from "@/components/catalog/Detail/ServiceVariantList";
import { ServiceProcess } from "@/components/catalog/Detail/ServiceProcess";
import { ServiceBenefits } from "@/components/catalog/Detail/ServiceBenefits";
import { ServiceRelatedServices } from "@/components/catalog/Detail/ServiceRelatedServices";
import { ServiceFinalCta } from "@/components/catalog/Detail/ServiceFinalCta";
import { getPublicSiteSettings } from "@/features/site/services/site.service";
import { getPrimaryHotline } from "@/features/site/utils/contact";

type ServiceDetailPageProps = {
  params: {
    slug: string;
  };
};

async function loadService(slug: string) {
  try {
    return await getCatalogItemBySlug(slug);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load service detail.", error);
    }

    notFound();
  }
}

async function loadServiceVariants(service: CatalogItem) {
  if (service.variants && service.variants.length > 0) {
    return service.variants;
  }

  try {
    return await getCatalogVariants(service.slug);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load service variants.", error);
    }

    return [];
  }
}

async function loadRelatedServices(service: CatalogItem) {
  const categorySlug = service.category?.slug ?? service.categories?.[0]?.slug;

  if (!categorySlug) return [];

  try {
    const result = await getCatalogItems({
      category: categorySlug,
      limit: 4,
      sort: "sort_order",
    });

    return result.items
      .filter((item) => item.slug !== service.slug)
      .slice(0, 3);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load related services.", error);
    }

    return [];
  }
}

async function loadServiceHotline() {
  try {
    return getPrimaryHotline(await getPublicSiteSettings());
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load service hotline.", error);
    }

    return "";
  }
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const service = await loadService(params.slug);
  const image = getServicePrimaryImage(service);
  const description =
    service.seoDescription ??
    service.shortDescription ??
    "Thông tin tuyến xe, vé xe Hà Giang và hướng dẫn gửi yêu cầu đặt vé.";

  return {
    title: service.seoTitle ?? service.title,
    description,
    alternates: {
      canonical: `/dich-vu/${service.slug}`,
    },
    openGraph: {
      title: service.seoTitle ?? service.title,
      description,
      images: image ? [image] : undefined,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const service = await loadService(params.slug);
  const [variants, relatedServices, hotline] = await Promise.all([
    loadServiceVariants(service),
    loadRelatedServices(service),
    loadServiceHotline(),
  ]);

  const serviceWithVariants: CatalogItem = {
    ...service,
    variants,
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 d:px-0">
        <ServiceBreadcrumb service={serviceWithVariants} />
        <ServiceHero service={serviceWithVariants} hotline={hotline} />
        <ServiceQuickInfo service={serviceWithVariants} />
        <ServiceContent service={serviceWithVariants} />
        <ServiceVariantList service={serviceWithVariants} />
        <ServiceProcess />
        <ServiceBenefits />
        <ServiceRelatedServices services={relatedServices} hotline={hotline} />
        <ServiceFinalCta service={serviceWithVariants} hotline={hotline} />
      </div>
    </>
  );
}
