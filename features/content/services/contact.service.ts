import { publicApiFetch } from "@/lib/api/public-api";
import type { ApiResponse } from "@/lib/types/api";
import type { ContactFormInput } from "@/features/content/schemas/contact.schema";
import { contactFormSchema } from "@/features/content/schemas/contact.schema";

type ContactSubmitResponse = {
  id: string;
};

export async function submitContactForm(
  input: ContactFormInput,
  options: { sourceUrl?: string } = {},
): Promise<ApiResponse<ContactSubmitResponse>> {
  const safeInput = contactFormSchema.parse(input);

  return publicApiFetch<ApiResponse<ContactSubmitResponse>>("/api/public/forms", {
    method: "POST",
    body: {
      formType: "CONTACT",
      fullName: safeInput.fullName,
      phone: safeInput.phone,
      email: safeInput.email || undefined,
      message: safeInput.message,
      sourceUrl:
        options.sourceUrl ??
        (typeof window !== "undefined" ? window.location.href : undefined),
    },
    cache: "no-store",
  });
}
