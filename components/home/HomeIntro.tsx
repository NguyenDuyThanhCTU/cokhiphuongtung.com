import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

export default function HomeIntro({ post, settings }: { post?: BlogPost; settings: PublicSiteSettings }) {
  return (
    <section className="bg-[url(https://firebasestorage.googleapis.com/v0/b/quangcaocokhixaydung.appspot.com/o/UI%2F201313823_1160040927807717_7589381226147591092_n.jpg?alt=media&token=675fe7a8-72a8-4c33-9dcf-35b463488a38)] bg-center bg-no-repeat">
      <div className="bg-[rgba(0,0,0,0.70)]">
        <div className="flex gap-2 py-5 p:flex-col p:px-0 d:flex-row d:px-5">
          <div className="flex h-[500px] flex-[45%] items-center justify-center">
            <div className="p:h-auto p:w-auto d:h-[300px] d:w-[400px]">
              {post?.thumbnailUrl ? <Image src={post.thumbnailUrl} alt={post.title} width={800} height={600} className="h-full w-full border-4 border-white object-cover" /> : <div className="flex h-full min-h-[280px] w-full items-center justify-center border-4 border-white bg-mainColorHover text-5xl font-semibold text-mainColor">PT</div>}
            </div>
          </div>
          <div className="flex-[55%] text-white p:px-3 d:px-10">
            <h2 className="font-serif text-[40px] italic">Giới thiệu</h2>
            <h3 className="text-center text-[30px] font-bold uppercase leading-7 text-mainColor">Tại sao chọn Sắt Mỹ Thuật Phương Tùng</h3>
            <p className="mt-5 indent-3 leading-7">{post?.excerpt || settings.description || settings.slogan}</p>
            <Link href="/gioi-thieu" className="mt-5 inline-block font-bold text-white hover:text-red-700">Đọc thêm _</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
