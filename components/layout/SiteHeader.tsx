"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { IoIosMenu, IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

import type { CatalogCategory } from "@/features/catalog/types";
import {
  buildCatalogCategoryMenuTree,
  type CatalogCategoryMenuNode,
} from "@/features/catalog/utils/category-menu-tree";
import { SITE_FALLBACK } from "@/features/site/constants";
import type { PublicSiteSettings } from "@/features/site/types";
import { getPrimaryHotline, getPhoneHref } from "@/features/site/utils/contact";

type SiteHeaderProps = {
  settings: PublicSiteSettings;
  catalogCategories: CatalogCategory[];
};

const navigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/danh-muc", products: true },
  { label: "Báo giá", href: "/bao-gia" },
  { label: "Dự Án", href: "/du-an" },
  { label: "Liên hệ", href: "/lien-he" },
  { label: "Tin tức", href: "/chuyen-muc" },
];

function DesktopCategoryBranch({
  category,
}: {
  category: CatalogCategoryMenuNode;
}) {
  const hasChildren = category.children.length > 0;

  return (
    <div className="catalog-menu-node relative border-b border-stone-200 last:border-b-0">
      <Link
        href={`/danh-muc/${category.slug}`}
        className="flex min-w-[240px] items-center justify-between gap-3 px-4 py-2.5 text-sm font-light text-black duration-300 hover:bg-mainColorHover hover:text-white focus:bg-mainColorHover focus:text-white"
        aria-haspopup={hasChildren ? "menu" : undefined}
      >
        <span>{category.name}</span>
        {hasChildren ? <FaAngleDown className="shrink-0 -rotate-90" /> : null}
      </Link>

      {hasChildren ? (
        <div className="catalog-menu-children absolute left-full top-0 z-50 min-w-[240px] border-l border-stone-200 bg-gray-100 shadow-lg">
          {category.children.map((child) => (
            <DesktopCategoryBranch key={child.id} category={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileCategoryBranch({
  category,
  depth = 0,
  onNavigate,
}: {
  category: CatalogCategoryMenuNode;
  depth?: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = category.children.length > 0;

  return (
    <div>
      <div className="flex items-stretch border-b border-stone-200">
        <Link
          href={`/danh-muc/${category.slug}`}
          onClick={onNavigate}
          className="flex min-h-10 flex-1 items-center py-2 text-sm hover:text-mainColorHover"
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          {category.name}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex w-10 shrink-0 items-center justify-center text-mainColorHover"
            aria-label={`${open ? "Thu gọn" : "Mở rộng"} danh mục ${category.name}`}
            aria-expanded={open}
          >
            <FaAngleDown className={`duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <div className="bg-stone-50">
          {category.children.map((child) => (
            <MobileCategoryBranch
              key={child.id}
              category={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader({ settings, catalogCategories }: SiteHeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const roots = buildCatalogCategoryMenuTree(catalogCategories);
  const hotline = getPrimaryHotline(settings);
  const siteName = settings.siteName && settings.siteName !== "Website" ? settings.siteName : SITE_FALLBACK.name;

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const keyword = search.trim();
    router.push(keyword ? `/danh-muc?q=${encodeURIComponent(keyword)}` : "/danh-muc");
    setMobileSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full font-LexendDeca">
      <div className="hidden bg-black d:block">
        <div className="mx-auto grid h-[100px] w-[1200px] grid-cols-4 items-center justify-between">
          <Link href="/" className="flex h-[100px] items-center">
            {settings.logoUrl ? (
              <Image src={settings.logoUrl} alt={siteName} width={100} height={100} priority className="h-[94px] w-[100px] object-contain" />
            ) : (
              <span className="text-lg font-semibold uppercase text-mainColor">{siteName}</span>
            )}
          </Link>

          <Link href="/" className="col-span-2 h-[100px] w-full">
            <Image src="https://pub-84f5bb6490a34f289a7c796e2210e0fc.r2.dev/cokhiphuongtung/1787679691249-z5224833034659_98bc73f9a5398df649cd6675ebad5b95.webp" alt={settings.slogan || siteName} width={1000} height={500} className="h-full w-full object-contain py-2" />
          </Link>

         <div className="relative h-[80px] w-full max-w-sm mx-auto group cursor-pointer p-1">
  {/* Khung viền sắt đen nguyên khối */}
  <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-[3px] border-zinc-700 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:border-orange-800 group-hover:shadow-[0_0_20px_rgba(194,65,12,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>

  {/* Đường viền trang trí chìm bên trong (phong cách cổng sắt) */}
  <div className="absolute inset-2 border border-zinc-600/40 rounded-sm transition-colors duration-300 group-hover:border-orange-900/50"></div>

  {/* 4 Đinh tán (Rivets) ở 4 góc */}
  <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.2)] group-hover:bg-orange-500 transition-colors"></div>
  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.2)] group-hover:bg-orange-500 transition-colors"></div>
  <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.2)] group-hover:bg-orange-500 transition-colors"></div>
  <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.2)] group-hover:bg-orange-500 transition-colors"></div>

  {/* Nội dung Hotline */}
  <a
    href={getPhoneHref(hotline)}
    className="absolute inset-0 z-10 flex items-center justify-center gap-3 text-[18px] md:text-[20px] font-bold text-amber-500 uppercase tracking-wider transition-all duration-300 group-hover:text-orange-400 group-active:scale-95"
    data-track="click_hotline_header"
    style={{ textShadow: '2px 2px 4px rgba(0,0,0,1)' }} // Hiệu ứng chữ dập nổi
  >
    {/* Icon điện thoại cổ điển */}
    <svg className="w-6 h-6 text-amber-600 transition-transform duration-300 group-hover:-rotate-12 group-hover:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>
    <span className="font-serif">Hotline: {hotline}</span>
  </a>
</div>
        </div>

        <div className="bg-mainColorHover">
          <div className="mx-auto flex w-[1200px] justify-between">
            <nav className="flex items-center" aria-label="Điều hướng chính">
              {navigation.map((item, index) => (
                <div key={item.href} className="group relative">
                  <Link href={item.href} className={`${index === navigation.length - 1 ? "border-x" : "border-l"} flex items-center gap-2 border-white/40 px-5 py-3 text-[14px] font-bold uppercase text-white duration-300 hover:bg-mainColor`}>
                    <span>{item.label}</span>
                    {item.products ? <FaAngleDown className="duration-300 group-hover:-rotate-90" /> : null}
                  </Link>
                  {item.products && roots.length ? (
                    <div className="invisible absolute left-0 top-full min-w-[230px] translate-y-1 border-t-2 border-gray-500 bg-white opacity-0 shadow-md transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {roots.map((category) => (
                        <DesktopCategoryBranch key={category.id} category={category} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <form onSubmit={submitSearch} className="relative ml-2 flex items-center bg-mainColorHover">
              <div className="flex bg-white px-3 py-2">
                <input value={search} onChange={(event) => setSearch(event.target.value)} className="outline-none" placeholder="Tìm kiếm ..." aria-label="Tìm kiếm sản phẩm" />
                <button type="submit" className="border-l-2 border-mainColorHover pl-2 text-[20px]" aria-label="Tìm kiếm"><IoIosSearch /></button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="block d:hidden">
        <div className="h-[84px] bg-gradient-to-bl from-mainColor to-mainColorHover text-white shadow-xl">
          <div className="flex h-full w-full items-center justify-between px-4">
            <button type="button" className="p-2 text-[40px]" onClick={() => setMenuOpen(true)} aria-label="Mở menu"><IoIosMenu /></button>
            <Link href="/" className="h-[84px] w-[120px]">
              {settings.logoUrl ? <Image src={settings.logoUrl} width={200} height={200} alt={siteName} className="h-full w-full object-contain p-2" /> : <span className="flex h-full items-center text-center text-sm font-semibold uppercase">{siteName}</span>}
            </Link>
            <button type="button" className="p-2 text-[22px]" onClick={() => setMobileSearchOpen((value) => !value)} aria-label="Mở tìm kiếm"><FaSearch /></button>
          </div>
        </div>

        {mobileSearchOpen ? (
          <form onSubmit={submitSearch} className="relative bg-white p-3 shadow-xl">
            <div className="flex items-center rounded-full border border-mainColorHover bg-white">
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-l-full px-4 text-mainColorHover outline-none" placeholder="Tìm kiếm" aria-label="Tìm kiếm sản phẩm" />
              {search ? <button type="button" onClick={() => setSearch("")} className="mr-2 rounded-full bg-gray-500 p-1 text-[10px] text-gray-200" aria-label="Xóa tìm kiếm"><RxCross2 /></button> : null}
              <button type="submit" className="rounded-r-full bg-mainColorHover px-6 py-3 text-white" aria-label="Tìm kiếm"><FaSearch /></button>
            </div>
          </form>
        ) : null}

        {menuOpen ? (
          <div className="fixed inset-0 z-[60] bg-black/45" onClick={() => setMenuOpen(false)}>
            <aside className="h-full w-[300px] overflow-y-auto bg-white p-6 text-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-3">
                <Link href="/" onClick={() => setMenuOpen(false)} className="p-2">
                  {settings.logoUrl ? <Image src={settings.logoUrl} alt={siteName} width={170} height={100} className="h-24 w-auto object-contain" /> : <strong>{siteName}</strong>}
                </Link>
                <button type="button" onClick={() => setMenuOpen(false)} className="p-2 text-xl" aria-label="Đóng menu"><RxCross2 /></button>
              </div>
              <nav className="mt-4 flex flex-col">
                {navigation.map((item) => (
                  <div key={item.href}>
                    {item.products ? (
                      <button type="button" onClick={() => setMobileProductsOpen((value) => !value)} className="flex w-full items-center justify-between border-b py-2 text-left">{item.label}<FaAngleDown className={mobileProductsOpen ? "rotate-180" : ""} /></button>
                    ) : (
                      <Link href={item.href} onClick={() => setMenuOpen(false)} className="block border-b py-2 hover:text-red-500">{item.label}</Link>
                    )}
                    {item.products && mobileProductsOpen ? (
                      <div className="ml-4 max-h-[430px] overflow-y-auto">
                        <Link href="/danh-muc" onClick={() => setMenuOpen(false)} className="block border-b py-2 font-normal text-mainColorHover">Tất cả sản phẩm</Link>
                        {roots.map((category) => (
                          <MobileCategoryBranch
                            key={category.id}
                            category={category}
                            onNavigate={() => setMenuOpen(false)}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        ) : null}
      </div>
    </header>
  );
}
