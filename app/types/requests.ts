import { Cluster, DocItem, OverviewInfo, Prompt, PromptsOverviewInfo } from "@/app/types";
import { Collection, CollectionId } from "./collections";
import { CollectionType } from "../enums/collections";

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
  tag_ids?: CollectionId[];
  cluster_ids?: CollectionId[];
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

export interface RenameCollectionRequest {
  collection_id: CollectionId
  name: string;
}

export interface MoveItemsRequest {
  destination_collection_id: CollectionId;
  source_collection_id: CollectionId;
  item_ids: string[];
  excluded_item_ids:string[];
  select_all: boolean;
}

export interface MergeCollectionsRequest {
  primary_collection_id: CollectionId;
  secondary_collection_ids: CollectionId[];
}

export interface MergeCollectionsResponse<T extends CollectionType = CollectionType>  {
  merged_collection: Collection<T>;
}

export interface GetCollectionsRequest {
  collection_id?: CollectionId
  limit?: number;
  offset?: number;
}

export interface GetCollectionsReponse<T extends CollectionType = CollectionType> {
  collections: Collection<T>[];
}

export interface TagRequest {
  tag: string;
  item_ids: string[];
  excluded_item_ids: string[];
  select_all: boolean;
  collection_id: CollectionId;
}

export interface DeleteCollectionsRequest {
  collection_ids: CollectionId[];
}

export interface RemoveTagRequest {
  tag_id: number;
  item_ids: string[];
  excluded_item_ids: string[];
  select_all: boolean;
}

export interface CreateClusterRequest {
  name: string;
  seed: string;
}

export interface CreateClusterResponse {
  cluster_id: string;
}