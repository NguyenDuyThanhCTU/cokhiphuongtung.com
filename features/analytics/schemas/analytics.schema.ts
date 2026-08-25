import { z } from "zod";

export const visitPayloadSchema = z.object({}).strict();

export const visitResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
