import Link from "next/link";
import Image from "next/image";
import { BsPhone } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { FaEarthAmericas } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

import QuoteRequestSection from "@/components/layout/Booking";
import type { PublicSiteSettings } from "@/features/site/types";
import { getHotlines, getPhoneHref } from "@/features/site/utils/contact";

export default function Contact({ settings }: { settings: PublicSiteSettings }) {
  const hotlines = getHotlines(settings);
  const email = settings.contact?.email || settings.email;
  const website = settings.domain || "cokhiphuongtung.com";
  return (
    <section className="flex flex-col gap-10 py-10">
      <div className="grid gap-10 py-5 p:grid-cols-1 d:grid-cols-3">
        <div><h2 className="py-5 text-[20px] font-semibold">Chúng tôi luôn lắng nghe bạn!</h2><QuoteRequestSection settings={settings} /></div>
        <div className="col-span-2 flex w-full flex-col items-start justify-start gap-3 font-extralight">
          <h1 className="text-[48px] font-light"><strong className="font-bold">Liên hệ</strong> với chúng tôi</h1>
          <div className="flex flex-col gap-3 py-3"><p>Hãy để lại thông tin đầy đủ theo mẫu bên cạnh, chúng tôi sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất.</p><p className="text-red-500">* là các thông tin bắt buộc</p></div>
          <Image src="https://firebasestorage.googleapis.com/v0/b/cokhiphuongtung-960eb.appspot.com/o/editor%2Fz5116918608020_d01a1e6462915e378a84909c8e918ab0.jpg?alt=media&token=e95cbb8a-80b4-4a0d-855d-2ee4fb766f3d" width={400} height={400} alt="Cơ khí Phương Tùng" className="max-w-full" />
        </div>
      </div>
      <div className="grid gap-5 font-extralight p:grid-cols-1 d:grid-cols-2">
        <div className="min-h-[520px] w-full border-r">{settings.mapIframe ? <div className="h-full w-full [&_iframe]:h-full [&_iframe]:w-[80%]" dangerouslySetInnerHTML={{ __html: settings.mapIframe }} /> : null}</div>
        <div>
          <div className="flex flex-col gap-5"><h2 className="text-[26px] font-bold">Liên hệ</h2><div className="h-1 w-10 bg-black" /></div>
          <p className="mt-5 py-2">Mọi thông tin liên hệ hợp tác, đặt hàng, tư vấn sản phẩm xin vui lòng liên hệ với chúng tôi qua</p>
          <div className="flex flex-col gap-5">
            <h2 className="text-[25px] font-normal uppercase text-red-500">Công ty TNHH Cơ Khí - Xây dựng Phương Tùng</h2>
            {settings.address ? <div><div className="flex items-center gap-2"><CiLocationOn /><h3>Địa chỉ chúng tôi:</h3></div><p className="font-semibold">{settings.address}</p></div> : null}
            <div><div className="flex items-center gap-2"><BsPhone /><h3>Hotline:</h3></div>{hotlines.map((phone) => <Link key={phone} href={getPhoneHref(phone)} className="mr-3 font-semibold hover:text-blue-500 hover:underline">{phone}</Link>)}</div>
            <div><div className="flex items-center gap-2"><FaEarthAmericas /><h3>Website:</h3></div><Link target="_blank" href={`https://${website}`} className="font-semibold">{website}</Link></div>
            {email ? <div><div className="flex items-center gap-2"><SiGmail /><h3>Email chúng tôi:</h3></div><Link href={`mailto:${email}`} className="font-semibold hover:text-blue-500 hover:underline">{email}</Link></div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
