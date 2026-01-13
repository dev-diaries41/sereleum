"use client";

import { usePrompts } from "@/app/providers/prompts";
import { ClusterRow } from "./cluster-row";
import Link from "next/link";

export function ClustersWrapper() {
  const { clusters } = usePrompts();

  if (clusters.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-8 text-center">
        No clusters available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {clusters.map((cluster) => (
        <Link
          key={cluster.prototype_id}
          href={`/dashboard/clusters/cluster/${cluster.prototype_id}`}
          className="block"
        >
          <ClusterRow cluster={cluster} />
        </Link>
      ))}
    </div>
  );
}
