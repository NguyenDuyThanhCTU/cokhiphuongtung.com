export function unwrapApiData(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const record = payload as Record<string, unknown>;

  if ("data" in record) {
    return record.data;
  }

  return payload;
}

export function asArray(payload: unknown): unknown[] {
  const data = unwrapApiData(payload);

  return Array.isArray(data) ? data : [];
}

export function asObject(payload: unknown): Record<string, unknown> | null {
  const data = unwrapApiData(payload);

  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }

  return null;
}

export function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function emptyStringToUndefined(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  return normalizeString(value);
}

export function emptyStringToNull(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  return normalizeString(value) ?? null;
}
