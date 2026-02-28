import { z } from 'zod';

export const PromptMetadataSchema = z.object({
  cluster_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PromptSchema = z.object({
  id: z.string(),
  data: z.string(),
  metadata: PromptMetadataSchema.optional(),
});

export const PromptArraySchema = z.array(PromptSchema);
