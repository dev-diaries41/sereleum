// types.ts

export interface PromptMetadata {
  cluster_id: string | typeof UNCLUSTERED;
  created_at: string;
  updated_at: string;
}

export const createPromptMetadata = (): PromptMetadata => {
  const now = new Date().toISOString();
  return {
    cluster_id: "unclustered",
    created_at: now,
    updated_at: now,
  };
};

export interface Prompt {
  prompt_id: string;
  content: string;
  metadata: PromptMetadata;
}

export interface PromptsOverviewInfo {
  total_prompts: number;
  total_clusters: number;
  average_prompt_cost: number;
}

export interface ClusterMetrics {
  prototype_size: number;
  mean_similarity: number;
  nearest_other_similarity?: number | null;
  separation_margin?: number | null;
}

export interface ClusterMetadata extends ClusterMetrics {
  label: string;
}

export interface Cluster {
  prototype_id: string;
  embedding: number[]; // ndarray equivalent
  metadata: ClusterMetadata;
  label: string;
}

export const UNLABELLED_CLUSTER = "unlabelled";
export const UNCLUSTERED = "unclustered"; // TODO: lower case

export interface ClusterAccuracy {
  per_label: Record<string, number>
  mean_accuracy: number

}