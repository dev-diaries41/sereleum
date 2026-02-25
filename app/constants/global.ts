
// API URLs
export const USAGE_URL = process.env.USAGE_URL!;
export const REFRESH_TOKEN_URL = process.env.REFRESH_TOKEN_URL!;
export const BASE_URL = process.env.BASE_URL!;
export const FPF_LABS_API_KEY = process.env.FPF_LABS_API_KEY!


export const AcceptedMimes = [
    'application/json',
  ]

export const AcceptedImgMimes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
  ]

export const AcceptedDocFiles = ['.json', '.csv', '.md']
export const AcceptedImgFiles = ['.png', '.jpg', '.jpeg']

const sec = 1000;
const min = 60 * sec;
const hour = 60 * min;
const day = 24 * hour;
const week = 7 * day;

export const Time = {
    sec,
    min,
    hour,
    day,
    week
}

export const StorageKeys = {
  indexingJobId: 'indexingJobId',
  indexingProgress: "indexingProgress",
  clusters: "clusters",
  overview: "overview",
  onboarding: "onboarding"
}

// Usage
export const FREE_CREDITS = 3
export const SERVICE_NAME = "image-editor";

export const CreditBundles = {
  small: { amount: 599, credits: 50 },
  large: { amount: 999, credits: 100 },
}


