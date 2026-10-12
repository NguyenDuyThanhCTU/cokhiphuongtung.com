"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { quoteRequestSchema } from "@/features/content/schemas/quote-request.schema";
import { submitQuoteRequest } from "@/features/content/services/quote-request.service";

type QuoteFormState = { fullName: string; phone: string; product: string; dimensions: string; location: string; note: string };
type QuoteFormErrors = Partial<Record<keyof QuoteFormState, string>>;
const initialForm: QuoteFormState = { fullName: "", phone: "", product: "", dimensions: "", location: "", note: "" };
const fieldClass = "w-full border bg-white px-3 py-2 outline-none";

function getFieldClass(hasError: boolean) {
  return `${fieldClass} ${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-mainColorHover"}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return <p id={id} className="min-h-5 text-sm text-red-600" role={message ? "alert" : undefined}>{message ?? ""}</p>;
}

export default function QuoteRequestSection() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<QuoteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get("san-pham")?.trim();
    if (product) setForm((current) => current.product ? current : { ...current, product });
  }, []);

  const update = (field: keyof QuoteFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = quoteRequestSchema.safeParse({
      ...form,
      sourceUrl: window.location.href,
    });
    if (!parsed.success) {
      const nextErrors: QuoteFormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in initialForm) {
          const formField = field as keyof QuoteFormState;
          nextErrors[formField] ??= issue.message;
        }
      }
      setFieldErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      if (firstInvalidField) {
        window.requestAnimationFrame(() => document.getElementById(`quote-${firstInvalidField}`)?.focus());
      }
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi yêu cầu báo giá...");
    try {
      const result = await submitQuoteRequest(parsed.data);
      setForm(initialForm);
      setFieldErrors({});
      toast.update(toastId, {
        render: result.message,
        type: result.emailSent ? "success" : "warning",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error instanceof Error ? error.message : "Chưa thể gửi yêu cầu. Vui lòng thử lại hoặc gọi hotline.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-2xl border bg-white p-4" noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-normal" htmlFor="quote-fullName">Tên (*)</label>
        <input id="quote-fullName" className={getFieldClass(Boolean(fieldErrors.fullName))} value={form.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Nhập họ tên..." required aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? "quote-fullName-error" : undefined} />
        <FieldError id="quote-fullName-error" message={fieldErrors.fullName} />

        <label className="font-normal" htmlFor="quote-phone">Số điện thoại (*)</label>
        <input id="quote-phone" className={getFieldClass(Boolean(fieldErrors.phone))} value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Nhập số điện thoại..." type="tel" required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "quote-phone-error" : undefined} />
        <FieldError id="quote-phone-error" message={fieldErrors.phone} />

        <label className="font-normal" htmlFor="quote-product">Sản phẩm / hạng mục (*)</label>
        <input id="quote-product" className={getFieldClass(Boolean(fieldErrors.product))} value={form.product} onChange={(event) => update("product", event.target.value)} placeholder="Nhập sản phẩm cần báo giá..." required aria-invalid={Boolean(fieldErrors.product)} aria-describedby={fieldErrors.product ? "quote-product-error" : undefined} />
        <FieldError id="quote-product-error" message={fieldErrors.product} />

        <div className="grid gap-2 d:grid-cols-2">
          <label>Kích thước / số lượng<input id="quote-dimensions" className={getFieldClass(Boolean(fieldErrors.dimensions))} value={form.dimensions} onChange={(event) => update("dimensions", event.target.value)} aria-invalid={Boolean(fieldErrors.dimensions)} aria-describedby={fieldErrors.dimensions ? "quote-dimensions-error" : undefined} />{fieldErrors.dimensions ? <span id="quote-dimensions-error" className="mt-1 block text-sm text-red-600" role="alert">{fieldErrors.dimensions}</span> : null}</label>
          <label>Địa điểm thi công<input id="quote-location" className={getFieldClass(Boolean(fieldErrors.location))} value={form.location} onChange={(event) => update("location", event.target.value)} aria-invalid={Boolean(fieldErrors.location)} aria-describedby={fieldErrors.location ? "quote-location-error" : undefined} />{fieldErrors.location ? <span id="quote-location-error" className="mt-1 block text-sm text-red-600" role="alert">{fieldErrors.location}</span> : null}</label>
        </div>
        <label className="font-normal" htmlFor="quote-note">Nội dung<textarea id="quote-note" className={`${getFieldClass(Boolean(fieldErrors.note))} min-h-28`} value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="Chúng tôi có thể giúp gì cho bạn..." aria-invalid={Boolean(fieldErrors.note)} aria-describedby={fieldErrors.note ? "quote-note-error" : undefined} />{fieldErrors.note ? <span id="quote-note-error" className="mt-1 block text-sm text-red-600" role="alert">{fieldErrors.note}</span> : null}</label>
        <p className="italic"><sup className="text-red-500">(*)</sup> bắt buộc phải nhập</p>
        <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-500 px-4 py-1 text-white duration-300 hover:bg-blue-600 disabled:opacity-60">{isSubmitting ? "Đang gửi..." : "Gửi Đi"}</button></div>
      </div>
      <ToastContainer position="top-right" newestOnTop theme="colored" />
    </form>
  );
}
