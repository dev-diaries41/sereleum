
import { DocItem, OverviewInfo } from "./item";

export interface Prompt extends DocItem {
    created_at: string;
    updated_at: string;
    tokens: number
}

export interface PromptsOverviewInfo extends OverviewInfo {
  top_cluster_token_counts: Record<string , number>;
}
