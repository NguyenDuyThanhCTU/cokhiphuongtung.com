import React from "react";

import { CatalogItem } from "@/features/catalog/types";
import Image from "next/image";
import Link from "next/link";

export const TourCard = ({ Data }: { Data: CatalogItem }) => {
  return (
    <div className="text-black bg-gray-100  shadow-xl border-gray-300 group ">
      <div className="  h-[225px] relative">
        <Image
          src={Data?.thumbnailUrl ? Data?.thumbnailUrl : "="}
          alt={Data.title}
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
        <div className="bg-[#00000063] absolute text-white top-0 w-full h-full  group-hover:opacity-0 duration-300">
          <div className="w-full h-full flex items-center flex-col justify-center">
            <p className="text-[25px] text-center px-2"> {Data?.title}</p>
            <p> Giá liên hệ tham khảo</p>
          </div>
        </div>
        <div className="bg-[#652d08b9] absolute top-0 w-full h-full opacity-0 group-hover:opacity-100 duration-500">
          <div className="w-full h-full flex items-center flex-col gap-2 justify-center text-white">
            <p className="text-[25px]  text-center px-2"> {Data?.title}</p>
            <Link
              href={`/dich-vu/${Data?.slug}`}
              className="border border-white px-4 py-1"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="rounded-b-md bg-white px-4 py-3 flex flex-col gap-2">
        <Link
          className="  duration-300  truncate2 hover:text-mainBold"
          href={`/${Data?.url}`}
        >
          {Data?.title}
        </Link>

        <div>
          <div className="font-light text-[14px] truncate2 text-gray-500">
            {Data?.description}
          </div>
        </div>
        <div className=" text-[14px] text-mainBold gap-2">
          <div className="flex items-center gap-1">
            <CiClock1 />
            <span>{Data?.date}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const HomeTour = ({ Data }: { Data: CatalogItem[] }) => {
  return (
    <div className=" py-5  d:w-[1200px] d:mx-auto p:w-auto p:mx-2 ">
      <h3 className="text-center bg-green-600 uppercase d:text-[45px] p:text-[25px] font-bold my-5 py-2 text-white">
        Các Tour Phổ Biến
      </h3>
      <div className="grid p:grid-cols-1 d:grid-cols-3 gap-10">
        {Data?.map((item, idx) => (
          <div key={idx}>
            <TourCard Data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTour;
