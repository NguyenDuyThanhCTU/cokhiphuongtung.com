import { z } from "zod";

export const idSchema = z.string().min(1);
export const urlSchema = z.string().url();
export const nullableUrlSchema = z.preprocess((value) => {
  if (value == null) return value;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.string().min(1).nullable().optional());
export const isoDateStringSchema = z.string().min(1);
export const optionalStringSchema = z.preprocess((value) => {
  if (value === undefined) return value;
  if (value === null) return null;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}, z.string().min(1).nullable().optional());

export const keywordsSchema = z.preprocess(
  (value) => {
    if (value == null) return undefined;

    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) return undefined;

      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value;
  },
  z.array(z.string().min(1)).optional(),
);

export const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
};
