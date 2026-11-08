
export const SERELEUM_BASE_URL = process.env.SERELEUM_BASE_URL || "http://127.0.0.1:8000"

export const BASE_ITEMS_ENDPOINT = "/api/items";
export const BASE_EVENTS_ENDPOINT = "/sse/events";
export const BASE_CLUSTER_ENDPOINT = "/api/clusters";
export const BASE_TAG_ENDPOINT = "/api/tags";
export const OVERVIEW_ENDPOINT = "/api/overview";

export const CLUSTER_STATUS_EVENT_ENDPOINT = `${BASE_EVENTS_ENDPOINT}/cluster/status`;
export const INDEX_PROGRESS_EVENT_ENDPOINT = `${BASE_EVENTS_ENDPOINT}/index/progress`

export const QUERY_ITEMS_ENDPOINT = `${BASE_ITEMS_ENDPOINT}/query`;
export const INDEX_ENDPOINT = `${BASE_ITEMS_ENDPOINT}/index`;
export const INDEX_FILE_ENDPOINT = `${BASE_ITEMS_ENDPOINT}/index/file`;
export const COUNT_ITEMS_ENDPOINT = `${BASE_ITEMS_ENDPOINT}/count`;

export const MOVE_CLUSTER_ITEMS_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/move`;
export const MERGE_CLUSTERS_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/merge`;
export const COUNT_CLUSTER_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/count`;
export const DELETE_CLUSTERS_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/delete`;

export const MOVE_TAG_ITEMS_ENDPOINT = `${BASE_TAG_ENDPOINT}/move`;
export const MERGE_TAGS_ENDPOINT = `${BASE_TAG_ENDPOINT}/merge`;
export const COUNT_TAGS_ENDPOINT = `${BASE_TAG_ENDPOINT}/count`;
export const TAGS_ITEMS_ENDPOINT = `${BASE_TAG_ENDPOINT}/tag`;
export const DELETE_TAGS_ENDPOINT = `${BASE_TAG_ENDPOINT}/delete`;
