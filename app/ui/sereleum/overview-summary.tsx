import { OverviewInfo } from "@/app/types";

interface OverviewSummaryProps {
  overview: OverviewInfo;
  topN?: number;
}

export function OverviewSummary({ overview }: OverviewSummaryProps) {
  return (
    <div className="border border-gray-300 rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center gap-12">
        <div>
          <p className="text-sm text-gray-500 font-semibold">Total Prompts</p>
          <p className="text-3xl font-extrabold">{overview.total_items}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold">Total Clusters</p>
          <p className="text-3xl font-extrabold">{overview.total_clusters}</p>
        </div>
      </div>
    </div>
  );
}