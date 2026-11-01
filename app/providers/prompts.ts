'use client'

import { apiPromptsClient, eventsClient } from "../sereleum";
import { createItemsProvider } from "./factory";

export const {
  ItemsContext,
  ItemsProvider,
  useClusters,
  useDashboard,
} = createItemsProvider(apiPromptsClient, eventsClient);

