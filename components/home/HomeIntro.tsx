/* Hallmark · pre-emit critique: P4 H5 E5 S5 R4 V4 */
/* Hallmark · component: intro-section · genre: editorial · theme: existing warm craft · contrast: pass */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ClickableContainer } from "@/components/ui/ClickableContainer";
import type { BlogPost } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

export default function HomeIntro({
  post,
  settings,
}: {
  post?: BlogPost;
  settings: PublicSiteSettings;
}) {
  const shortDescription =
    post?.excerpt || settings.description || settings.slogan;
  const postHref = post ? `/bai-viet/${post.slug}` : "/gioi-thieu";
  const title = post?.title || "Giới thiệu Sắt Mỹ Thuật Phương Tùng";
  return (
    <section className="bg-[url(https://firebasestorage.googleapis.com/v0/b/quangcaocokhixaydung.appspot.com/o/UI%2F201313823_1160040927807717_7589381226147591092_n.jpg?alt=media&token=675fe7a8-72a8-4c33-9dcf-35b463488a38)] bg-center bg-no-repeat">
      <div className="bg-[rgba(0,0,0,0.70)]">
        <ClickableContainer
          href={postHref}
          className="group flex cursor-pointer p:flex-col p:px-0 d:flex-row"
          aria-label="Xem chi tiết phần giới thiệu"
        >
          <div className="relative flex h-[500px] flex-[45%] items-center justify-center overflow-hidden">
            <div className="h-full w-full">
              {post?.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] w-full items-center justify-center border-4 border-white bg-mainColorHover text-5xl font-semibold text-mainColor">
                  PT
                </div>
              )}
            </div>
            {/* <span
              className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-mainColor"
              aria-hidden="true"
            /> */}
          </div>
          <div className="relative isolate flex h-[500px] min-w-0 flex-[55%] flex-col overflow-hidden bg-black px-6 py-9 text-white d:px-12 d:py-11">
            <div
              className="pointer-events-none absolute inset-0 bg-processDiagonal bg-processDiagonalSize opacity-25"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute right-5 top-3 -z-10 font-UTMFleur text-[150px] leading-none text-mainColor/10 d:right-10 d:text-[210px]"
              aria-hidden="true"
            >
              PT
            </span>
            <span
              className="pointer-events-none absolute right-6 top-6 h-16 w-16 border-r border-t border-mainColor/60 d:right-10 d:top-9"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 border-b border-l border-mainColor/35 d:bottom-9 d:left-10"
              aria-hidden="true"
            />

            <div className="relative z-10 min-w-0">
              <h2 className="min-w-0 font-UTMFleur text-[60px]  leading-[1.15] tracking-[0.06em] text-mainColor [overflow-wrap:anywhere] d:text-[60px]">
              Về chúng tôi
              </h2>
              <div className="mt-6 flex max-w-[520px] items-center gap-3">
                <span className="h-px flex-1 bg-mainColor/55" />
                <span className="h-2.5 w-2.5 rotate-45 border border-mainColor bg-processSurface" />
              </div>
            </div>

            <div className="relative z-10 flex flex-1 items-center py-6 d:py-8">
              <p className="max-w-[100ch] text-[16px] leading-8 text-white/90 d:text-[17px]">
                {shortDescription}
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-5">
              <Link
                href={postHref}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 whitespace-nowrap border border-mainColor bg-mainColor px-7 py-3 font-bold text-mainColorHover transition-[background-color,color] duration-200 hover:bg-bgcontent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mainColor active:bg-mainColorHover active:text-white aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                Xem thêm
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <span
                className="hidden h-px flex-1 bg-mainColor/30 sm:block"
                aria-hidden="true"
              />
            </div>
          </div>
        </ClickableContainer>
      </div>
    </section>
  );
}
