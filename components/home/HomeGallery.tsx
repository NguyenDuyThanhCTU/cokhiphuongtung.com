"use client";

import { Image as PreviewImage } from "antd";
import { useState } from "react";

import type { BlogPost } from "@/features/content/types";
import { extractYouTubeEmbedUrl } from "@/features/content/utils/post-groups";

export default function HomeGallery({ images, videos }: { images: BlogPost[]; videos: BlogPost[] }) {
  const [selected, setSelected] = useState<"images" | "videos">("images");
  const data = selected === "images" ? images : videos;

  if (!images.length && !videos.length) return null;

  return (
    <section className="bg-slate-100 pb-20 pt-10">
      <div className="bg-slate-100 p:mx-2 p:w-auto d:mx-auto d:w-[1100px]">
        <div className="flex justify-center border-b border-mainColorHover"><h2 className="w-max rounded-t-lg bg-mainColorHover px-4 py-2 text-[20px] font-normal uppercase text-white">Thư viện</h2></div>
        <div className="flex cursor-pointer justify-center text-[20px]">
          <button type="button" onClick={() => setSelected("images")} className={`border-b px-7 py-3 ${selected === "images" ? "border-mainColorHover text-mainColorHover" : "border-gray-400 text-gray-400"}`}>Hình Ảnh</button>
          <button type="button" onClick={() => setSelected("videos")} className={`border-b px-7 py-3 ${selected === "videos" ? "border-mainColorHover text-mainColorHover" : "border-gray-400 text-gray-400"}`}>Video</button>
        </div>
        <div className="my-10 grid gap-2 p:grid-cols-2 d:grid-cols-3">
          {data.map((item) => selected === "images" ? (
            item.thumbnailUrl ? <PreviewImage key={item.id} src={item.thumbnailUrl} alt={item.title} className="w-full object-cover object-center p:h-auto d:h-[310px]" /> : null
          ) : (
            <div key={item.id} className="h-[310px] w-full">
              {extractYouTubeEmbedUrl(item.content) ? <iframe className="h-full w-full border-0 object-cover" src={extractYouTubeEmbedUrl(item.content) || ""} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="flex h-full items-center justify-center bg-gray-200 text-center text-sm">{item.title}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
