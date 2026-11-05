import { Collection } from "../collections";

export interface DocItem {
  id: string;
  content: string;
}

export interface OverviewInfo {
  total_items: number;
  total_clusters: number;
  total_tags: number;
  top_clusters: Collection[];
  top_tags: Collection[];
}
