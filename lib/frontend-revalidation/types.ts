import type { FRONTEND_REVALIDATION_CONTRACT_VERSION } from "./constants";

export type FrontendRevalidationProtocol = "v2" | "legacy" | "dual";

export type FrontendRevalidationRequestV2 = {
  eventId: string;
  websiteId: string;
  event: string;
  module: string;
  paths: string[];
  tags: string[];
  scopes: string[];
  source: "dashboard-admin";
  timestamp: string;
  meta: {
    contractVersion: typeof FRONTEND_REVALIDATION_CONTRACT_VERSION;
    entityType?: string;
    operation?: string;
    slug?: string;
    oldSlug?: string;
    newSlug?: string;
    legacyPaths?: string[];
    affectedScopes?: string[];
    dedupeKey?: string;
    entityId?: string;
    entityRevision?: string;
    [key: string]: unknown;
  };
};

export type FrontendRevalidationAckV2 = {
  success: true;
  status: "accepted";
  eventId: string;
  contractVersion: typeof FRONTEND_REVALIDATION_CONTRACT_VERSION;
  ackVersion: "frontend-revalidation-ack-v1";
  receiverVersion: string;
  acceptedTags: string[];
  acceptedPaths: string[];
  layoutRevalidated: boolean;
  regenerationVerified: false;
  errors: [];
};
