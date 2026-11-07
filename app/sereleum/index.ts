import { Article, Prompt } from "../types";
import { SereleumEventsClient } from "./client";
import { SereleumApiClient } from "./server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const apiClient = new SereleumApiClient<Prompt>(`${BASE_URL}/api/sereleum`)
export const eventsClient = new SereleumEventsClient()