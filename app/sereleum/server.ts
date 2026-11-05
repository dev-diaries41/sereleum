import {
  GetItemsRequest,
  IndexItemsResponse,
  QueryItemsRequest,
  ClusterOptions,
  GetItemsByIdsRequest,
  GetItemsResponse,
  GetOverviewResponse,
  JobReceipt,
  GetCountResponse,
  DocItem,
  OverviewInfo,
  MergeCollectionsRequest,
  MergeCollectionsResponse,
  Collection,
  RenameCollectionRequest,
  CollectionId,
  GetCollectionsRequest,
  GetCollectionsReponse,
  MoveItemsRequest,
} from "@/app/types";
import * as APIRoutes from "@/app/sereleum/routes";
import { CollectionType } from "../enums/collections";

export class SereleumApiClient<T extends DocItem = DocItem> {
  private baseUrl: string;

  constructor(baseUrl: string) {
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

  async getItems(type: CollectionType.TAG, collectionIds?: number[], limit?: number, offset?: number): Promise<T[]>
  async getItems(type: CollectionType.CLUSTER, collectionIds?: string[], limit?: number, offset?: number): Promise<T[]>
  async getItems(type: CollectionType, collectionIds?: CollectionId[], limit?: number, offset?: number): Promise<T[]> {
    const url = `${this.baseUrl}${APIRoutes.BASE_ITEMS_ENDPOINT}`;
    const payload: GetItemsRequest = { 
      limit: limit, 
      offset: offset
    };
    if(type == CollectionType.CLUSTER){
      payload.cluster_ids = collectionIds
    }else{
      payload.tag_ids = collectionIds
    }
  
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

  async queryItems(query: string, limit?: number): Promise<T[]> {
    const url = `${this.baseUrl}${APIRoutes.QUERY_ITEMS_ENDPOINT}`;
    const payload: QueryItemsRequest = { 
      query,
      limit, 
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

  async moveItems(itemIds: string[], newColletionId: string, type: CollectionType.CLUSTER): Promise<void>;
  async moveItems(itemIds: string[], newColletionId: number, type: CollectionType.TAG, currentCollectionId: number): Promise<void>;
  async moveItems(itemIds: string[], newColletionId: CollectionId, type: CollectionType, currentCollectionId?: CollectionId): Promise<void> {
    const payload: MoveItemsRequest = { 
      new_collection_id: newColletionId,
      item_ids: itemIds 
    };
    if(currentCollectionId){
      payload.current_collection_id = currentCollectionId
    }
         
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [key, String(value)])
      )
    );
    const url = type === CollectionType.TAG? 
      `${this.baseUrl}${APIRoutes.MOVE_TAG_ITEMS_ENDPOINT}?${params.toString()}`:
      `${this.baseUrl}${APIRoutes.MOVE_CLUSTER_ITEMS_ENDPOINT}?${params.toString()}`
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
  }
  async getCollections(type: CollectionType.CLUSTER, offset: number, limit: number, collectionId?: string): Promise<Collection[]>;
  async getCollections(type: CollectionType.TAG, offset: number, limit: number, collectionId?: number): Promise<Collection[]>;
  async getCollections(type: CollectionType, offset: number = 0, limit: number = 25, collectionId?: CollectionId): Promise<Collection[]> {
      const query: GetCollectionsRequest = { 
        offset: offset, 
        limit: limit
      };

      if(collectionId){
        query.collection_id = collectionId
      }
      
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(query).map(([key, value]) => [key, String(value)])
      )
    );
    const url = type === CollectionType.TAG? 
      `${this.baseUrl}${APIRoutes.BASE_TAG_ENDPOINT}?${params.toString()}`:
      `${this.baseUrl}${APIRoutes.BASE_CLUSTER_ENDPOINT}?${params.toString()}`
    
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<GetCollectionsReponse>(res);
    return data.collections;
  }


  async countItems(): Promise<number> {
    const url = `${this.baseUrl}${APIRoutes.COUNT_ITEMS_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<GetCountResponse>(res);
    return data.count;
  }
  
  async countCollections(type: CollectionType): Promise<number> {
    const url = type === CollectionType.TAG? 
      `${this.baseUrl}${APIRoutes.COUNT_TAGS_ENDPOINT}`:
      `${this.baseUrl}${APIRoutes.COUNT_CLUSTER_ENDPOINT}`

    const res = await fetch(url, { method: "GET" });
    const data = await this.handleResponse<GetCountResponse>(res);
    return data.count;
  }

    async renameCollection(collectionId: string, name: string, type: CollectionType.CLUSTER): Promise<void>;
    async renameCollection(collectionId: number, name: string, type: CollectionType.TAG): Promise<void>;
    async renameCollection(collectionId: CollectionId, name: string, type: CollectionType): Promise<void> {
      const payload: RenameCollectionRequest = { collection_id: collectionId, name };
          
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(payload).map(([key, value]) => [key, String(value)])
        )
      );
      const url = type === CollectionType.TAG? 
      `${this.baseUrl}${APIRoutes.BASE_TAG_ENDPOINT}?${params.toString()}`:
      `${this.baseUrl}${APIRoutes.BASE_CLUSTER_ENDPOINT}?${params.toString()}`

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
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

async mergeCollections(type: CollectionType.CLUSTER, primaryId: string, secondaryIds: string[]): Promise<Collection[]>;
async mergeCollections(type: CollectionType.TAG, primaryId: number, secondaryIds: number[]): Promise<Collection[]>;
async mergeCollections(type: CollectionType, primaryCollectionId: CollectionId, secondaryCollectionIds: CollectionId[]): Promise<Collection[]> {
    const url = type === CollectionType.TAG? 
    `${this.baseUrl}${APIRoutes.MERGE_TAGS_ENDPOINT}`:
    `${this.baseUrl}${APIRoutes.MERGE_CLUSTERS_ENDPOINT}`

    const payload: MergeCollectionsRequest = { 
      primary_collection_id: primaryCollectionId,
      secondary_collection_ids: secondaryCollectionIds
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await this.handleResponse<MergeCollectionsResponse>(res);
    return data.collections
  }

}