import type { CatalogItem } from "@/features/catalog/types";
import Image from "next/image";
import { getServiceGallery } from "./catalog-service-detail";

type ServiceGalleryProps = {
  service: CatalogItem;
};

export function ServiceGallery({ service }: ServiceGalleryProps) {
  const gallery = getServiceGallery(service);
  const [primaryImage, ...secondaryImages] = gallery;

  if (!primaryImage) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[28px] bg-gradient-to-br from-brand-100 via-brand-50 to-zinc-100 p-8 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
            Tuyến xe & vé xe
          </p>
          <p className="mt-3 text-2xl font-bold text-zinc-950">
            {service.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <figure className="relative h-[320px] overflow-hidden rounded-[28px] bg-zinc-100 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:h-[420px] lg:h-[520px]">
        <Image
          src={primaryImage}
          alt={service.title}
          fill
          sizes="(max-width: 1023px) 100vw, 760px"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </figure>

      {secondaryImages.length ? (
        <div className="grid grid-cols-3 gap-3">
          {secondaryImages.slice(0, 3).map((image, index) => (
            <figure
              key={`${image}-${index}`}
              className="relative h-24 overflow-hidden rounded-2xl bg-zinc-100 sm:h-32"
            >
              <Image
                src={image}
                alt={`${service.title} ${index + 2}`}
                fill
                sizes="(max-width: 767px) 33vw, 240px"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}
