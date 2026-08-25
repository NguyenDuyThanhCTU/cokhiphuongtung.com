"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { IoIosMenu, IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

import type { CatalogCategory } from "@/features/catalog/types";
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

export function SiteHeader({ settings, catalogCategories }: SiteHeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const categories = catalogCategories.filter((category) => category.isActive !== false);
  const roots = categories.filter((category) => !category.parentId);
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

          <div className="relative h-[100px] w-full p-1">
            <Image src="https://firebasestorage.googleapis.com/v0/b/cokhiphuongtung-960eb.appspot.com/o/12.png?alt=media&token=9fc9dd81-b271-4c28-8047-1d660695bb36" alt="Hotline hỗ trợ" width={500} height={500} className="h-full w-full object-fill" />
            <a href={getPhoneHref(hotline)} className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-[18px] font-normal text-white" data-track="click_hotline_header">Hotline Hỗ trợ: {hotline}</a>
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
                        <div key={category.id} className="group/sub relative border-b">
                          <Link href={`/danh-muc/${category.slug}`} className="flex min-w-[230px] items-center justify-between px-4 py-2 text-sm font-light text-black duration-300 hover:bg-mainColorHover hover:text-white">
                            {category.name}
                            {categories.some((child) => child.parentId === category.id) ? <FaAngleDown className="-rotate-90" /> : null}
                          </Link>
                          <div className="invisible absolute left-full top-0 min-w-[240px] bg-gray-100 opacity-0 shadow-lg transition group-hover/sub:visible group-hover/sub:opacity-100">
                            {categories.filter((child) => child.parentId === category.id).map((child) => <Link key={child.id} href={`/danh-muc/${child.slug}`} className="block border-b px-4 py-2 text-sm text-black duration-300 hover:bg-mainColor">{child.name}</Link>)}
                          </div>
                        </div>
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
                        {roots.map((category) => <Link key={category.id} href={`/danh-muc/${category.slug}`} onClick={() => setMenuOpen(false)} className="block border-b py-2 text-sm">{category.name}</Link>)}
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
