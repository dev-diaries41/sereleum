import {
  GetItemsRequest,
  IndexItemsResponse,
  RenameClusterRequest,
  Cluster,
  MoveItemRequest,
  QueryItemsRequest,
  MergeClustersRequest,
  ClusterOptions,
  GetItemsByIdsRequest,
  GetItemsResponse,
  GetOverviewResponse,
  RenameClusterResponse,
  MoveItemResponse,
  JobReceipt,
  GetClustersRequest,
  GetClustersReponse,
  GetCountResponse,
  MergeClustersResponse,
  DocItem,
  OverviewInfo,
} from "@/app/types";
import * as APIRoutes from "@/app/constants/api";

export class SereleumApiClient<T extends DocItem = DocItem> {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/sereleum") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    return res.json();
  }

  async indexItems(file: File, clusterOptions?: Partial<ClusterOptions>): Promise<JobReceipt> {
    const url = `${this.baseUrl}${APIRoutes.INDEX_FILE_ENDPOINT}`;
    const formData = new FormData();

    const defaultOptions: ClusterOptions = {"autoLabel": false, "autoMergeThreshold": 0.9, "defaultThreshold": 0.3}
    const options = {...defaultOptions, ...(clusterOptions || {})}
    formData.append("file", file);
    formData.append("auto_label", String(options.autoLabel))
    formData.append("auto_merge_threshold", String(options.autoMergeThreshold))
    formData.append("initial_threshold", String(options.defaultThreshold))

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    return this.handleResponse<IndexItemsResponse>(res);
  }

  async getItems(limit?: number, offset?: number, clusterIds?: string[]): Promise<T[]> {
    const url = `${this.baseUrl}${APIRoutes.BASE_ITEMS_ENDPOINT}`;
    const payload: GetItemsRequest = { 
      cluster_ids: clusterIds,
      limit: limit, 
      offset: offset
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<GetItemsResponse<T>>(res);
    return data.items;
  }

  async getItemsById(ids: string[]): Promise<T[]> {
    const url = `${this.baseUrl}${APIRoutes.BASE_ITEMS_ENDPOINT}`;
    const payload: GetItemsByIdsRequest = { 
      item_ids: ids,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<GetItemsResponse<T>>(res);
    return data.items;
  }

  async queryItems(query: string, limit?: number, clusterIds?: string[]): Promise<T[]> {
    const url = `${this.baseUrl}${APIRoutes.QUERY_ITEMS_ENDPOINT}`;
    const payload: QueryItemsRequest = { 
      query,
      cluster_ids: clusterIds,
      limit: limit, 
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<GetItemsResponse<T>>(res);
    return data.items;
  }

  async getOverview(): Promise<OverviewInfo> {
    const url = `${this.baseUrl}${APIRoutes.GET_OVERVIEW_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    return this.handleResponse<GetOverviewResponse>(res);
  }

  async moveItem( ItemId: string, clusterId: string): Promise<string> {
    const payload: MoveItemRequest = { cluster_id: clusterId, id: ItemId };
         
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [key, String(value)])
      )
    );
    const url = `${this.baseUrl}${APIRoutes.BASE_ITEMS_ENDPOINT}?${params.toString()}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    const data = await this.handleResponse<MoveItemResponse>(res);
    return data.updated_cluster_id;
  }

  async getClusters(clusterId?: string, offset: number = 0, limit: number = 25): Promise<Cluster[]> {
      const query: GetClustersRequest = { 
        cluster_id: clusterId || "",
        offset: offset, 
        limit: limit
      };
      
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(query).map(([key, value]) => [key, String(value)])
      )
    );
    const url = `${this.baseUrl}${APIRoutes.BASE_CLUSTER_ENDPOINT}?${params.toString()}`;
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<GetClustersReponse>(res);
    return data.clusters;
  }


  async countItems(): Promise<number> {
    const url = `${this.baseUrl}${APIRoutes.COUNT_ITEMS_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<GetCountResponse>(res);
    return data.count;
  }

  async countClusters(): Promise<number> {
    const url = `${this.baseUrl}${APIRoutes.COUNT_CLUSTER_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<GetCountResponse>(res);
    return data.count;
  }

  async renameCluster(clusterId: string, label: string): Promise<string> {
    const payload: RenameClusterRequest = { cluster_id: clusterId, label };
         
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [key, String(value)])
      )
    );
    const url = `${this.baseUrl}${APIRoutes.BASE_CLUSTER_ENDPOINT}?${params.toString()}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    const data = await this.handleResponse<RenameClusterResponse>(res);
    return data.updated_label;
  }


 async getClusterPlotBlob(
  method: "tsne" | "pca" = "tsne"
): Promise<Blob | null> {
  const url = `${this.baseUrl}${APIRoutes.GET_CLUSTER_PLOT_ENDPOINT}?method=${method}`;
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

  async mergeClusters(merges: Record<string, string[]>): Promise<Cluster[]> {
    const url = `${this.baseUrl}${APIRoutes.MERGE_CLUSTERS_ENDPOINT}`;
    const payload: MergeClustersRequest = { 
      merges,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<MergeClustersResponse>(res);
    return data.updated_clusters
  }

}