import {
  parseRevalidationContract,
  type NormalizedRevalidationContract,
} from "./contract";

export function adaptLegacyContract(
  payload: unknown,
): NormalizedRevalidationContract {
  const contract = parseRevalidationContract(payload);

  return {
    ...contract,
    contractVersion: "legacy",
  };
}
