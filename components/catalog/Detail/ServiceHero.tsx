import type { CatalogItem } from "@/features/catalog/types";
import {
  getServiceBadges,
  getServiceCategories,
  getServiceDescription,
  getServiceTags,
} from "./catalog-service-detail";
import { ServiceBadges } from "./ServiceBadges";
import { ServiceGallery } from "./ServiceGallery";
import { ServicePriceBox } from "./ServicePriceBox";

type ServiceHeroProps = {
  service: CatalogItem;
  hotline?: string;
};

export function ServiceHero({ service, hotline }: ServiceHeroProps) {
  const badges = getServiceBadges(service);
  const description = getServiceDescription(service);
  const categories = getServiceCategories(service);
  const tags = getServiceTags(service);

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      <div className="min-w-0">
        <ServiceBadges badges={badges} />

        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
          {service.title}
        </h1>

        {description ? (
          <div
            dangerouslySetInnerHTML={{ __html: description ? description : "" }}
            className="ck-content mt-5 max-w-3xl text-lg leading-8 text-zinc-600"
          ></div>
        ) : null}

        {categories.length || tags.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.id ?? category.slug}
                className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800"
              >
                {category.name}
              </span>
            ))}
            {tags.map((tag) => (
              <span
                key={tag.id ?? tag.slug}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          <ServiceGallery service={service} />
        </div>
      </div>

      <div className="lg:sticky lg:top-28">
        <ServicePriceBox service={service} hotline={hotline} />
      </div>
    </section>
  );
}
