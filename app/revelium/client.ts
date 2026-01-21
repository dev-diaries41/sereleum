import {
  Prompt,
  PromptsOverviewInfo,
  AddPromptsRequest,
  GetPromptsRequest,
  AddPromptsResponse,
  UpdateLabelParams,
  Cluster,
  ClusterAccuracy,
  UpdatePromptClusterIdParams,
  QueryPromptsRequest,
  ClusterMetadata,
} from "@/app/types";
import { ADD_PROMPTS_ENDPOINT, ADD_PROMPTS_FILE_ENDPOINT, BASE_CLUSTER_ENDPOINT, COUNT_CLUSTER_ENDPOINT, GET_LABELS_ENDPOINT, COUNT_PROMPTS_ENDPOINT, BASE_PROMPTS_ENDPOINT, GET_PROMPTS_OVERVIEW_ENDPOINT, REVELIUM_BASE_URL, START_CLUSTER_ENDPOINT, CALC_CLUSTER_ACCURACY_ENDPOINT, GET_CLUSTER_PLOT_ENDPOINT, SSE_PROMPTS_INDEX_PROGRESS, QUERY_PROMPTS_ENDPOINT, GET_TOP_CLUSTERS_ENDPOINT } from "./constants";

export class ReveliumClient {
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
    const url = `${this.baseUrl}${ADD_PROMPTS_ENDPOINT}`;
    const payload: AddPromptsRequest = { prompts };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return this.handleResponse(res);
  }

  async addPromptsFile(file: File): Promise<AddPromptsResponse> {
    const url = `${this.baseUrl}${ADD_PROMPTS_FILE_ENDPOINT}`;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    return this.handleResponse(res);
  }

  async getPrompts(ids?: string[], limit?: number, offset?: number, clusterId?: string): Promise<Prompt[]> {
    const url = `${this.baseUrl}${BASE_PROMPTS_ENDPOINT}`;
    const payload: GetPromptsRequest = { 
      prompt_ids: ids,
      cluster_id: clusterId,
      limit: limit, 
      offset: offset
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<{ prompts: Prompt[] }>(res);
    return data.prompts ?? [];
  }

  async queryPrompts(query: string, limit?: number, clusterId?: string): Promise<Prompt[]> {
    const url = `${this.baseUrl}${QUERY_PROMPTS_ENDPOINT}`;
    const payload: QueryPromptsRequest = { 
      query,
      cluster_id: clusterId,
      limit: limit, 
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<{ prompts: Prompt[] }>(res);
    return data.prompts ?? [];
  }

  async getPromptsOverview(): Promise<PromptsOverviewInfo> {
    const url = `${this.baseUrl}${GET_PROMPTS_OVERVIEW_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    return this.handleResponse(res);
  }

  async clusterPrompts(): Promise<Record<string, unknown>> {
    const url = `${this.baseUrl}${START_CLUSTER_ENDPOINT}`;
    const res = await fetch(url, { method: "POST" });
    return this.handleResponse(res);
  }


  async updatePromptClusterId( promptId: string, clusterId: string): Promise<string> {
    const payload: UpdatePromptClusterIdParams = { cluster_id: clusterId, prompt_id: promptId };
         
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [key, String(value)])
      )
    );
    const url = `${this.baseUrl}${BASE_PROMPTS_ENDPOINT}?${params.toString()}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    const data = await this.handleResponse<{ updated_label: string }>(res);
    return data.updated_label;
  }

  async getClusters(clusterId: string | null = null, offset: number | null = null, limit: number | null = null): Promise<Omit<Cluster, "embedding">[]> {
      const query = { 
        clusterId: clusterId || "",
        offset: offset || 0, 
        limit: limit  || 50
      };
      
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(query).map(([key, value]) => [key, String(value)])
      )
    );
    const url = `${this.baseUrl}${BASE_CLUSTER_ENDPOINT}?${params.toString()}`;
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<Record<"clusters", Omit<Cluster, "embedding">[]>>(res);
    return data.clusters;
  }

  async getTopClusters(): Promise<Omit<Cluster, "embedding">[]> {    
    const url = `${this.baseUrl}${GET_TOP_CLUSTERS_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<Record<"clusters", Omit<Cluster, "embedding">[]>>(res);
    return data.clusters;
  }

  async countPrompts(): Promise<number> {
    const url = `${this.baseUrl}${COUNT_PROMPTS_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ count?: number }>(res);
    return data.count ?? 0;
  }

  async countClusters(): Promise<number> {
    const url = `${this.baseUrl}${COUNT_CLUSTER_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ count?: number }>(res);
    return data.count ?? 0;
  }

  async getExistingLabels(): Promise<string[]> {
    const url = `${this.baseUrl}${GET_LABELS_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ labels?: string[] }>(res);
    return data.labels ?? [];
  }

  async updateClusterLabel(clusterId: string, label: string): Promise<string> {
    const payload: UpdateLabelParams = { cluster_id: clusterId, label };
         
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [key, String(value)])
      )
    );
    const url = `${this.baseUrl}${BASE_CLUSTER_ENDPOINT}?${params.toString()}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    const data = await this.handleResponse<{ updated_label?: string }>(res);
    return data.updated_label ?? "";
  }

  async calculateClusterAccuracy(): Promise<ClusterAccuracy> {
    const url = `${this.baseUrl}${CALC_CLUSTER_ACCURACY_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });

    const data = await this.handleResponse<{ accuracy: ClusterAccuracy }>(res);
    return data.accuracy;
  }

 async getClusterPlotBlob(
  method: "tsne" | "pca" = "tsne"
): Promise<Blob | null> {
  const url = `${this.baseUrl}${GET_CLUSTER_PLOT_ENDPOINT}?method=${method}`;
  const res = await fetch(url);

  if (res.status === 204) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const blob = await res.blob();
  return blob.size === 0 ? null : blob;
}

trackPromptsIndexProgress(
  jobId: string,
  {
    onProgress,
    onFail,
    onActive,
    onOpen,
    onError,
    onComplete,
  }: {
    onProgress: (progress: number) => void;
    onFail?: (error: string) => void;
    onActive?: () => void;
    onOpen?: () => void;
    onError?: (err: unknown) => void;
    onComplete?: () => void;
  }
): EventSource {
  const url = `${this.baseUrl}/${SSE_PROMPTS_INDEX_PROGRESS}?job_id=${encodeURIComponent(
      jobId
    )}`;
  const es = new EventSource(url);

  es.onopen = () => {
    onOpen?.();
  };

  es.addEventListener("progress", (ev: MessageEvent) => {
    try {
      const payload = JSON.parse(ev.data);
      onProgress(Number(payload.progress));
    } catch (err) {
      onError?.(err);
    }
  });

  es.addEventListener("active", () => {
    onActive?.();
  });

  es.addEventListener("complete", () => {
    onComplete?.();
    es.close();
  });

  es.addEventListener("failed", (ev: MessageEvent) => {
    try {
      const payload = JSON.parse(ev.data);
      onFail?.(String(payload.error));
    } catch (err) {
      onError?.(err);
    } finally {
      es.close();
    }
  });

  es.onerror = (ev: Event | any) => {
    onError?.(ev);
  };

  return es;
  }


  
}


export const reveliumClient = new ReveliumClient()