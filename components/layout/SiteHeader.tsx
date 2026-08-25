import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Phone, Ticket } from "lucide-react";

import type { CatalogCategory } from "@/features/catalog/types";
import { SITE_FALLBACK } from "@/features/site/constants";
import type { PublicSiteSettings } from "@/features/site/types";
import {
  getHotlines,
  getPhoneHref,
} from "@/features/site/utils/contact";

type SiteHeaderProps = {
  settings: PublicSiteSettings;
  catalogCategories: CatalogCategory[];
};

function getVisibleCategories(categories: CatalogCategory[]) {
  return categories.filter((category) => category.isActive !== false);
}

function Brand({ settings }: { settings: PublicSiteSettings }) {
  const siteName =
    settings.siteName && settings.siteName !== "Website"
      ? settings.siteName
      : SITE_FALLBACK.name;

  return (
    <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={siteName}>
      {settings.logoUrl ? (
        <Image
          src={settings.logoUrl}
          alt={siteName}
          width={180}
          height={72}
          priority
          className="h-12 w-auto max-w-[150px] object-contain d:h-14 d:max-w-[180px]"
        />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-400 text-brand-900 shadow-sm">
          <Ticket size={24} aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0">
        <strong className="block truncate text-[15px] font-extrabold uppercase tracking-tight text-slate-950 d:text-lg">
          {siteName}
        </strong>
        <span className="hidden text-xs font-medium text-slate-500 sm:block">
          Tuyến xe & vé xe Hà Giang
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader({ settings, catalogCategories }: SiteHeaderProps) {
  const hotlines = getHotlines(settings);
  const categories = getVisibleCategories(catalogCategories);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 shadow-[0_6px_24px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="hidden bg-slate-950 text-white d:block">
        <div className="mx-auto flex w-default items-center justify-between gap-6 py-2 text-xs">
          <p className="truncate text-white/70">
            {settings.slogan || SITE_FALLBACK.slogan}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <span className="font-semibold text-brand-300">Hỗ trợ đặt vé 24/7</span>
            {hotlines.map((hotline) => (
              <a
                key={hotline}
                href={getPhoneHref(hotline)}
                className="inline-flex items-center gap-1.5 font-bold transition hover:text-brand-300"
                data-track="click_hotline_header"
              >
                <Phone size={13} aria-hidden="true" />
                {hotline}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[72px] w-full max-w-[1200px] items-center justify-between gap-4 px-3 sm:px-5 d:min-h-[80px] d:px-0">
        <Brand settings={settings} />

        <nav className="hidden items-center gap-1 d:flex" aria-label="Điều hướng chính">
          <Link href="/" className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            Trang chủ
          </Link>

          <div className="group relative">
            <Link
              href="/danh-muc"
              className="flex items-center gap-1 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              Tuyến xe & vé xe
              <ChevronDown size={15} aria-hidden="true" />
            </Link>
            {categories.length > 0 ? (
              <div className="invisible absolute left-0 top-full w-[320px] translate-y-2 rounded-2xl border border-brand-100 bg-white p-2 opacity-0 shadow-[0_18px_60px_rgba(15,23,42,0.14)] transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {categories.slice(0, 10).map((category) => (
                  <Link
                    key={category.id}
                    href={`/danh-muc/${category.slug}`}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link href="/danh-muc" className="mt-1 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-500 hover:text-slate-950">
                  Xem tất cả tuyến xe
                </Link>
              </div>
            ) : null}
          </div>

          <Link href="/chuyen-muc" className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            Cẩm nang
          </Link>
          <Link href="/lien-he" className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            Liên hệ
          </Link>
          <Link
            href="#dat-ve"
            className="ml-2 inline-flex items-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-brand-300"
          >
            <Ticket size={17} aria-hidden="true" />
            Đặt vé
          </Link>
        </nav>

        <details className="group relative d:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-slate-900 [&::-webkit-details-marker]:hidden">
            <Menu size={23} aria-label="Mở menu" />
          </summary>
          <div className="absolute right-0 top-14 max-h-[calc(100vh-90px)] w-[min(88vw,340px)] overflow-y-auto rounded-2xl border border-brand-100 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <nav className="grid gap-1" aria-label="Điều hướng mobile">
              <Link href="/" className="rounded-xl px-4 py-3 font-bold text-slate-800 hover:bg-brand-50">Trang chủ</Link>
              <Link href="/danh-muc" className="rounded-xl bg-brand-50 px-4 py-3 font-bold text-brand-800">Tuyến xe & vé xe</Link>
              {categories.slice(0, 10).map((category) => (
                <Link key={category.id} href={`/danh-muc/${category.slug}`} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-700">
                  {category.name}
                </Link>
              ))}
              <Link href="/chuyen-muc" className="rounded-xl px-4 py-3 font-bold text-slate-800 hover:bg-brand-50">Cẩm nang</Link>
              <Link href="/lien-he" className="rounded-xl px-4 py-3 font-bold text-slate-800 hover:bg-brand-50">Liên hệ</Link>
              <Link href="#dat-ve" className="mt-2 rounded-xl bg-brand-400 px-4 py-3 text-center font-extrabold text-slate-950">Gửi yêu cầu đặt vé</Link>
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              {hotlines.map((hotline) => (
                <a key={hotline} href={getPhoneHref(hotline)} className="rounded-xl bg-slate-950 px-2 py-3 text-center text-xs font-bold text-white">
                  {hotline}
                </a>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
