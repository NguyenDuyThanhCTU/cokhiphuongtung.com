import { createHmac, timingSafeEqual } from "crypto";
import { TIMESTAMP_TOLERANCE_MS } from "./constants";

function safeEqual(left: string, right: string, encoding: BufferEncoding) {
  const leftBuffer = Buffer.from(left, encoding);
  const rightBuffer = Buffer.from(right, encoding);

  return (
    leftBuffer.length > 0 &&
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function normalizeSignature(signature: string): string {
  return signature
    .trim()
    .replace(/^sha256=/i, "")
    .toLowerCase();
}

export function createV2Signature(
  timestamp: string,
  exactRawBody: string,
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${exactRawBody}`)
    .digest("hex");
}

export function isFreshTimestamp(
  value: string,
  now: number = Date.now(),
): boolean {
  const timestamp = Number(value);

  return (
    Number.isFinite(timestamp) &&
    Math.abs(now - timestamp) <= TIMESTAMP_TOLERANCE_MS
  );
}

export function verifyV2Signature(args: {
  timestamp: string;
  exactRawBody: string;
  secret: string;
  signature: string;
}): boolean {
  const expected = createV2Signature(
    args.timestamp,
    args.exactRawBody,
    args.secret,
  );
  return safeEqual(expected, normalizeSignature(args.signature), "hex");
}

export function verifyCredential(expected: string, provided: string): boolean {
  return safeEqual(expected, provided, "utf8");
}
