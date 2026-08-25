import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { cacheTags } from "@/lib/cache/cache-tags";
import { getServerEnv } from "@/lib/config/env";
import { getPublicSiteSettings } from "@/features/site/services/site.service";
import { getPrimaryHotline } from "@/features/site/utils/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEBUG_VERSION = "site-settings-debug-v1";

function shortHash(value: string | null | undefined): string | null {
  if (!value) return null;

  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function maskPhone(value: string | null | undefined): string | null {
  if (!value) return null;

  const normalized = value.replace(/\s+/g, "");
  if (normalized.length <= 6) return "***";

  return `${normalized.slice(0, 3)}***${normalized.slice(-3)}`;
}

export async function GET() {
  if (process.env.ENABLE_SITE_SETTINGS_DEBUG !== "true") {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const { API_BASE_URL, PUBLIC_SITE_KEY } = getServerEnv();

  try {
    const settings = await getPublicSiteSettings();
    const primaryHotline = getPrimaryHotline(settings);

    return NextResponse.json({
      success: true,
      data: {
        receiverVersion: DEBUG_VERSION,
        apiBaseUrl: API_BASE_URL ?? null,
        siteKeyHash: shortHash(PUBLIC_SITE_KEY),
        cacheTags: [cacheTags.site, cacheTags.settings],
        normalized: {
          hasSettings: true,
          hotlineHash: shortHash(settings.hotline),
          contactHotlineHash: shortHash(settings.contact?.hotline),
          hotlineMasked: maskPhone(primaryHotline),
        },
        renderHints: {
          usesNextDataCache: true,
          noStoreUsed: false,
        },
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải cấu hình website.",
        data: {
          receiverVersion: DEBUG_VERSION,
          apiBaseUrl: API_BASE_URL ?? null,
          siteKeyHash: shortHash(PUBLIC_SITE_KEY),
          cacheTags: [cacheTags.site, cacheTags.settings],
          normalized: {
            hasSettings: false,
            hotlineHash: null,
            contactHotlineHash: null,
            hotlineMasked: null,
          },
          renderHints: {
            usesNextDataCache: true,
            noStoreUsed: false,
          },
        },
      },
      { status: 500 },
    );
  }
}
