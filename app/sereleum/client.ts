
import * as APIRoutes from "@/app/constants/api";

export class SereleumEventsClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/sereleum") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

trackIndexProgress(
  jobId: string,
  {
    onProgress,
    onFail,
    onActive,
    onOpen,
    onError,
    onComplete,
  }: {
    onProgress: (progress: number) => void;
    onFail?: (error: string) => void;
    onActive?: () => void;
    onOpen?: () => void;
    onError?: (err: unknown) => void;
    onComplete?: () => void;
  }
): EventSource {
  const url = `${this.baseUrl}${APIRoutes.INDEX_PROGRESS_EVENT_ENDPOINT}?job_id=${encodeURIComponent(
      jobId
    )}`;
  const es = new EventSource(url);

  es.onopen = () => {
    onOpen?.();
  };

  es.addEventListener("progress", (ev: MessageEvent) => {
    try {
      const payload = JSON.parse(ev.data);
      onProgress(Number(payload.progress));
    } catch (err) {
      onError?.(err);
    }
  });

  es.addEventListener("active", () => {
    onActive?.();
  });

  es.addEventListener("complete", () => {
    onComplete?.();
    es.close();
  });

  es.addEventListener("failed", (ev: MessageEvent) => {
    try {
      const payload = JSON.parse(ev.data);
      onFail?.(String(payload.error));
    } catch (err) {
      onError?.(err);
    } finally {
      es.close();
    }
  });

  es.onerror = (ev: Event | any) => {
    onError?.(ev);
  };

  return es;
  }  


  trackClusterStatus(
  jobId: string,
  {
    onFail,
    onActive,
    onOpen,
    onError,
    onComplete,
  }: {
    onFail?: (error: string) => void;
    onActive?: () => void;
    onOpen?: () => void;
    onError?: (err: unknown) => void;
    onComplete?: () => void;
  }
): EventSource {
  const url = `${this.baseUrl}${APIRoutes.CLUSTER_STATUS_EVENT_ENDPOINT}?job_id=${encodeURIComponent(
      jobId
    )}`;
  const es = new EventSource(url);

  es.onopen = () => {
    onOpen?.();
  };

  es.addEventListener("active", () => {
    onActive?.();
  });

  es.addEventListener("complete", () => {
    onComplete?.();
    es.close();
  });

  es.addEventListener("failed", (ev: MessageEvent) => {
    try {
      const payload = JSON.parse(ev.data);
      onFail?.(String(payload.error));
    } catch (err) {
      onError?.(err);
    } finally {
      es.close();
    }
  });

  es.onerror = (ev: Event | any) => {
    onError?.(ev);
  };

  return es;
  }  
}