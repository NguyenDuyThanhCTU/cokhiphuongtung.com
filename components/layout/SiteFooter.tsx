import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Ticket,
} from "lucide-react";

import {
  findCatalogCategoryBySlug,
  getDirectVisibleCatalogChildren,
  isCatalogCategoryVisible,
} from "@/components/catalog/CatalogSlug/catalog-category-tree";
import { SocialLinks } from "@/components/layout/SocialLinks";
import type { CatalogCategory } from "@/features/catalog/types";
import { SITE_FALLBACK } from "@/features/site/constants";
import type { PublicSiteSettings } from "@/features/site/types";
import {
  getHotlines,
  getPhoneHref,
  getZaloHref,
} from "@/features/site/utils/contact";

type SiteFooterProps = {
  settings: PublicSiteSettings;
  catalogCategories: CatalogCategory[];
};

type FooterCategoryColumnProps = {
  categories: CatalogCategory[];
  parentSlug: string;
  title: string;
};

const MAX_CATEGORY_LINKS = 8;

function FooterCategoryColumn({
  categories,
  parentSlug,
  title,
}: FooterCategoryColumnProps) {
  const parentCategory = findCatalogCategoryBySlug(categories, parentSlug);
  const visibleChildren = isCatalogCategoryVisible(parentCategory)
    ? getDirectVisibleCatalogChildren(categories, parentCategory)
    : [];
  const visibleLinks = visibleChildren.slice(0, MAX_CATEGORY_LINKS);
  const parentHref = `/danh-muc/${parentCategory?.slug ?? parentSlug}`;

  return (
    <section className="min-w-0">
      <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-300">
        <Link href={parentHref} className="transition hover:text-brand-100">
          {title}
        </Link>
      </h2>
      <nav
        className="mt-5 grid gap-3 text-sm text-slate-300"
        aria-label={title}
      >
        {visibleLinks.map((category) => (
          <Link
            key={category.id || category.slug}
            href={`/danh-muc/${category.slug}`}
            className="group flex min-w-0 items-start gap-2 leading-5 transition hover:text-brand-300"
          >
            <ChevronRight
              size={15}
              className="mt-0.5 shrink-0 text-brand-400 transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <span className="line-clamp-2">{category.name}</span>
          </Link>
        ))}

        {visibleLinks.length === 0 ? (
          <Link
            href={parentHref}
            className="group flex items-center gap-2 font-bold text-white transition hover:text-brand-300"
          >
            Xem tất cả
            <ChevronRight
              size={15}
              className="transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : visibleChildren.length > MAX_CATEGORY_LINKS ? (
          <Link
            href={parentHref}
            className="inline-flex items-center gap-1 font-extrabold text-brand-300 transition hover:text-brand-100"
          >
            Xem tất cả
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        ) : null}
      </nav>
    </section>
  );
}

export function SiteFooter({ settings, catalogCategories }: SiteFooterProps) {
  const hotlines = getHotlines(settings);
  const siteName =
    settings.siteName && settings.siteName !== "Website"
      ? settings.siteName
      : SITE_FALLBACK.name;

  return (
    <footer className="overflow-hidden bg-slate-950 text-white">
      <div className="h-1.5 bg-brand-400" />
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 d:grid-cols-[1.15fr_0.85fr_0.85fr_1fr] d:gap-8 d:px-0 d:py-16">
        <section>
          <div className="flex items-center gap-3">
            {settings.footerLogoUrl || settings.logoUrl ? (
              <Image
                src={settings.footerLogoUrl || settings.logoUrl || ""}
                alt={siteName}
                width={180}
                height={80}
                className="h-16 w-auto max-w-[180px] rounded-xl bg-white p-2 object-contain"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-400 text-slate-950">
                <Ticket size={28} aria-hidden="true" />
              </span>
            )}
          </div>
          <h2 className="mt-5 text-xl font-extrabold uppercase tracking-tight">
            {siteName}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
            {settings.description || SITE_FALLBACK.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="#dat-ve"
              className="rounded-xl bg-brand-400 px-4 py-2.5 text-sm font-extrabold text-slate-950 transition hover:bg-brand-300"
            >
              Gửi yêu cầu đặt vé
            </Link>
            <a
              href={getZaloHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold transition hover:border-brand-300 hover:text-brand-300"
            >
              Chat Zalo
            </a>
          </div>
        </section>

        <FooterCategoryColumn
          categories={catalogCategories}
          parentSlug="cac-tuyen-xe"
          title="Các tuyến xe"
        />

        <FooterCategoryColumn
          categories={catalogCategories}
          parentSlug="ve-xe-ha-giang"
          title="Vé xe các tuyến"
        />

        <section>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-300">
            Thông tin liên hệ
          </h2>
          <div className="mt-5 grid gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="mt-0.5 shrink-0 text-brand-300"
                aria-hidden="true"
              />
              <div className="grid gap-1">
                {hotlines.map((hotline) => (
                  <a
                    key={hotline}
                    href={getPhoneHref(hotline)}
                    className="font-bold text-white transition hover:text-brand-300"
                  >
                    {hotline}
                  </a>
                ))}
              </div>
            </div>
            {settings.email || settings.contact?.email ? (
              <a
                href={`mailto:${settings.contact?.email || settings.email}`}
                className="flex items-start gap-3 transition hover:text-brand-300"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-300"
                  aria-hidden="true"
                />
                <span className="break-all">
                  {settings.contact?.email || settings.email}
                </span>
              </a>
            ) : null}
            {settings.address ? (
              <p className="flex items-start gap-3 leading-6">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-300"
                  aria-hidden="true"
                />
                <span>{settings.address}</span>
              </p>
            ) : null}
            <p className="flex items-start gap-3 leading-6">
              <Clock3
                size={18}
                className="mt-0.5 shrink-0 text-brand-300"
                aria-hidden="true"
              />
              <span>
                {settings.workingHours?.weekday || "Hỗ trợ đặt vé 24/7"}
              </span>
            </p>
            <SocialLinks
              settings={settings}
              appearance="dark"
              className="mt-3"
            />
          </div>
        </section>
      </div>

      {settings.mapIframe ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-10 sm:px-6 d:px-0">
          <div
            className="footer-map overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2"
            dangerouslySetInnerHTML={{ __html: settings.mapIframe }}
          />
        </div>
      ) : null}
      <div className="border-t border-white/10 bg-[#00283b]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-center text-xs text-white/60 sm:px-8 md:flex-row md:text-left lg:px-10">
          <div>
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              <strong className="font-semibold text-white/80">
                xekhachhagiang24h.com
              </strong>{" "}
              .All Rights Reserved
            </p>

            <p className="mt-1">
              Website được thiết kế bởi{" "}
              <Link
                href="https://www.facebook.com/DuyThanhCTU/"
                target="_blank"
              >
                Duy Thanh
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href="/chinh-sach-bao-mat"
              className="transition-colors hover:text-[#e8c078]"
            >
              Chính sách bảo mật
            </Link>

            <Link
              href="/dieu-khoan-su-dung"
              className="transition-colors hover:text-[#e8c078]"
            >
              Điều khoản sử dụng
            </Link>

            <Link
              href="/chinh-sach-dat-xe"
              className="transition-colors hover:text-[#e8c078]"
            >
              Chính sách đặt xe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
