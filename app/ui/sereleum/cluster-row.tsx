import { Cluster, UNLABELLED_CLUSTER } from "@/app/types";
import { useRouter } from "next/navigation";

export function ClusterRow({
  cluster,
  isSelecting = false,
  selected,
  toggleSelection,
}: {
  cluster: Omit<Cluster, "embedding">;
  isSelecting?: boolean;
  selected?: boolean;
  toggleSelection?: () => void;
}) {
  const router = useRouter();

  const mean_similarity = cluster.metadata.mean_similarity;
  const cohesionPercentage = Math.round(mean_similarity * 100);
  const hue = Math.max(0, Math.min(120, cohesionPercentage * 1.2)); // 0=red, 120=green
  const barColor = `hsl(${hue}, 70%, 50%)`;

  return (
    <div
      onClick={() => {
        if (isSelecting) {
          toggleSelection?.();
        } else {
          router.push(`/dashboard/clusters/cluster/${cluster.prototype_id}`);
        }
      }}
      className={`block w-full ${isSelecting ? "cursor-pointer" : "cursor-pointer"}`}
    >
      <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
        <div className="flex items-center gap-3">
          {isSelecting && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection?.();
              }}
              aria-pressed={selected}
              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selected
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white border-gray-300"
              }`}
              title={selected ? "Deselect" : "Select"}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selected ? "bg-white" : "hidden"
                }`}
              />
            </button>
          )}

          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium">
            {cluster.label?.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">
              {cluster.label === UNLABELLED_CLUSTER
                ? cluster.prototype_id
                : cluster.label}
            </div>

            {cluster.label === UNLABELLED_CLUSTER && (
              <div className="text-xs text-gray-500">{cluster.label}</div>
            )}

            <div className="text-xs text-gray-500">
              {cluster.metadata?.prototype_size ?? 0} items in cluster
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-400">Cohesion Score</div>
          <div className="text-sm font-medium">{cohesionPercentage}%</div>

        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div
            style={{
              width: `${Math.min(100, cohesionPercentage)}%`,
              background: `linear-gradient(90deg, ${barColor}, ${barColor})`,
            }}
            className="h-full transition-all"
            aria-hidden
          />
        </div>

          <div className="mt-2 text-xs text-gray-500 flex gap-3">
            <div title="Similarity to nearest other cluster">
              nearest:{" "}
              {cluster.metadata?.nearest_other_similarity == null
                ? "—"
                : `${Math.round(
                    cluster.metadata.nearest_other_similarity * 100
                  )}%`}
            </div>
            <div title="Separation margin between clusters">
              sep:{" "}
              {cluster.metadata?.separation_margin == null
                ? "—"
                : Number.isFinite(cluster.metadata.separation_margin)
                ? cluster.metadata.separation_margin.toFixed(2)
                : String(cluster.metadata.separation_margin)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
