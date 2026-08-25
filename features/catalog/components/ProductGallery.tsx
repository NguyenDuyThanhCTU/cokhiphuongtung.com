import { ImageFallback } from "@/components/ui/ImageFallback";
import type { CatalogItem } from "@/features/catalog/types";
import { getProductPrimaryImage } from "@/features/catalog/utils/get-product-primary-image";

type ProductGalleryProps = {
  product: CatalogItem;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const primaryImage = getProductPrimaryImage(product);
  const gallery = product.galleryUrls?.filter((image) => image !== primaryImage) ?? [];

  return (
    <div className="space-y-3">
      <ImageFallback
        src={primaryImage}
        alt={product.title}
        width={720}
        height={520}
        className="h-80 w-full rounded-lg object-cover"
        priority
      />
      {gallery.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {gallery.slice(0, 4).map((image) => (
            <ImageFallback
              key={image}
              src={image}
              alt={product.title}
              width={160}
              height={120}
              className="h-20 w-full rounded-md object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
