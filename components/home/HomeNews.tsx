import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { ClickableContainer } from "@/components/ui/ClickableContainer";
import type { BlogPost } from "@/features/content/types";
import { getPostPreviewText } from "@/features/content/utils/post-preview-text";
import { formatDate } from "@/lib/utils/format-date";

export const BlogCard = ({
  Data,
  variant = "list",
  href,
}: {
  Data: BlogPost;
  variant?: "list" | "grid";
  href?: string;
}) => {
  const date = Data.publishedAt ?? Data.createdAt;
  const isGrid = variant === "grid";
  const previewText = getPostPreviewText(Data, "excerpt");
  const postHref = href ?? `/bai-viet/${Data.slug}`;
  return (
    <ClickableContainer
      as="article"
      href={postHref}
      aria-label={`Xem bài viết ${Data.title}`}
      className={`group flex cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-4 transition hover:border-mainColorHover hover:shadow-md ${isGrid ? "h-full" : ""}`}
    >
      <div
        className={
          isGrid
            ? "flex flex-1 flex-col gap-4"
            : "grid grid-cols-1 gap-5 sm:grid-cols-6"
        }
      >
        <Link
          href={postHref}
          className={`block aspect-[3/2] w-full overflow-hidden ${isGrid ? "" : "sm:col-span-2"}`}
        >
          {Data.thumbnailUrl ? (
            <Image
              src={Data.thumbnailUrl}
              alt={Data.title}
              width={600}
              height={400}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </Link>
        <div className={isGrid ? "" : "sm:col-span-4"}>
          {isGrid &&      <h2 className="text-[30px] font-bold text-mainColorHover">
            <Link href={postHref}>{Data.title}</Link>
          </h2>}
     
          {isGrid ? (
            previewText ? (
              <p className="mt-2 line-clamp-3 text-[16px] font-light leading-6 text-black">
                {previewText}
              </p>
            ) : null
          ) : Data.content ? (
            <div className="mt-2 max-h-[330px] overflow-hidden">
              <HtmlContent html={Data.content} />
            </div>
          ) : previewText ? (
            <p className="mt-2 line-clamp-[12] text-[16px] font-light leading-6 text-black">
              {previewText}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-y border-gray-200 py-1 text-[14px] text-mainColorHover">
        <p>{date ? formatDate(date) : ""}</p>
        <Link href={postHref} className="duration-300 hover:text-blue-500">
          Xem thêm
        </Link>
      </div>
    </ClickableContainer>
  );
};

export default function HomeNews({ Data }: { Data: BlogPost[] }) {
  return (
    <section className="bg-white py-16 d:py-20">
      <div className="w-full px-4 sm:px-6 d:px-5">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-UTMFleur text-[38px] leading-none text-mainColorHover">
              Chuyện nghề & cảm hứng
            </p>
            <h2 className="mt-3 font-UTMAmericanSans text-[31px] uppercase tracking-[0.08em] text-[#2d2116] d:text-[40px]">
              Tin tức
            </h2>
          </div>
          <Link
            href="/chuyen-muc/tin-tuc"
            className="inline-flex items-center gap-2 border-b border-mainColorHover pb-1 text-sm font-semibold text-mainColorHover transition hover:text-mainColor"
          >
            Xem tất cả bài viết <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </header>

        {Data.length ? (
          <div className="mt-9 grid gap-6 sm:grid-cols-2 d:grid-cols-4">
            {Data.slice(0, 6).map((item) => {
              const date = item.publishedAt ?? item.createdAt;
              const previewText = getPostPreviewText(item, "excerpt");
              const postHref = `/bai-viet/${item.slug}`;

              return (
                <ClickableContainer
                  as="article"
                  key={item.id}
                  href={postHref}
                  aria-label={`Xem bài viết ${item.title}`}
                  className="group cursor-pointer overflow-hidden border border-[#dfd2b5] bg-[#fffdf8] shadow-[0_8px_24px_rgba(59,40,20,.07)]"
                >
                  <Link
                    href={postHref}
                    className="relative block aspect-[3/2] overflow-hidden bg-stone-100"
                  >
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-UTMFleur text-4xl text-mainColorHover">
                        Phương Tùng
                      </div>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                  </Link>

                  <div className="p-5">
                    {date ? (
                      <p className="flex items-center gap-2 text-xs text-stone-500">
                        <CalendarDays
                          size={14}
                          className="text-mainColorHover"
                          aria-hidden="true"
                        />
                        {formatDate(date)}
                      </p>
                    ) : null}
                    <h3 className="mt-3 font-iCielPequena text-[20px] uppercase leading-7 text-[#332514]">
                      <Link
                        href={postHref}
                        className="transition hover:text-mainColorHover"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {previewText ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">
                        {previewText}
                      </p>
                    ) : null}
                    <Link
                      href={postHref}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mainColorHover"
                    >
                      Xem thêm <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </ClickableContainer>
              );
            })}
          </div>
        ) : (
          <div className="mt-9 border border-dashed border-mainColorHover/35 bg-[#fffdf8] px-6 py-10 text-center text-sm text-stone-500">
            Tin tức đang được cập nhật.
          </div>
        )}
      </div>
    </section>
  );
}
