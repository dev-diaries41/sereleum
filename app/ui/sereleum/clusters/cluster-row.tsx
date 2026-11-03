import { UNLABELLED_CLUSTER } from "@/app/constants/clusters";
import { capitalizeFirstLetter } from "@/app/lib/helpers";
import { Cluster } from "@/app/types";
import { useRouter } from "next/navigation";

export function ClusterRow({
  cluster,
  isSelecting = false,
  selected,
  toggleSelection,
}: {
  cluster: Cluster;
  isSelecting?: boolean;
  selected?: boolean;
  toggleSelection?: () => void;
}) {
  const router = useRouter();
  const cohesionPercentage = Math.round(cluster.mean_similarity * 100);
  const hue = Math.max(0, Math.min(120, cohesionPercentage * 1.2));
  const barColor = `hsl(${hue}, 70%, 50%)`;
  const title = cluster.label || UNLABELLED_CLUSTER
  
  return (
    <div
      onClick={() => {
        if (isSelecting) toggleSelection?.();
        else router.push(`/dashboard/clusters/cluster/${cluster.id}`);
      }}
      className="block w-full h-full cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 w-full h-full">
        {/* Left side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0 w-full">
          {isSelecting && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection?.();
              }}
              aria-pressed={selected}
              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selected ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"
              }`}
              title={selected ? "Deselect" : "Select"}
            >
              <span className={`w-2 h-2 rounded-full ${selected ? "bg-white" : "hidden"}`} />
            </button>
          )}

          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium flex-shrink-0">
            {title.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex flex-col gap-1 min-w-0 w-full">
            <div
              className="text-sm font-medium truncate"
              title={title}
            >
              {title}
            </div>
            <div className="text-xs text-gray-500 truncate">{cluster.id}</div>
            <div className="text-xs text-gray-500 truncate">
              {cluster.prototype_size} items
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-start sm:items-end gap-1 mt-2 sm:mt-0 w-full sm:w-auto flex-shrink-0">
          <div className="text-xs text-gray-400">Cohesion Score</div>
          <div className="text-sm font-medium">{cohesionPercentage}%</div>

          <div className="w-full sm:w-28 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
            <div
              style={{ width: `${Math.min(100, cohesionPercentage)}%`, background: barColor }}
              className="h-full transition-all"
              aria-hidden
            />
          </div>

          <div className="mt-2 text-xs text-gray-500 flex flex-wrap sm:flex-nowrap gap-3">
            <div title="Separation margin between clusters" className="truncate">
              similarity spread:{" "}
              {cluster.std_similarity.toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
