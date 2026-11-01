'use client'

import { apiPromptsClient, eventsClient } from "../sereleum";
import { createItemsProvider } from "./factory";

export const {
  ItemsContext,
  ItemsProvider,
  useManageClusters,
  useDashboard,
} = createItemsProvider(apiPromptsClient, eventsClient);

