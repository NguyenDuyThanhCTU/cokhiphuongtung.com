import { getServerEnv } from "@/lib/config/env";
import type { FrontendRevalidationProtocol } from "./types";

export type FrontendRevalidationConfig = {
  protocol: FrontendRevalidationProtocol;
  publicSiteKey?: string;
  v2Secret?: string;
  legacySecret?: string;
  legacyEnabled: boolean;
};

export function getFrontendRevalidationConfig(): FrontendRevalidationConfig {
  const env = getServerEnv();
  const protocol = env.FRONTEND_REVALIDATION_PROTOCOL ?? "v2";

  return {
    protocol,
    publicSiteKey: env.PUBLIC_SITE_KEY,
    v2Secret: env.REVALIDATION_SECRET ?? env.FRONTEND_REVALIDATE_SECRET,
    legacySecret: env.FRONTEND_REVALIDATE_SECRET,
    legacyEnabled:
      protocol === "legacy" ||
      protocol === "dual" ||
      env.FRONTEND_REVALIDATE_ALLOW_LEGACY_SECRET === "true",
  };
}
