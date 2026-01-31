import { PromptsOverviewInfo, UNLABELLED_CLUSTER } from "@/app/types";

interface OverviewSummaryProps {
  overview: PromptsOverviewInfo;
  topN?: number
}

export function OverviewSummary({ overview, topN = 6 }: OverviewSummaryProps) {
  const totalTokens = overview.top_clusters.reduce((sum, cluster) => {
    return (
      sum +
      overview.top_cluster_token_counts[cluster.prototype_id] *
        cluster.metadata.prototype_size
    );
  }, 0);

  const orderedClusters = overview.top_clusters.sort((a, b) => overview.top_cluster_token_counts[b.prototype_id] * b.metadata.prototype_size - overview.top_cluster_token_counts[a.prototype_id] * a.metadata.prototype_size)

  return (
    <div className="border border-gray-300 rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center gap-12">
        <div>
          <p className="text-sm text-gray-500 font-semibold">Total Prompts</p>
          <p className="text-3xl font-extrabold">{overview.total_prompts}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold">Total Clusters</p>
          <p className="text-3xl font-extrabold">{overview.total_clusters}</p>
        </div>
      </div>

      <div className="my-6 border-t border-gray-300" />
      <div>
        <p className="text-sm text-gray-500 mb-3 font-semibold">
          Token Breakdown — Top {topN} Clusters        
        </p>
        <div className="flex items-center justify-between px-3 py-1 text-xs font-medium text-gray-500">
          <span>Cluster</span>
          <div className="flex gap-6">
            <span>Tokens</span>
            <span>%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {orderedClusters.map((cluster) => {
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

                <div className="flex gap-6 text-gray-500 text-sm">
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
