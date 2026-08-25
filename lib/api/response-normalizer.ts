export type ApiEnvelope<T = unknown> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: unknown;
  meta?: unknown;
};

export { asArray, asObject, unwrapApiData } from "@/lib/utils/api-normalizers";

export function asNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}
