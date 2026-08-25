"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiMailSend, BiSolidSend } from "react-icons/bi";
import { IoMdArrowDropright } from "react-icons/io";
import { GrSend } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import slugify from "slugify";
import { PublicSiteSettings } from "@/features/site/types";
import { getPrimaryHotline } from "@/features/site/utils/contact";

interface MenuProps {
  setIsOpen: (isOpen: boolean) => void;
  Header: any[];
  settings: PublicSiteSettings;
}

const Menu = ({ setIsOpen, Header, settings }: MenuProps) => {
  const [isOpenMenu, setOpenMenu] = useState({
    lv1: "",
    lv2: "",
  });
  const primaryHotline = getPrimaryHotline(settings);

  const SocialItems = [
    {
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/120px-Icon_of_Zalo.svg.png",
      label: "Zalo",
      link: settings.social?.zalo ? settings.social.zalo : "",
    },
    {
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/120px-Facebook_Logo_%282019%29.png",
      label: "Facebook",
      link: settings.social?.facebook ? settings.social.facebook : "",
    },
  ];

  return (
    <div className="font-Nunito h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between px-5 text-[24px] items-center py-2 border-b">
          <h3 className="font-normal">Menu</h3>
          <div onClick={() => setIsOpen(false)}>
            <RxCross2 />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4 text-[13px]">
          {Header.map((item, idx) => {
            return (
              <div key={idx}>
                <div className="flex justify-between w-full items-center">
                  <Link
                    onClick={() => setIsOpen(false)}
                    href={`/${item.value}`}
                    className={`${
                      isOpenMenu.lv1 === item.value && "text-mainBold "
                    } font-semibold`}
                  >
                    {item.label}
                  </Link>

                  {item.children && item.children.length > 0 && (
                    <IoMdArrowDropright
                      className={`${
                        isOpenMenu.lv1 === item.value &&
                        "rotate-90 duration-300 text-mainBold"
                      }`}
                      onClick={() => {
                        if (isOpenMenu.lv1 === item.value) {
                          setOpenMenu({ ...isOpenMenu, lv1: "" });
                        } else {
                          setOpenMenu({ ...isOpenMenu, lv1: item.value });
                        }
                      }}
                    />
                  )}
                </div>
                {item.children && item.children.length > 0 && (
                  <div
                    className={`animate__animated ${
                      isOpenMenu.lv1 === item.value
                        ? " block animate__fadeIn"
                        : "hidden"
                    } flex flex-col mt-4 gap-4 ml-6`}
                  >
                    {item.children.map((Categories: any, LV1idx: number) => {
                      return (
                        <div key={LV1idx}>
                          <div className="flex justify-between w-full items-center">
                            <Link
                              onClick={() => setIsOpen(false)}
                              href={`/danh-muc/${Categories.slug}`}
                              className={`${
                                isOpenMenu.lv2 === Categories.name &&
                                "text-mainBold font-normal"
                              }`}
                            >
                              {Categories.name}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-3 py-2 font-normal flex flex-col gap-2">
        <h3 className="text-red-600 text-[18px] uppercase font-semibold">
          Hỗ trợ 24/24
        </h3>
        <p className="text-gray-500">
          <br /> Hotline:{" "}
          <Link
            onClick={() => setIsOpen(false)}
            className="text-blink hover:underline"
            href={primaryHotline ? `tel:${primaryHotline}` : "#"}
            data-track="click_hotline"
          >
            {primaryHotline}
          </Link>{" "}
          {settings?.contact?.phoneSecondary && (
            <>
              {" "}
              -{" "}
              <Link
                onClick={() => setIsOpen(false)}
                className="text-blink hover:underline"
                href={`tel:${settings?.contact?.phoneSecondary}`}
                data-track="click_hotline"
              >
                {settings?.contact?.phoneSecondary}
              </Link>
            </>
          )}
        </p>
        <div className="border ">
          <div className="w-full flex justify-between p-1">
            <input
              type="text"
              className="w-full outline-none text-[17px] px-2 font-light text-black "
            />
            <div className="text-[23px] px-2">
              <GrSend className="" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {SocialItems.map((item, idx) => (
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              className="w-7 h-7 rounded-full"
            >
              <Image
                src={item.icon}
                alt="social"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
