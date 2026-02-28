import { z } from 'zod';

export const PromptMetadataSchema = z.object({
  cluster_id: z.string({ 
    required_error: "cluster_id is required", 
    invalid_type_error: "cluster_id must be a string" 
  }),
  created_at: z.string({ 
    required_error: "created_at is required", 
    invalid_type_error: "created_at must be a string" 
  }),
  updated_at: z.string({ 
    required_error: "updated_at is required", 
    invalid_type_error: "updated_at must be a string" 
  }),
});

export const PromptSchema = z.object({
  id: z.string({ 
    required_error: "id is required", 
    invalid_type_error: "id must be a string" 
  }),
  data: z.string({ 
    required_error: "data is required", 
    invalid_type_error: "data must be a string" 
  }),
  metadata: PromptMetadataSchema.optional(),
});

export const PromptArraySchema = z.array(PromptSchema);