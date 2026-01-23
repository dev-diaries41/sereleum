"use client";

import { usePrompts } from "@/app/providers/prompts";
import { ClusterRow } from "./cluster-row";
import Link from "next/link";
import { ClusterAccuracyPlayground } from "./cluster-accuracy";
import { useEffect, useRef, useState } from "react";
import { ClusterAccuracy } from "@/app/types";
import { reveliumClient } from "@/app/revelium/client";

interface ClustersWrapperProps {
  pageSize?: number;
}

export function ClustersWrapper({ pageSize = 10 }: ClustersWrapperProps) {
  const { clusters, promptsOverview, onLoadMoreClusters } = usePrompts();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ClusterAccuracy | null>(null);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>([]);
  const [isRunAccVisisble, setIsRunAccVisisble] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(0);

  const runAccuracy = async () => {
    setRunning(true);
    try {
      const res = await reveliumClient.calculateClusterAccuracy();
      setResult(res);
    } finally {
      setRunning(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedClusterIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const totalClustersCount = promptsOverview.total_clusters;
  const totalPages = Math.max(1, Math.ceil(totalClustersCount / pageSize));
  const start = page * pageSize;
  const end = start + pageSize;
  const pageClusters = clusters.slice(start, end);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(totalClustersCount / pageSize) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [totalClustersCount, pageSize, page]);

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage((p) => p + 1);
      const needMore = end >= clusters.length;
      if (needMore) {
        onLoadMoreClusters(pageSize, clusters.length);
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  if (clusters.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-8 text-center">
        No clusters available
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center p-8 gap-4">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Clusters</h1>
        <button
          onClick={() => setIsRunAccVisisble((prev) => !prev)}
          disabled={running}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
        >
          Test accuracy
        </button>
      </div>

      {isRunAccVisisble && (
        <ClusterAccuracyPlayground
          runAccuracy={runAccuracy}
          running={running}
          toggleDropDown={() => setDropdownOpen((prev) => !prev)}
          toggleSelection={toggleSelection}
          clusters={clusters}
          dropdownOpen={dropdownOpen}
          result={result}
          selectedClusterIds={selectedClusterIds}
        />
      )}

      <div className="w-full flex flex-col gap-2">
        {pageClusters.map((cluster) => (
          <Link
            key={cluster.prototype_id}
            href={`/dashboard/clusters/cluster/${cluster.prototype_id}`}
            className="block w-full gap-4"
          >
            <ClusterRow cluster={cluster} />
          </Link>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-2">
          Page {page + 1} of {totalPages || 1}
        </span>
        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
