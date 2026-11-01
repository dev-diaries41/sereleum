export interface Cluster {
  id: string;
  label: string;
  prototype_size: number;
  mean_similarity: number;
  std_similarity: number;
}

export interface ClusterAccuracy {
  per_label: Record<string, number>
  mean_accuracy: number
}

export interface ClusterOptions {
  autoLabel:boolean; 
  autoMergeThreshold:number;
  defaultThreshold: number
}
