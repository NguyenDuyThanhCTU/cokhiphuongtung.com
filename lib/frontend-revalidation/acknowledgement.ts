import {
  FRONTEND_REVALIDATION_ACK_VERSION,
  FRONTEND_REVALIDATION_CONTRACT_VERSION,
  RECEIVER_VERSION,
} from "./constants";
import type { FrontendRevalidationAckV2 } from "./types";

export function createV2Acknowledgement(args: {
  eventId: string;
  acceptedTags: string[];
  acceptedPaths: string[];
  layoutRevalidated: boolean;
}): FrontendRevalidationAckV2 {
  return {
    success: true,
    status: "accepted",
    eventId: args.eventId,
    contractVersion: FRONTEND_REVALIDATION_CONTRACT_VERSION,
    ackVersion: FRONTEND_REVALIDATION_ACK_VERSION,
    receiverVersion: RECEIVER_VERSION,
    acceptedTags: args.acceptedTags,
    acceptedPaths: args.acceptedPaths,
    layoutRevalidated: args.layoutRevalidated,
    regenerationVerified: false,
    errors: [],
  };
}
