import { z } from "zod";

export function emptyStringToUndefined(value: unknown) {
  if (value === null) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  return value;
}

export function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

export function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

export const optionalStringSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().optional(),
);

export const nullableStringSchema = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") return null;
  if (value === undefined) return null;
  return value;
}, z.string().nullable());

export const optionalUrlTextSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().optional(),
);
