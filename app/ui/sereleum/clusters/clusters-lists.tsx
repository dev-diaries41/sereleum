"use client";

import { useManageClusters } from "@/app/providers/sereleum";
import  { useEffect, useMemo, useState } from "react";
import { Cluster } from "@/app/types";
import { ClusterRow } from "./cluster-row";
import { SortBySelector } from "../../common/sort-by";
import { MergeClustersView } from "./merger";

const SortKeyOptions = ['mean', 'std', 'size'] as const;
type SortKey = typeof SortKeyOptions[number];


interface ClustersWrapperProps {
  pageSize?: number;
  initialClusters?: Cluster[]
  
}

export function ClustersWrapper({ pageSize = 25, initialClusters = [] }: ClustersWrapperProps) {
  const { clusters, overview, onLoadMoreClusters , onMergeClusters} = useManageClusters(initialClusters);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isChoosingParent, setIsChoosingParent] = useState(false);
  const [parentClusterId, setParentClusterId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('mean');
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  
  const toggleSelection = (id: string) => {
    setSelectedClusterIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedClusterIds([]);
    setParentClusterId(null);
    setIsChoosingParent(false);
  };

  const reset = () => {
    clearSelection();
    setIsSelecting(false);
  }

  const startChooseParent = () => {
    if (selectedClusterIds.length === 0) return;
    setIsChoosingParent(true);
    setParentClusterId((prev) => prev ?? selectedClusterIds[0]);
  };

  const handleConfirmMerge = async () => {
    if (!parentClusterId) return;

    const targetClusters = selectedClusterIds.filter(
      (id) => id !== parentClusterId
    );

    if (targetClusters.length === 0) {
      reset()
      return;
    }

    try {
      await onMergeClusters(parentClusterId, targetClusters);
      reset()
    } catch (err) {
      console.error("Merge failed", err);
    } 
  };


  const handleMergeClustersClick = () => {
    if (selectedClusterIds.length === 0) return;
    startChooseParent();
  };

  const totalPages = Math.max(1, Math.ceil(overview.total_clusters / pageSize));
  const start = page * pageSize;
  const end = start + pageSize;

  // Compute sorted clusters (keeps core logic intact; sorting happens before pagination)
  const sortedClusters = useMemo(() => {
    if (!sortBy) return clusters;
    const copy = [...clusters];
    copy.sort((a, b) => {
      let av: number = 0;
      let bv: number = 0;
      switch (sortBy) {
        case "mean":
          av = a.mean_similarity ?? 0;
          bv = b.mean_similarity ?? 0;
          break;
        case "std":
          av = a.std_similarity ?? 0;
          bv = b.std_similarity ?? 0;
          break;
        case "size":
          av = a.prototype_size ?? 0;
          bv = b.prototype_size ?? 0;
          break;
      }

      if (av === bv) return 0;
      const res = av < bv ? -1 : 1;
      return sortDirection === "asc" ? res : -res;
    });
    return copy;
  }, [clusters, sortBy, sortDirection]);

  const pageClusters = sortedClusters.slice(start, end);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(overview.total_clusters / pageSize) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [overview.total_clusters, pageSize, page]);

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
      <div className="text-sm text-gray-500 py-8 text-center">No clusters available</div>
    );
  }

  // helper to get cluster objects for the selected ids (preserves order of selectedClusterIds)
  const selectedClusters = selectedClusterIds
    .map((id) => clusters.find((c) => c.id === id))
    .filter(Boolean) as Cluster[];

  // Minimalist label helper
  const labelFor = (k: SortKey) => {
    if (k === 'mean') return 'Cohesion';
    if (k === 'std') return 'Spread';
    if (k === 'size') return 'Cluster size';
    return 'Default';
  }

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-2 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-2 items-center">
        <h1 className="text-xl md:text-2xl">Clusters</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setIsSelecting((s) => !s);
              if (isSelecting) clearSelection();
            }}
            className={`px-4 py-2 rounded-md text-sm border-2 font-medium border-indigo-600`}
          >
           Manage clusters
          </button>
        </div>
      </div>

      <SortBySelector
        options = {SortKeyOptions}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        labelFor={labelFor}
      />

      {/* Selection header - visible only when selecting */}
    {isSelecting && (
          <MergeClustersView
            selectedClusterIds={selectedClusterIds}
            totalClustersCount={overview.total_clusters}
            selectedClusters={selectedClusters}
            parentClusterId={parentClusterId}
            setParentClusterId={setParentClusterId}
            handleMergeClustersClick={handleMergeClustersClick}
            clearSelection={clearSelection}
            setIsSelecting={setIsSelecting}
            isChoosingParent={isChoosingParent}
            setIsChoosingParent={setIsChoosingParent}
            handleConfirmMerge={handleConfirmMerge}
          />
        )}

        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pageClusters.map((cluster) => (
          <ClusterRow
            key={cluster.id}
            cluster={cluster}
            isSelecting={isSelecting}
            selected={selectedClusterIds.includes(cluster.id)}
            toggleSelection={() => toggleSelection(cluster.id)}
          />
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
        <span className="px-2 py-2">Page {page + 1} of {totalPages || 1}</span>
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
