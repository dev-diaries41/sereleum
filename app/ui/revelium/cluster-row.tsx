import { Cluster } from "@/app/types";

export function ClusterRow({ cluster}: { cluster: Omit<Cluster, "embedding"> }) {
  const {
    mean_similarity,
    min_similarity,
    max_similarity,
    nearest_other_similarity,
    separation_margin,
    prototype_size,
  } = cluster.metadata || {};

  const pct = (v?: number | null) => {
    if (v === null || v === undefined) return '—';
    return `${Math.round(v * 100)}%`;
  };

  const separationLabel = (v?: number | null) => {
    if (v === null || v === undefined) return '—';
    return Number.isFinite(v) ? v.toFixed(2) : String(v);
  };

  const cohesionPercentage = Math.round((mean_similarity ?? 0) * 100);

  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium">
          {cluster.label?.charAt(0)?.toUpperCase() ?? '—'}
        </div>
        <div>
          <div className="text-sm font-medium">{cluster.label}</div>
          <div className="text-xs text-gray-500">{prototype_size ?? 0} item(s) in cluster</div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-400">Cohesion Score</div>
        <div className="text-sm font-medium">{pct(mean_similarity)}</div>

        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div
            style={{ width: `${Math.min(100, cohesionPercentage)}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
            aria-hidden
          />
        </div>

        <div className="mt-2 text-xs text-gray-500 flex gap-3">
          <div title="Minimum similarity within cluster">min: {pct(min_similarity)}</div>
          <div title="Maximum similarity within cluster">max: {pct(max_similarity)}</div>
          <div title="Similarity to nearest other cluster">nearest: {pct(nearest_other_similarity)}</div>
          <div title="Separation margin between clusters">sep: {separationLabel(separation_margin)}</div>
        </div>
      </div>
    </div>
  );
}
