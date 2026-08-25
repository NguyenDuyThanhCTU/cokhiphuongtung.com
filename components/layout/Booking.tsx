"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Headphones, Phone, Send, TicketCheck } from "lucide-react";

import { contactFormSchema } from "@/features/content/schemas/contact.schema";
import { submitContactForm } from "@/features/content/services/contact.service";
import type { PublicSiteSettings } from "@/features/site/types";
import { getHotlines, getPhoneHref, getZaloHref } from "@/features/site/utils/contact";

type BookingFormState = {
  fullName: string;
  phone: string;
  route: string;
  departureDate: string;
  passengerCount: string;
  note: string;
};

type SubmitStatus = { tone: "success" | "error"; message: string } | null;

const initialForm: BookingFormState = {
  fullName: "",
  phone: "",
  route: "",
  departureDate: "",
  passengerCount: "1",
  note: "",
};

const fieldClassName =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

function buildBookingMessage(form: BookingFormState) {
  return [
    "Nguồn form: Yêu cầu đặt vé xe Hà Giang",
    `Tuyến xe quan tâm: ${form.route}`,
    `Ngày dự kiến đi: ${form.departureDate || "Chưa xác định"}`,
    `Số lượng vé: ${form.passengerCount}`,
    `Ghi chú: ${form.note.trim() || "Không có"}`,
  ].join("\n");
}

export default function BookingPage({ settings }: { settings: PublicSiteSettings }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>(null);
  const hotlines = getHotlines(settings);

  useEffect(() => {
    const requestedRoute = new URLSearchParams(window.location.search).get("tuyen")?.trim();
    if (!requestedRoute) return;

    setForm((current) =>
      current.route ? current : { ...current, route: requestedRoute },
    );
  }, []);

  const updateField = (field: keyof BookingFormState, value: string) => {
    setStatus(null);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const route = form.route.trim();
    if (!route) {
      setStatus({ tone: "error", message: "Vui lòng nhập tuyến xe bạn quan tâm." });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: "",
      message: buildBookingMessage({ ...form, route }),
    };
    const parsed = contactFormSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus({ tone: "error", message: parsed.error.issues[0]?.message || "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await submitContactForm(parsed.data);
      if (!result?.success) throw new Error("Booking request was not accepted");

      const browserWindow = window as Window & { dataLayer?: Array<Record<string, string>> };
      browserWindow.dataLayer = browserWindow.dataLayer || [];
      browserWindow.dataLayer.push({ event: "lead_submit_success", lead_type: "ticket_booking_request", form_name: "ha_giang_ticket_booking" });

      setForm(initialForm);
      setStatus({ tone: "success", message: "Đã tiếp nhận yêu cầu. Nhân viên sẽ liên hệ để xác nhận thông tin và giá vé." });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error("Failed to submit booking request", error);
      setStatus({ tone: "error", message: "Chưa thể gửi yêu cầu. Vui lòng thử lại hoặc gọi hotline để được hỗ trợ ngay." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="dat-ve" className="relative scroll-mt-28 overflow-hidden bg-brand-400 py-14 d:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.48),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.12),transparent_35%)]" />
      <div className="relative mx-auto grid w-full max-w-[1200px] gap-8 px-4 sm:px-6 d:grid-cols-[0.78fr_1.22fr] d:px-0">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-300"><TicketCheck size={16} /> Đặt vé nhanh</p>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">Gửi yêu cầu đặt vé xe Hà Giang</h2>
          <p className="mt-4 leading-7 text-slate-800">Điền thông tin cơ bản. Nhân viên sẽ liên hệ xác nhận tuyến xe, giá vé và hướng dẫn tiếp theo.</p>
          <div className="mt-7 grid gap-3">
            {["Không yêu cầu thanh toán trực tuyến", "Thông tin được xác nhận trực tiếp", "Hỗ trợ tư vấn 24/7"].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-bold text-slate-800"><CheckCircle2 size={18} className="shrink-0" />{item}</p>)}
          </div>
          <div className="mt-8 rounded-2xl bg-white/80 p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-extrabold text-slate-950"><Headphones size={19} /> Hotline hỗ trợ</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {hotlines.map((hotline) => <a key={hotline} href={getPhoneHref(hotline)} className="text-lg font-black text-slate-950 hover:text-brand-700">{hotline}</a>)}
            </div>
            <Link href={getZaloHref(settings)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-extrabold text-brand-800">Hoặc chat Zalo để được hỗ trợ</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-7" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">Họ và tên <span className="sr-only">bắt buộc</span><input className={fieldClassName} value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" required /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Số điện thoại/Zalo <span className="sr-only">bắt buộc</span><input className={fieldClassName} value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="09xx xxx xxx" type="tel" inputMode="tel" autoComplete="tel" required /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700 sm:col-span-2">Tuyến xe quan tâm <span className="sr-only">bắt buộc</span><input className={fieldClassName} value={form.route} onChange={(event) => updateField("route", event.target.value)} placeholder="Ví dụ: Hà Nội – Hà Giang" required /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Ngày dự kiến đi<input className={fieldClassName} value={form.departureDate} onChange={(event) => updateField("departureDate", event.target.value)} type="date" /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Số lượng vé<select className={fieldClassName} value={form.passengerCount} onChange={(event) => updateField("passengerCount", event.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map((count) => <option key={count} value={String(count)}>{count} vé</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700 sm:col-span-2">Ghi chú<textarea className={`${fieldClassName} min-h-28 resize-y py-3`} value={form.note} onChange={(event) => updateField("note", event.target.value)} placeholder="Nhu cầu cần tư vấn thêm..." /></label>
          </div>

          {status ? <div role="status" aria-live="polite" className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${status.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>{status.message}</div> : null}

          <button type="submit" disabled={isSubmitting} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            <Send size={17} /> {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu đặt vé"}
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">Gửi form chưa đồng nghĩa vé đã được xác nhận. Nhân viên sẽ liên hệ lại với bạn.</p>
        </form>
      </div>
    </section>
  );
}
