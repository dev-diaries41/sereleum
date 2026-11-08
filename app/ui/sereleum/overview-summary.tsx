import { OverviewInfo } from "@/app/types";

interface OverviewSummaryProps {
  overview: OverviewInfo;
  topN?: number;
}

export function OverviewSummary({ overview }: OverviewSummaryProps) {
  const stats = [
    { label: "Total Items", value: overview.total_items },
    { label: "Total Clusters", value: overview.total_clusters },
    { label: "Total Tags", value: overview.total_tags },
  ];

  return (
    <div className="border border-gray-300 rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center gap-12">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm text-gray-500 font-semibold">{label}</p>
            <p className="text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}