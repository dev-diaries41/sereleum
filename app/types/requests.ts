import { Cluster, DocItem, OverviewInfo, Prompt, PromptsOverviewInfo } from "@/app/types";
import { CollectionId } from "./collections";

// WebSockets / SSE 

export interface ActiveMessage {
  type: "active";
}

export interface ProgressMessage {
  type: "progress";
  progress: number;
}

export interface ErrorMessage {
  type: "error";
  error: string;
  item: string;
}

export interface FailMessage {
  type: "fail";
  error: string;
}

export interface CompleteMessage {
  type: "complete";
  total_processed: number;
  time_elapsed: number;
}

export type SocketMessage =
  | ActiveMessage
  | ProgressMessage
  | ErrorMessage
  | FailMessage
  | CompleteMessage;

//Long-running jobs
export const FINISHED_STATUSES = ["complete", "failed"] as const;
export type FinishedStatus = (typeof FINISHED_STATUSES)[number];

export const STATUSES = [
  ...FINISHED_STATUSES,
  "active",
  "queued",
] as const;

export type Status = (typeof STATUSES)[number];

export interface JobReceipt {
  job_id: string;
  status: Status;
}


export interface IndexItemsResponse extends JobReceipt {}

export interface GetItemsRequest {
  cluster_ids?: string[];
  limit?: number;
  offset?: number
}

export interface GetItemsByIdsRequest {
  item_ids?: string[];
}

export interface QueryItemsRequest {
  query: string;
  cluster_ids?: string[];
  limit?: number;
}

export interface GetItemsResponse<T extends DocItem> {
    items: T[];
}

export interface GetCountResponse {
  count: number;
}

export interface GetLabelsResponse {
  labels: string[];
}

export interface GetOverviewResponse extends OverviewInfo {}

export interface RenameClusterRequest {
  cluster_id: string
  label: string;
}

export interface RenameClusterResponse {
  updated_label: string
}

export interface MoveItemRequest {
  cluster_id: string
  id: string;
}

export interface MoveItemResponse {
  updated_cluster_id: string
}

export interface MergeRequest {
  primary_collection_id: CollectionId
  secondary_collection_ids: List[CollectionId]
}




export interface MergeClustersResponse {
  updated_clusters: Cluster[];
}

export interface GetClustersRequest {
  cluster_id?: string;
  limit?: number;
  offset?: number
}

export interface GetClustersReponse {
  clusters: Cluster[];
}