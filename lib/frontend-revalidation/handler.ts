import { NextResponse } from "next/server";
import {
  isFreshTimestamp,
  verifyCredential,
  verifyV2Signature,
} from "./authentication";
import { createV2Acknowledgement } from "./acknowledgement";
import { getFrontendRevalidationConfig } from "./config";
import {
  isHealthCheck,
  isV2RevalidationRequest,
  parseRevalidationContract,
  parseV2RevalidationContract,
} from "./contract";
import { RECEIVER_VERSION } from "./constants";
import { runRevalidationEngine } from "./engine";
import { adaptLegacyContract } from "./legacy-adapter";
import type {
  FrontendRevalidationProtocol,
  FrontendRevalidationRequestV2,
} from "./types";

function jsonResponse(body: unknown, status: number = 200) {
  return NextResponse.json(body, { status });
}

function errorResponse(
  message: string,
  status: number,
  errorCode: string,
  authStage: string,
) {
  return jsonResponse(
    {
      success: false,
      message,
      errorCode,
      authStage,
      receiverVersion: RECEIVER_VERSION,
    },
    status,
  );
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

export function selectRequestProtocol(
  configuredProtocol: FrontendRevalidationProtocol,
  payload: unknown,
): Exclude<FrontendRevalidationProtocol, "dual"> {
  if (configuredProtocol !== "dual") return configuredProtocol;
  return isV2RevalidationRequest(payload) ? "v2" : "legacy";
}

function verifyPublicSiteKey(request: Request, expected?: string) {
  const provided = request.headers.get("x-public-site-key")?.trim();
  return Boolean(expected && provided && verifyCredential(expected, provided));
}

function authenticateV2(
  request: Request,
  exactRawBody: string,
  secret?: string,
) {
  const timestamp = request.headers.get("x-revalidate-timestamp")?.trim();
  const signature = request.headers.get("x-revalidate-signature")?.trim();

  if (!secret || !timestamp || !signature) {
    return {
      ok: false as const,
      response: errorResponse(
        "Thiếu chữ ký revalidation v2.",
        401,
        "missing_revalidation_signature",
        "read_signature_headers",
      ),
    };
  }
  if (!isFreshTimestamp(timestamp)) {
    return {
      ok: false as const,
      response: errorResponse(
        "Yêu cầu revalidation đã hết hạn.",
        401,
        "expired_revalidation_request",
        "verify_timestamp",
      ),
    };
  }
  if (!verifyV2Signature({ timestamp, exactRawBody, secret, signature })) {
    return {
      ok: false as const,
      response: errorResponse(
        "Chữ ký revalidation không hợp lệ.",
        401,
        "signature_mismatch",
        "verify_signature",
      ),
    };
  }
  return { ok: true as const };
}

function authenticateLegacy(request: Request, secret?: string) {
  const provided = request.headers.get("x-revalidate-secret")?.trim();
  if (!secret || !provided || !verifyCredential(secret, provided)) {
    return errorResponse(
      "Legacy revalidation không được xác thực.",
      401,
      "legacy_authentication_failed",
      "verify_legacy_secret",
    );
  }
  return null;
}

function logAccepted(args: {
  protocol: "v2" | "legacy";
  eventId?: string;
  acceptedTagCount: number;
  acceptedPathCount: number;
}) {
  if (process.env.ENABLE_REVALIDATE_DEBUG !== "true") return;
  console.info("[frontend-revalidation]", {
    receiverVersion: RECEIVER_VERSION,
    ...args,
  });
}

async function handleV2(
  request: Request,
  exactRawBody: string,
  payload: unknown,
  secret?: string,
) {
  const authentication = authenticateV2(request, exactRawBody, secret);
  if (!authentication.ok) return authentication.response;

  let v2Request: FrontendRevalidationRequestV2;
  try {
    v2Request = parseV2RevalidationContract(payload);
  } catch {
    return errorResponse(
      "Payload revalidation v2 không hợp lệ.",
      400,
      "invalid_v2_contract",
      "parse_contract",
    );
  }

  const contract = parseRevalidationContract(v2Request);
  const result = isHealthCheck(contract)
    ? null
    : await runRevalidationEngine(contract);
  const acceptedTags = result?.revalidatedTags ?? [];
  const acceptedPaths = result
    ? uniqueStrings([...result.revalidatedPaths, ...result.revalidatedPatterns])
    : [];

  logAccepted({
    protocol: "v2",
    eventId: v2Request.eventId,
    acceptedTagCount: acceptedTags.length,
    acceptedPathCount: acceptedPaths.length,
  });
  return jsonResponse(
    createV2Acknowledgement({
      eventId: v2Request.eventId,
      acceptedTags,
      acceptedPaths,
      layoutRevalidated: result?.layoutRevalidated ?? false,
    }),
  );
}

async function handleLegacy(
  request: Request,
  payload: unknown,
  secret?: string,
) {
  const authenticationError = authenticateLegacy(request, secret);
  if (authenticationError) return authenticationError;

  const contract = adaptLegacyContract(payload);
  const result = isHealthCheck(contract)
    ? null
    : await runRevalidationEngine(contract);
  const acceptedPaths = result
    ? uniqueStrings([...result.revalidatedPaths, ...result.revalidatedPatterns])
    : [];

  logAccepted({
    protocol: "legacy",
    eventId: contract.eventId,
    acceptedTagCount: result?.revalidatedTags.length ?? 0,
    acceptedPathCount: acceptedPaths.length,
  });
  return jsonResponse({
    success: true,
    message: "Đã chấp nhận legacy revalidation.",
    data: {
      receiverVersion: RECEIVER_VERSION,
      contractVersion: "legacy",
      eventId: contract.eventId,
      revalidatedTags: result?.revalidatedTags ?? [],
      revalidatedPaths: acceptedPaths,
      layoutRevalidated: result?.layoutRevalidated ?? false,
      regenerationVerified: false,
      acknowledgementStrength: "weak",
    },
  });
}

export async function handleFrontendRevalidationRequest(request: Request) {
  const exactRawBody = await request.text();
  let payload: unknown;
  try {
    payload = JSON.parse(exactRawBody) as unknown;
  } catch {
    return errorResponse(
      "Payload không phải JSON hợp lệ.",
      400,
      "invalid_json_payload",
      "parse_payload",
    );
  }

  const config = getFrontendRevalidationConfig();
  if (!verifyPublicSiteKey(request, config.publicSiteKey)) {
    return errorResponse(
      "Public site key không hợp lệ.",
      401,
      "invalid_public_site_key",
      "verify_site_key",
    );
  }

  const protocol = selectRequestProtocol(config.protocol, payload);
  if (protocol === "v2")
    return handleV2(request, exactRawBody, payload, config.v2Secret);
  if (!config.legacyEnabled) {
    return errorResponse(
      "Legacy revalidation đang bị tắt.",
      400,
      "legacy_disabled",
      "select_protocol",
    );
  }
  return handleLegacy(request, payload, config.legacySecret);
}
