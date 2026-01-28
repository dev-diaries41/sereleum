import { Prompt, PromptsOverviewInfo , ClusterMetadata } from "@/app/types";

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

// HTTP 

export interface PromptsPayload {
  prompts: Prompt[];
}


export interface AddPromptsRequest extends PromptsPayload {}

export interface AddPromptsResponse extends JobReceipt {}

export interface GetPromptsRequest {
  prompt_ids?: string[];
  cluster_ids?: string[];
  limit?: number;
  offset?: number
}

export interface QueryPromptsRequest {
  query: string;
  cluster_ids?: string[];
  limit?: number;
}

export interface GetPromptsResponse extends PromptsPayload {}

export interface GetCountResponse {
  count: number;
}

export interface GetLabelsResponse {
  labels: string[];
}

export interface GetClusterMetadataResponse {
  metadata?: ClusterMetadata | null;
}

export interface GetClusterMetadataBatchResponse {
  metadatas?: ClusterMetadata[] | null;
}

export interface GetPromptsOverviewResponse extends PromptsOverviewInfo {}

export interface UpdateLabelParams {
  cluster_id: string
  label: string;
}

export interface UpdatePromptClusterIdParams {
  cluster_id: string
  prompt_id: string;
}


export interface MergeClustersRequest {
  merges: Record<string, string[]>;
}