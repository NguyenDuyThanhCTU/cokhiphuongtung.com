import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url("NEXT_PUBLIC_API_BASE_URL must be a valid URL."),
  NEXT_PUBLIC_SITE_KEY: z.string().min(1, "NEXT_PUBLIC_SITE_KEY is required."),
});

const serverEnvSchema = z.object({
  API_BASE_URL: z.string().url().optional(),
  PUBLIC_SITE_KEY: z.string().min(1).optional(),
  REVALIDATION_SECRET: z.string().min(1).optional(),
  FRONTEND_REVALIDATE_SECRET: z.string().min(1).optional(),
  FRONTEND_REVALIDATION_PROTOCOL: z.enum(["v2", "legacy", "dual"]).optional(),
  FRONTEND_REVALIDATE_ALLOW_LEGACY_SECRET: z.string().optional(),
  ENABLE_REVALIDATE_DEBUG: z.string().optional(),
  ENABLE_SITE_SETTINGS_DEBUG: z.string().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function formatEnvError(error: z.ZodError): Error {
  const message = error.issues.map((issue) => issue.message).join(" ");
  return new Error(`Invalid environment configuration. ${message}`);
}

export function getPublicEnv(): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL:
      process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_KEY:
      process.env.PUBLIC_SITE_KEY ?? process.env.NEXT_PUBLIC_SITE_KEY,
  });

  if (!result.success) {
    throw formatEnvError(result.error);
  }

  return result.data;
}

export function getServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse({
    API_BASE_URL:
      process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
    PUBLIC_SITE_KEY:
      process.env.PUBLIC_SITE_KEY ?? process.env.NEXT_PUBLIC_SITE_KEY,
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
    FRONTEND_REVALIDATE_SECRET: process.env.FRONTEND_REVALIDATE_SECRET,
    FRONTEND_REVALIDATION_PROTOCOL: process.env.FRONTEND_REVALIDATION_PROTOCOL,
    FRONTEND_REVALIDATE_ALLOW_LEGACY_SECRET:
      process.env.FRONTEND_REVALIDATE_ALLOW_LEGACY_SECRET,
    ENABLE_REVALIDATE_DEBUG: process.env.ENABLE_REVALIDATE_DEBUG,
    ENABLE_SITE_SETTINGS_DEBUG: process.env.ENABLE_SITE_SETTINGS_DEBUG,
  });

  if (!result.success) {
    throw formatEnvError(result.error);
  }

  return result.data;
}
