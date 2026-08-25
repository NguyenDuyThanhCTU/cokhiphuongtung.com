import { CatalogCategory } from "@/features/catalog/types";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa";

import slugify from "slugify";

export const Dropdown = ({
  Parent,
  ServiceItem,
}: {
  Parent: string;
  ServiceItem: CatalogCategory[];
}) => {
  return (
    <div className="flex flex-col top-5 absolute  left-0   ">
      <div className="bg-none w-full h-3 "></div>
      <div className="group-hover:opacity-100 group-hover:visible group-hover:transform-none dropdown border border-gray-300  border-t-[4px] border-t-mainOrange  relative bg-white min-w-[200px] h-0">
        <div className="absolute w-2 h-2 bg-mainOrange rotate-45  -top-2 left-[20%] -z-10"></div>
        <div className=" flex flex-col w-full bg-white shadow-md shadow-slate-500 ">
          {ServiceItem?.map((Categories, LV1idx) => {
            return (
              <div
                className=" w-full group/submenu relative text-black "
                key={LV1idx}
              >
                <Link
                  href={`/danh-muc/${Categories.slug}`}
                  className="duration-300 text-[14px]   hover:bg-mainBold  flex items-center justify-between hover:text-white p-2 "
                >
                  <span> {Categories.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
