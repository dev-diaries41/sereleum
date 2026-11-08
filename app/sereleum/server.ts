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
  TagRequest,
  DeleteCollectionsRequest,
  RemoveTagRequest,
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

  async getOverview(): Promise<OverviewInfo> {
    const url = `${this.baseUrl}${APIRoutes.OVERVIEW_ENDPOINT}`;
    const res = await fetch(url, { method: "GET" });
    return this.handleResponse<GetOverviewResponse>(res);
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

  async getItems<TCollectionType extends CollectionType>(type: TCollectionType, collectionIds?: CollectionId<TCollectionType>[], limit?: number, offset?: number): Promise<T[]> {
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


  async tagItems(tag: string, collectionId: CollectionId, itemIds: string[], excludedItemIds: string[], selectAll: boolean): Promise<void> {
    const url = `${this.baseUrl}${APIRoutes.TAGS_ITEMS_ENDPOINT}`

    const payload: TagRequest = { 
      tag,
      item_ids: itemIds,
      excluded_item_ids: excludedItemIds,
      select_all: selectAll,
      collection_id: collectionId
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

  }

    async unTagItems(tagId: number, itemIds: string[], excludedItemIds: string[], selectAll: boolean): Promise<void> {
      const url = `${this.baseUrl}${APIRoutes.REMOVE_TAG_ENDPOINT}`

      const payload: RemoveTagRequest = { 
        tag_id: tagId,
        item_ids: itemIds,
        excluded_item_ids: excludedItemIds,
        select_all: selectAll,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
  }

  async moveClusterItems(destinationCollection: string, sourceCollection: string, itemIds: string[], excludedItemIds: string[], selectAll: boolean  ): Promise<void> {
    const payload: MoveItemsRequest = {
      destination_collection_id: destinationCollection,
      source_collection_id: sourceCollection,
      item_ids: itemIds,
      excluded_item_ids: excludedItemIds,
      select_all: selectAll
    }

    const url = `${this.baseUrl}${APIRoutes.MOVE_CLUSTER_ITEMS_ENDPOINT}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
  }

  // async getCollections(type: CollectionType, offset?: number, limit?: number, collectionId?: CollectionId): Promise<Collection[]>;
  async getCollections<TCollectionType extends CollectionType>(type: TCollectionType, offset: number = 0, limit?: number, collectionId?: CollectionId<TCollectionType>): Promise<Collection<TCollectionType>[]> {
      const query: GetCollectionsRequest = { 
        offset: offset, 
      };
      if (limit !== undefined) {
        query.limit = limit
      }

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
    const data = await this.handleResponse<GetCollectionsReponse<TCollectionType>>(res);
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

async mergeCollections<T extends CollectionType>(type: T, primaryCollectionId: CollectionId, secondaryCollectionIds: CollectionId[]): Promise<Collection<T>> {
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

    const data = await this.handleResponse<MergeCollectionsResponse<T>>(res);
    return data.merged_collection
  }


async deleteCollection<T extends CollectionType>(type: T, collectionIds: CollectionId<T>[]): Promise<void> {
    const url = type === CollectionType.TAG? 
    `${this.baseUrl}${APIRoutes.DELETE_TAGS_ENDPOINT}`:
    `${this.baseUrl}${APIRoutes.DELETE_CLUSTERS_ENDPOINT}`

    const payload: DeleteCollectionsRequest = { 
      collection_ids: collectionIds
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
  }

}