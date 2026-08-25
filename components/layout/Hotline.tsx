"use client";

import { ArrowUp, Phone } from "lucide-react";
import Image from "next/image";
import { PublicSiteSettings } from "@/features/site/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPrimaryHotline } from "@/features/site/utils/contact";

function Hotline({ settings }: { settings: PublicSiteSettings }) {
  const [showScroll, setShowScroll] = useState(false);
  const primaryHotline = getPrimaryHotline(settings);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        <div className="bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-lg shadow-lg relative animate-bounce ml-2 border border-gray-100">
          Bạn cần đặt xe?
          <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
        </div>

        <Link
          href={primaryHotline ? `tel:${primaryHotline}` : "#"}
          className="bg-[#ff3300] hover:bg-[#e62e00] text-white flex items-center gap-3 px-5 py-3 rounded-full shadow-xl transition-all transform hover:scale-105 group"
        >
          <div className="relative">
            <Phone size={20} fill="currentColor" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[#ff3300]"></span>
            </span>
          </div>
          <span className="font-bold text-sm uppercase tracking-wide">
            Liên Hệ Ngay
          </span>
        </Link>
      </div>
      <div id="button-contact-vr" className="">
        <div id="gom-all-in-one">
          <div id="zalo-vr" data-track="click_zalo" className="button-contact">
            <div className="phone-vr">
              <div className="phone-vr-circle-fill"></div>
              <div className="phone-vr-img-circle">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={settings.social?.zaloChat || "https://zalo.me"}
                  aria-label="Chat Zalo"
                >
                  <Image
                    width={50}
                    height={50}
                    alt="Zalo"
                    src="https://pub-85e0caedbac24cc58c8c86d33edb0129.r2.dev/caitaonhaphuquy/1782662340593-zalo.webp"
                  />
                  <noscript>
                    <Image
                      width={50}
                      height={50}
                      alt="Zalo"
                      src="https://pub-85e0caedbac24cc58c8c86d33edb0129.r2.dev/caitaonhaphuquy/1782662340593-zalo.webp"
                    />
                  </noscript>
                </a>
              </div>
            </div>
          </div>

          <div
            id="phone-vr"
            data-track="click_hotline"
            className="button-contact"
          >
            <div className="phone-vr">
              <div className="phone-vr-circle-fill"></div>
              <div className="phone-vr-img-circle">
                <a
                  href={primaryHotline ? `tel:${primaryHotline}` : "#"}
                  aria-label="Gọi hotline"
                >
                  <Image
                    width={50}
                    height={50}
                    alt="Phone"
                    src="https://pub-85e0caedbac24cc58c8c86d33edb0129.r2.dev/caitaonhaphuquy/1782662343829-phone.webp"
                  />
                  <noscript>
                    <Image
                      width={50}
                      height={50}
                      alt="Phone"
                      src="https://pub-85e0caedbac24cc58c8c86d33edb0129.r2.dev/caitaonhaphuquy/1782662343829-phone.webp"
                    />
                  </noscript>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-6 z-40 flex flex-col items-center gap-3">
        <button
          onClick={scrollToTop}
          className={`w-10 h-10 bg-slate-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary transition-all duration-300 transform ${
            showScroll
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-0 pointer-events-none h-0 w-0 overflow-hidden m-0 p-0"
            // Khi ẩn thì thu gọn lại để social buttons không bị đẩy lên quá cao
          }`}
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </>
  );
}

export default Hotline;
