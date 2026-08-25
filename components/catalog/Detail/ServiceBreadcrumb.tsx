import Link from "next/link";
import type { CatalogItem } from "@/features/catalog/types";
import { getServiceCategories } from "./catalog-service-detail";

type ServiceBreadcrumbProps = {
  service: CatalogItem;
};

export function ServiceBreadcrumb({ service }: ServiceBreadcrumbProps) {
  const primaryCategory = getServiceCategories(service)[0] ?? null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition hover:text-brand-700">
            Trang chủ
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/danh-muc" className="transition hover:text-brand-700">
            Tuyến xe
          </Link>
        </li>
        {primaryCategory ? (
          <>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/danh-muc/${primaryCategory.slug}`}
                className="transition hover:text-brand-700"
              >
                {primaryCategory.name}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden="true">/</li>
        <li className="font-medium text-zinc-800" aria-current="page">
          {service.title}
        </li>
      </ol>
    </nav>
  );
}
