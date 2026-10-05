import { getServerEnv } from "@/lib/config/env";
import type { FrontendRevalidationProtocol } from "./types";

export type FrontendRevalidationConfig = {
  protocol: FrontendRevalidationProtocol;
  publicSiteKey?: string;
  v2Secrets: string[];
  legacySecret?: string;
  legacyEnabled: boolean;
};

function uniqueSecrets(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export function getFrontendRevalidationConfig(): FrontendRevalidationConfig {
  const env = getServerEnv();
  const protocol = env.FRONTEND_REVALIDATION_PROTOCOL ?? "v2";

  return {
    protocol,
    publicSiteKey: env.PUBLIC_SITE_KEY,
    // Keep both names valid during key rotation. Some deployments already have
    // REVALIDATION_SECRET while the Dashboard still signs with the compatibility
    // FRONTEND_REVALIDATE_SECRET value.
    v2Secrets: uniqueSecrets([
      env.REVALIDATION_SECRET,
      env.FRONTEND_REVALIDATE_SECRET,
    ]),
    legacySecret: env.FRONTEND_REVALIDATE_SECRET,
    legacyEnabled:
      protocol === "legacy" ||
      protocol === "dual" ||
      env.FRONTEND_REVALIDATE_ALLOW_LEGACY_SECRET === "true",
  };
}
