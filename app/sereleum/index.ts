import { Article, Prompt } from "../types";
import { SereleumEventsClient } from "./client";
import { SereleumApiClient } from "./server";


export const apiArticleClient = new SereleumApiClient<Article>()
export const apiPromptsClient = new SereleumApiClient<Prompt>()
export const eventsClient = new SereleumEventsClient()