"use client"
import { usePrompts } from "@/app/providers/prompts";
import { ClusterRow } from "./cluster-row";

export function ClustersWrapper() {
  const { clusters } = usePrompts();

  return clusters.length === 0 ? (
    <div className="text-sm text-gray-500 py-8 text-center">
      No clusters available
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {clusters.map((cluster) => (
        <ClusterRow key={cluster.prototype_id} cluster={cluster} />
      ))}
    </div>
  );
}
