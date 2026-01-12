'use server'

import { countDocs } from "@/app/lib/server/mongo/count";
import { addDoc } from "@/app/lib/server/mongo/add";
import ServiceUsage from "@/app/models/usage"
import { Usage } from "@/app/types";
import dbConnect from "@/app/lib/server/data/db";
import { SERVICE_NAME } from "@/app/constants/global";
import { AuthErrors } from "@/app/constants/errors";
import { ServiceUsageErrors } from "@/app/constants/errors";
import { getUser } from "./user";

export async function addUsage(userId: string, service: string){
      return addDoc(ServiceUsage, {userId, service});
}

export async function getTotalUsageCount(userId: string, service: string): Promise<number> {
    const filter = { userId, service };
    const result = await countDocs(ServiceUsage, filter);
  
    if (result?.totalDocuments!== undefined && result.totalDocuments >= 0) {
      return result.totalDocuments;
    } else {
      throw new Error(ServiceUsageErrors.FAILED_TOTAL_USAGE_CHECK);
    }
  }
  
  export async function getMonthlyUsageCount(userId: string, service: string): Promise<number> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const filter = { userId, service, date: { $gte: startOfMonth } };
    const result = await countDocs(ServiceUsage, filter);
  
    if (result?.totalDocuments!== undefined && result.totalDocuments >= 0) {
      return result.totalDocuments;
    } else {
      throw new Error(ServiceUsageErrors.FAILED_MONTHLY_USAGE_CHECK);
    }
  }
  
  export async function getTodaysUsageCount(userId: string, service: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const filter = { userId, service, date: { $gte: startOfDay } };
    const result = await countDocs(ServiceUsage, filter);
  
    if (result?.totalDocuments!== undefined && result.totalDocuments >= 0) {
      return result.totalDocuments;
    } else {
      throw new Error(ServiceUsageErrors.FAILED_DAILY_USAGE_CHECK);
    }
  }


  export async function getAllUsage(userId: string): Promise<Usage> {
    await dbConnect();
    const [todayData, monthData, totalData] = await Promise.all([
      getTodaysUsageCount(userId, SERVICE_NAME),
      getMonthlyUsageCount(userId, SERVICE_NAME),
      getTotalUsageCount(userId, SERVICE_NAME),
    ]);
    return { today: todayData, month: monthData, total: totalData };
  }



export async function checkUsageLimit(email: string) {
    const user = await getUser(email);

    if (!user) {
        return { isAllowed: false, message: AuthErrors.INVALID_USER_ID };
    }

    const hasEnoughCredits = user.credits >= 1;

    if(!hasEnoughCredits){
      return { isAllowed: false, message: ServiceUsageErrors.EXCEEDED_CREDIT_LIMIT };
    }

  return {isAllowed: true, message: ''};
} 