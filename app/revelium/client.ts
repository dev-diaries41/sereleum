import {
  Prompt,
  PromptsOverviewInfo,
  ClusterMetadata,
  AddPromptsRequest,
  GetPromptsRequest,
  ClusterIdParam,
  AddPromptsResponse,
} from "@/app/types"; // adjust import paths to match your project
import { REVELIUM_BASE_URL } from "../constants/requests";

export class ReveliumClient {
  static ADD_PROMPTS_ENDPOINT = "/api/prompts/add";
  static ADD_PROMPTS_FILE_ENDPOINT = "/api/prompts/add/file";
  static GET_PROMPTS_ENDPOINT = "/api/prompts";
  static GET_PROMPTS_OVERVIEW_ENDPOINT = "/api/prompts/overview";
  static BASE_CLUSTER_ENDPOINT = "/api/clusters";
  static GET_CLUSTER_META_ENDPOINT = "/api/clusters/metadata";
  static GET_CLUSTER_META_BATCH_ENDPOINT = "/api/clusters/metadata/batch";
  static GET_PROMPTS_COUNT_ENDPOINT = "/api/prompts/count";
  static GET_CLUSTER_COUNT_ENDPOINT = "/api/clusters/count";
  static GET_LABELS_ENDPOINT = "/api/labels";

  private baseUrl: string;

  constructor(baseUrl: string = REVELIUM_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    return res.json();
  }

  async addPrompts(prompts: Prompt[]): Promise<AddPromptsResponse> {
    const url = `${this.baseUrl}${ReveliumClient.ADD_PROMPTS_ENDPOINT}`;
    const payload: AddPromptsRequest = { prompts };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return this.handleResponse(res);
  }

  async addPromptsFile(file: File): Promise<AddPromptsResponse> {
    const url = `${this.baseUrl}${ReveliumClient.ADD_PROMPTS_FILE_ENDPOINT}`;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    return this.handleResponse(res);
  }

  async getPrompts(ids: string[]): Promise<Prompt[]> {
    const url = `${this.baseUrl}${ReveliumClient.GET_PROMPTS_ENDPOINT}`;
    const payload: GetPromptsRequest = { prompt_ids: ids };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<{ prompts: Prompt[] }>(res);
    return data.prompts ?? [];
  }

  async getPromptsOverview(): Promise<PromptsOverviewInfo> {
    const url = `${this.baseUrl}${ReveliumClient.GET_PROMPTS_OVERVIEW_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    return this.handleResponse(res);
  }

  async clusterPrompts(): Promise<Record<string, unknown>> {
    const url = `${this.baseUrl}${ReveliumClient.BASE_CLUSTER_ENDPOINT}`;
    const res = await fetch(url, { method: "POST" });
    return this.handleResponse(res);
  }

  async getClusterMetadata(
    clusterId: string
  ): Promise<ClusterMetadata | null> {
    const url = `${this.baseUrl}${ReveliumClient.GET_CLUSTER_META_ENDPOINT}`;
    const params: ClusterIdParam = { cluster_id: clusterId };

    const query = new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {}
      )
    );

    const res = await fetch(`${url}?${query.toString()}`, {
      method: "GET",
    });

    const data = await this.handleResponse<{ metadata?: ClusterMetadata }>(res);
    return data.metadata ?? null;
  }

  async getClusterMetadataBatch(): Promise<ClusterMetadata[] | null> {
    const url = `${this.baseUrl}${ReveliumClient.GET_CLUSTER_META_BATCH_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ metadatas?: ClusterMetadata[] }>(
      res
    );
    return data.metadatas ?? null;
  }

  async countPrompts(): Promise<number> {
    const url = `${this.baseUrl}${ReveliumClient.GET_PROMPTS_COUNT_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ count?: number }>(res);
    return data.count ?? 0;
  }

  async countClusters(): Promise<number> {
    const url = `${this.baseUrl}${ReveliumClient.GET_CLUSTER_COUNT_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ count?: number }>(res);
    return data.count ?? 0;
  }

  async getExistingLabels(): Promise<string[]> {
    const url = `${this.baseUrl}${ReveliumClient.GET_LABELS_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ labels?: string[] }>(res);
    return data.labels ?? [];
  }
}


export const reveliumClient = new ReveliumClient()