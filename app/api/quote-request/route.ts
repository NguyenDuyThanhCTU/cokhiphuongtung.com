import { NextResponse } from "next/server";
import { z } from "zod";

import {
  buildQuoteRequestMessage,
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/features/content/schemas/quote-request.schema";
import { submitContactForm } from "@/features/content/services/contact.service";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

async function sendAdminEmail(input: QuoteRequestInput, adminEmail: string) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _subject: `Yêu cầu báo giá mới từ ${input.fullName}`,
        _template: "table",
        _captcha: "false",
        "Họ và tên": input.fullName,
        "Số điện thoại": input.phone,
        "Sản phẩm / hạng mục": input.product,
        "Kích thước / số lượng": input.dimensions || "Chưa xác định",
        "Địa điểm thi công": input.location || "Chưa xác định",
        "Nội dung": input.note || "Không có",
        ...(input.sourceUrl ? { "Trang gửi": input.sourceUrl } : {}),
      }),
      cache: "no-store",
    },
  );

  const result = (await response.json().catch(() => null)) as
    | { success?: boolean | string }
    | null;
  if (!response.ok || result?.success === false) {
    throw new Error(`FormSubmit returned ${response.status}.`);
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, emailSent: false, message: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const parsed = quoteRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        emailSent: false,
        message: parsed.error.issues[0]?.message || "Thông tin chưa hợp lệ.",
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const settings = await getPublicSiteSettings();
  const adminEmailResult = z
    .string()
    .trim()
    .email()
    .safeParse(settings.contact?.email || settings.email);
  if (!adminEmailResult.success) {
    return NextResponse.json(
      {
        success: false,
        emailSent: false,
        message: "Website chưa cấu hình email nhận báo giá.",
      },
      { status: 503 },
    );
  }
  const adminEmail = adminEmailResult.data;

  const message = buildQuoteRequestMessage(input);
  const [saasResult, emailResult] = await Promise.allSettled([
    submitContactForm(
      {
        fullName: input.fullName,
        phone: input.phone,
        email: "",
        message,
      },
      { sourceUrl: input.sourceUrl },
    ).then((result) => {
      if (!result.success) throw new Error(result.message);
      return result;
    }),
    sendAdminEmail(input, adminEmail),
  ]);

  const saved = saasResult.status === "fulfilled";
  const emailSent = emailResult.status === "fulfilled";

  if (!saved) {
    console.error("Failed to save quote request to SaaS.");
    return NextResponse.json(
      {
        success: false,
        emailSent,
        message: emailSent
          ? "Email đã được gửi nhưng hệ thống chưa lưu được yêu cầu. Vui lòng liên hệ hotline."
          : "Chưa thể gửi yêu cầu. Vui lòng thử lại hoặc liên hệ hotline.",
      },
      { status: 502 },
    );
  }

  if (!emailSent) {
    console.error("Failed to send quote request through FormSubmit.");
  }

  return NextResponse.json({
    success: true,
    emailSent,
    message: emailSent
      ? "Đã tiếp nhận yêu cầu. Chúng tôi sẽ sớm liên hệ để tư vấn và báo giá."
      : "Đã lưu yêu cầu. Thông báo email đang tạm thời gián đoạn.",
  });
}
