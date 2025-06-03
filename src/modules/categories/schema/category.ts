import { z } from "zod";

export const getCategoryQuerySchema = z.object({
  nested: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  parentId: z.string().uuid().optional(),
});
