"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPhoneCall } from "react-icons/bi";
import { BsFillArrowUpSquareFill } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

import type { PublicSiteSettings } from "@/features/site/types";
import { getPhoneHref, getPrimaryHotline, getZaloHref } from "@/features/site/utils/contact";

export default function Hotline({ settings }: { settings: PublicSiteSettings }) {
  const [showScroll, setShowScroll] = useState(false);
  const hotline = getPrimaryHotline(settings);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showScroll ? <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-7 left-2 z-50 px-4 py-2" aria-label="Lên đầu trang"><BsFillArrowUpSquareFill className="rounded-full bg-white text-4xl text-blue-500" /></button> : null}
      <div className="fixed bottom-7 right-5 z-50 flex flex-col gap-5 d:right-10">
        <Link href={settings.social?.facebook || "https://www.facebook.com"} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full border border-white bg-blue-500" aria-label="Facebook"><FaFacebookF className="text-[32px] text-white" /></Link>
        <Link href={getZaloHref(settings)} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500" aria-label="Zalo"><SiZalo className="h-full w-full p-3" /></Link>
        <Link href={getPhoneHref(hotline)} data-track="click_hotline">
          <div className="flex items-center">
            <div className="absolute right-5 hidden h-[60px] w-[250px] items-center justify-start rounded-full bg-white font-semibold text-black shadow-2xl d:flex"><span className="ml-5">Liên hệ với chúng tôi</span></div>
            <div className="call-animation h-14 w-14 p-2"><BiPhoneCall className="text-[40px] text-white" /></div>
          </div>
        </Link>
      </div>
    </>
  );
}
