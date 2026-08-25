import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên."),
  phone: z.string().min(8, "Vui lòng nhập số điện thoại hợp lệ."),
  email: z.string().email("Email không hợp lệ.").optional().or(z.literal("")),
  message: z.string().min(5, "Vui lòng nhập nội dung cần tư vấn."),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
