import type { CatalogItem } from "@/features/catalog/types";

export type ServiceBadgeTone = "primary" | "success" | "warning" | "neutral";

export type ServiceBadge = {
  label: string;
  tone: ServiceBadgeTone;
};

export type ServicePriceInfo = {
  label: string;
  value: string;
  originalValue?: string | null;
  note: string;
  hasPrice: boolean;
  hasDiscount: boolean;
};

type ServiceVariant = NonNullable<CatalogItem["variants"]>[number];

type RecordLike = Record<string, unknown>;

function asRecord(value: unknown): RecordLike {
  return value && typeof value === "object" ? (value as RecordLike) : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function uniqueStrings(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }

  return result;
}

export function formatServiceCurrency(value?: number | null) {
  if (!value || value <= 0) return null;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getServicePrimaryImage(service: CatalogItem) {
  return (
    service.ogImage ??
    service.thumbnailUrl ??
    service.galleryUrls?.find(Boolean) ??
    null
  );
}

export function getServiceGallery(service: CatalogItem) {
  return uniqueStrings([
    service.thumbnailUrl,
    ...(service.galleryUrls ?? []),
    service.ogImage,
  ]).slice(0, 8);
}

export function getServiceDescription(service: CatalogItem) {
  return service.shortDescription ?? service.seoDescription ?? null;
}

export function getServiceCategories(service: CatalogItem) {
  const categories = [service.category, ...(service.categories ?? [])].filter(
    Boolean,
  ) as NonNullable<CatalogItem["category"]>[];

  const seen = new Set<string>();

  return categories.filter((category) => {
    const key = category.id ?? category.slug;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getServiceTags(service: CatalogItem) {
  return (service.tags ?? []).filter((tag) => tag.isActive !== false);
}

export function getServiceBadges(service: CatalogItem): ServiceBadge[] {
  const badges: ServiceBadge[] = [];

  if (service.isFeatured) {
    badges.push({ label: "Tuyến nổi bật", tone: "primary" });
  }

  if (service.isBestSeller) {
    badges.push({ label: "Vé được quan tâm", tone: "success" });
  }

  if (service.isDiscounted || service.discountPercent) {
    badges.push({ label: "Có ưu đãi", tone: "warning" });
  }

  if (service.sku) {
    badges.push({ label: `Mã vé: ${service.sku}`, tone: "neutral" });
  }

  return badges;
}

export function getServicePriceInfo(service: CatalogItem): ServicePriceInfo {
  const finalPrice = service.finalPrice ?? null;
  const price = service.price ?? null;
  const discountPercent = service.discountPercent ?? null;

  const formattedFinalPrice = formatServiceCurrency(finalPrice);
  const formattedPrice = formatServiceCurrency(price);

  if (formattedFinalPrice) {
    return {
      label: discountPercent
        ? `Ưu đãi ${discountPercent}%`
        : "Giá vé tham khảo",
      value: formattedFinalPrice,
      originalValue:
        formattedPrice && formattedPrice !== formattedFinalPrice
          ? formattedPrice
          : null,
      note: "Giá áp dụng được xác nhận theo kích thước, vật liệu và điều kiện thi công thực tế.",
      hasPrice: true,
      hasDiscount: Boolean(discountPercent || service.isDiscounted),
    };
  }

  if (formattedPrice) {
    return {
      label: "Giá vé tham khảo",
      value: formattedPrice,
      note: "Giá vé có thể được cập nhật theo từng thời điểm và sẽ được nhân viên xác nhận trực tiếp.",
      hasPrice: true,
      hasDiscount: false,
    };
  }

  return {
    label: "Thông tin giá vé",
    value: "Liên hệ xác nhận giá",
    note: "Vui lòng gửi hạng mục, kích thước và địa điểm thi công để được tư vấn nhanh.",
    hasPrice: false,
    hasDiscount: false,
  };
}

export function getVariantTitle(variant: ServiceVariant, index: number) {
  const record = asRecord(variant);

  return (
    asString(record.title) ??
    asString(record.name) ??
    asString(record.sku) ??
    `Lựa chọn vé ${index + 1}`
  );
}

export function getVariantDescription(variant: ServiceVariant) {
  const record = asRecord(variant);

  return (
    asString(record.shortDescription) ??
    asString(record.description) ??
    asString(record.note) ??
    null
  );
}

export function getVariantPrice(variant: ServiceVariant) {
  const record = asRecord(variant);
  const finalPrice = asNumber(record.finalPrice);
  const price = asNumber(record.price);

  return formatServiceCurrency(finalPrice ?? price);
}

export function hasUsefulHtmlContent(value?: string | null) {
  if (!value) return false;

  const text = value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length > 0;
}
