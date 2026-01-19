
export const REVELIUM_BASE_URL = process.env.REVELIUM_BASE_URL || "http://127.0.0.1:8000"
export const BASE_PROMPTS_ENDPOINT = "/api/prompts";
export const ADD_PROMPTS_ENDPOINT = `${BASE_PROMPTS_ENDPOINT}/add`;
export const ADD_PROMPTS_FILE_ENDPOINT = `${BASE_PROMPTS_ENDPOINT}/add/file`;
export const GET_PROMPTS_OVERVIEW_ENDPOINT = `${BASE_PROMPTS_ENDPOINT}/overview`;
export const COUNT_PROMPTS_ENDPOINT = `${BASE_PROMPTS_ENDPOINT}/count`;
export const SSE_PROMPTS_INDEX_PROGRESS = "sse/prompts/index/progress"

export const BASE_CLUSTER_ENDPOINT = "/api/clusters";
export const START_CLUSTER_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/start`;
export const COUNT_CLUSTER_ENDPOINT = "/api/clusters/count";
export const GET_LABELS_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/labels`;
export const CALC_CLUSTER_ACCURACY_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/accuracy`;
export const GET_CLUSTER_PLOT_ENDPOINT = `${BASE_CLUSTER_ENDPOINT}/plot`;