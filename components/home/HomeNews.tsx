import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/features/content/types";
import { formatDate } from "@/lib/utils/format-date";

export const BlogCard = ({ Data }: { Data: BlogPost }) => {
  const date = Data.publishedAt ?? Data.createdAt;
  return (
    <Link href={`/bai-viet/${Data.slug}`} className="block cursor-pointer rounded-lg border border-gray-300 bg-white">
      <article className="p-4">
        <div className="grid grid-cols-6 gap-5">
          <div className="col-span-2 h-[200px]">
            {Data.thumbnailUrl ? <Image src={Data.thumbnailUrl} alt={Data.title} width={400} height={400} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200" />}
          </div>
          <div className="col-span-4 font-bold text-mainColorHover"><h2>{Data.title}</h2>{Data.excerpt ? <p className="mt-2 text-[12px] font-light text-black">{Data.excerpt} ...</p> : null}</div>
        </div>
        <div className="mt-4 flex items-center justify-between border-y border-gray-200 py-1 text-[14px] text-mainColorHover"><p>{date ? formatDate(date) : ""}</p><span className="duration-300 hover:text-blue-500">Xem thêm</span></div>
      </article>
    </Link>
  );
};

export default function HomeNews({ Data }: { Data: BlogPost[] }) {
  if (!Data.length) return null;
  return <section><div className="flex justify-center border-b border-mainColorHover"><h2 className="w-max rounded-t-lg bg-mainColorHover px-4 py-2 text-[20px] font-normal uppercase text-white">Tin tức</h2></div><div className="mt-3 flex flex-col gap-7">{Data.slice(0, 5).map((item) => <BlogCard key={item.id} Data={item} />)}</div></section>;
}
