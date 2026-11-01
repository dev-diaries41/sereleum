'use client'

import { apiArticleClient, eventsClient } from "../sereleum";
import { createItemsProvider } from "./factory";

export const {
  ItemsContext,
  ItemsProvider,
  useClusters,
  useDashboard,
} = createItemsProvider(apiArticleClient, eventsClient);
