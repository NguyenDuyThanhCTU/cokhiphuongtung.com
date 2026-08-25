import { CatalogItem } from "@/features/catalog/types";
import { BlogPost } from "@/features/content/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({ Data }: { Data: CatalogItem }) => {
  return (
    <div className="text-black glow">
      <Link href={`/bai-viet/${Data?.slug}`}>
        <div className="border border-t-mainYellow h-[225px] overflow-hidden rounded-t-md">
          <Image
            src={Data?.thumbnailUrl ? Data?.thumbnailUrl : ""}
            alt="Blogs"
            width={500}
            height={500}
            className="h-full w-full object-cover hover:scale-105 duration-300 rounded-t-md"
          />
        </div>
      </Link>
      <div className="rounded-b-md bg-white px-4 py-3 flex flex-col gap-2">
        <Link
          className="uppercase  duration-300 d:text-[20px] p:text-[18px] text-blue-600 font-bold text-center truncate2 hover:text-main"
          href={`/bai-viet/${Data?.slug}`}
        >
          {Data?.title}
        </Link>

        <div>
          <div className="font-light text-[14px] truncate2">
            {Data?.shortDescription}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
