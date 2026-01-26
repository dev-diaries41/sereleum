import { PromptsOverviewInfo, UNLABELLED_CLUSTER } from "@/app/types";

interface OverviewSummaryProps {
  overview: PromptsOverviewInfo;
}

export function OverviewSummary({ overview }: OverviewSummaryProps) {
  const totalTokens = overview.top_clusters.reduce((sum, cluster) => {
    return (
      sum +
      overview.top_cluster_token_counts[cluster.prototype_id] *
        cluster.metadata.prototype_size
    );
  }, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 w-full">
      {/* Totals */}
      <div className="flex items-center gap-12">
        <div>
          <p className="text-sm text-gray-500">Total Prompts</p>
          <p className="text-3xl font-extrabold">{overview.total_prompts}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Clusters</p>
          <p className="text-3xl font-extrabold">{overview.total_clusters}</p>
        </div>
      </div>

      <div className="my-6 border-t border-gray-100" />

      {/* Token breakdown */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Token Breakdown (Top 5 Clusters)
        </p>

        {/* Column headers */}
        <div className="flex items-center justify-between px-3 py-1 text-xs font-medium text-gray-500">
          <span>Cluster</span>
          <div className="flex gap-6">
            <span>Tokens</span>
            <span>%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {overview.top_clusters.map((cluster) => {
            const clusterTokens =
              overview.top_cluster_token_counts[cluster.prototype_id] *
              cluster.metadata.prototype_size;

            const percentage = Math.round(
              (clusterTokens / totalTokens) * 100
            );

            return (
              <div
                key={cluster.prototype_id}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <p className="text-sm font-medium truncate">
                  {cluster.label === UNLABELLED_CLUSTER
                    ? cluster.prototype_id
                    : cluster.label}
                </p>

                <div className="flex gap-6 text-sm font-medium">
                  <span>{clusterTokens.toLocaleString()}</span>
                  <span>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
