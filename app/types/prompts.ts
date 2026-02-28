export interface PromptMetadata {
  cluster_id: string;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  data: string;
  metadata: PromptMetadata;
}

export interface PromptsOverviewInfo {
  total_prompts: number;
  total_clusters: number;
  top_clusters: Cluster[];
  top_cluster_token_counts: Record<string , number>;
}

export interface ClusterMetrics {
  prototype_size: number;
  mean_similarity: number;
  std_similarity: number;
}

export interface ClusterMetadata extends ClusterMetrics {
  label: string;
}

//Embedding omitted
export interface Cluster {
  prototype_id: string;
  metadata: ClusterMetadata;
  label: string;
}

export const UNLABELLED_CLUSTER = "unlabelled";
export const UNCLUSTERED = "unclustered"; 

export interface ClusterAccuracy {
  per_label: Record<string, number>
  mean_accuracy: number
}

export interface ClusterOptions {
  autoLabel:boolean; 
  autoMergeThreshold:number;
  defaultThreshold: number
}
