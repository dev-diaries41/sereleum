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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="border border-gray-200 bg-gray-50 rounded-2xl shadow-sm p-8"
        >
          <p className="text-base text-gray-500 font-semibold mb-2">
            {label}
          </p>
          <p className="text-4xl font-extrabold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}