'use server'

import { PromptOverviewInfo, Usage } from "@/app/types";

export async function getPromptOverView(userId: string): Promise<PromptOverviewInfo> {
    return {totalClusters: 4, totalPrompts: 131, averageTokenCost: 0}
}
  
