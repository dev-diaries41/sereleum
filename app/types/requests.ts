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
export const FINISHED_STATUSES = ["completed", "failed"] as const;
export type FinishedStatus = (typeof FINISHED_STATUSES)[number];

export const STATUSES = [
  ...FINISHED_STATUSES,
  "active",
  "delayed",
  "prioritized",
  "waiting",
  "waiting-children",
] as const;

export type Status = (typeof STATUSES)[number];

export interface JobReceipt {
  jobId: string;
  status: Status;
  queue: number;
  createdAt: string;
  delay: number;
  jobName?: string;
}

// HTTP 

export interface PromptsPayload {
  prompts: Prompt[];
}

export interface ClusterIdParam {
  cluster_id: string;
}

export interface AddPromptsRequest extends PromptsPayload {}

export interface AddPromptsResponse extends JobReceipt {}

export interface GetPromptsRequest {
  prompt_ids: string[];
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
