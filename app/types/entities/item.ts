import { Cluster } from "../cluster";

export interface DocItem {
  id: string;
  content: string;
}

export interface OverviewInfo {
  total_items: number;
  total_clusters: number;
  top_clusters: Cluster[];
}
