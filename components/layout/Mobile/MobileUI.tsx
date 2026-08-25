"use client";
import Image from "next/image";
import React, { useState } from "react";
import { PiHeartThin, PiShoppingCartThin, PiUserThin } from "react-icons/pi";
import { IoMenuOutline, IoSearch, IoSearchOutline } from "react-icons/io5";
import { Badge, Drawer } from "antd";

import Link from "next/link";
import { FiMenu } from "react-icons/fi";

import { IoIosMenu } from "react-icons/io";

import { FaPhone, FaSearch } from "react-icons/fa";
import Menu from "./Menu";
import { MdEmail } from "react-icons/md";
import { PublicSiteSettings } from "@/features/site/types";
import { getPrimaryHotline } from "@/features/site/utils/contact";

interface MobileProps {
  ContactData: PublicSiteSettings;
  Header: any[];
}

const Mobile = ({ ContactData, Header }: MobileProps) => {
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpenSearch, setOpenSearch] = useState(false);
  const primaryHotline = getPrimaryHotline(ContactData);

  return (
    <div className={`top-0 duration-300 fixed w-full  d:hidden p:block z-50`}>
      <div className="px-4 w-full flex justify-between items-center h-full bg-white border-b text-mainBold shadow-lg">
        <div className="text-[40px] p-2" onClick={() => setOpenMenu(true)}>
          <IoIosMenu />
        </div>
        <Link href={`/`} className="">
          <div className="w-[150px] h-[100px] p-2">
            <Image
              src={ContactData?.logoUrl ? ContactData?.logoUrl : ""}
              width={200}
              height={200}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        <div
          className="text-[22px] p-2"
          onClick={() => setOpenSearch(!isOpenSearch)}
        >
          <FaSearch />
        </div>
      </div>

      <div
        className={`${
          isOpenSearch
            ? " pullup h-[35px]"
            : " opacity-0 transform-none invisible h-0"
        }  bg-white w-full flex justify-between mt-[10px]  items-center shadow-xl gap-1  `}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none px-3"
        />
        <Link
          className="text-[22px]"
          href={`/?search=${search}`}
          onClick={() => {
            setSearch("");
            setOpenSearch(false);
          }}
        >
          <IoSearchOutline className=" text-white bg-main h-[35px] w-full px-3 " />
        </Link>
      </div>
      <>
        <Drawer
          onClose={() => setOpenMenu(false)}
          closeIcon={null}
          width={320}
          open={isOpenMenu}
          placement="left"
          className="reset_Drawer"
        >
          <Menu
            setIsOpen={setOpenMenu}
            Header={Header}
            settings={ContactData}
          />
        </Drawer>
      </>
    </div>
  );
};

export default Mobile;
