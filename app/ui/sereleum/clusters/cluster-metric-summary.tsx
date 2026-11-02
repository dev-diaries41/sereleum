import { Cluster } from "@/app/types";
import { MetricsItem } from "../../dashboard/metrics-item";

export function ClusterMetricsSummary({cluster, title = "Cluster metrics"}: {cluster: Cluster, title?: string}){
  const {
    mean_similarity,
    std_similarity,
    prototype_size,
  } = cluster || {};

  const pct = (v?: number | null) =>
    v === undefined || v === null ? '—' : `${Math.round(v * 100)}%`;
  const cohesionPercent = Math.round((mean_similarity ?? 0) * 100);

  return (
  <aside className="border border-gray-300 rounded-2xl shadow-sm p-6">
    <div className="space-y-4">
      <h4 className="text-sm text-gray-500 font-semibold mb-4">{title}</h4>
        <MetricsItem
          label="Cohesion"
          value={pct(mean_similarity)}
          largeValue={`${cohesionPercent}%`}
        />

        <MetricsItem
          label="Cluster size"
          value={String(prototype_size ?? 0)}
        />

        <MetricsItem
          label="Similarity spread"
          value={pct(std_similarity)}
        />
        <div className="pt-3">
          <div className="text-xs text-gray-500">Notes</div>
          <div className="text-xs text-gray-400 mt-2">
            Cohesion shows average similarity within the cluster, while similarity spread indicates how consistent that similarity is.
          </div>
        </div>
      </div> 
    </aside>
  )
}
