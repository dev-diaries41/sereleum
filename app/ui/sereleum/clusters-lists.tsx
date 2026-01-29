"use client";

import { usePrompts } from "@/app/providers/prompts";
import { ClusterAccuracyPlayground } from "./cluster-accuracy";
import  { useEffect, useMemo, useState } from "react";
import { ClusterAccuracy, Cluster } from "@/app/types";
import { sereleumClient } from "@/app/sereleum/client";
import { ClusterRow } from "./cluster-row";
import { SortBySelector } from "../common/sort-by";
import { MergeClustersView } from "./clusters/merger";


const SortKeyOptions = ['mean', 'std', 'size'] as const;
type SortKey = typeof SortKeyOptions[number];


interface ClustersWrapperProps {
  pageSize?: number;
}


export function ClustersWrapper({ pageSize = 25 }: ClustersWrapperProps) {
  const { clusters, promptsOverview, setTopClusters, setClusters, onLoadMoreClusters } = usePrompts();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ClusterAccuracy | null>(null);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>([]);
  const [isRunAccVisisble, setIsRunAccVisisble] = useState(false);

  // New selection mode
  const [isSelecting, setIsSelecting] = useState(false);

  // When true, we are showing the UI to pick a parent cluster for the merge
  const [isChoosingParent, setIsChoosingParent] = useState(false);
  const [parentClusterId, setParentClusterId] = useState<string | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState<SortKey>('mean');
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const runAccuracy = async () => {
    setRunning(true);
    try {
      const res = await sereleumClient.calculateClusterAccuracy();
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

  const clearSelection = () => {
    setSelectedClusterIds([]);
    setParentClusterId(null);
    setIsChoosingParent(false);
  };

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
      clearSelection();
      setIsSelecting(false);
      setIsChoosingParent(false);
      return;
    }

    const payload: Record<string, string[]> = {
      [parentClusterId]: targetClusters,
    };

    try {
      const updatedClusters = await sereleumClient.mergeClusters(payload);
      setClusters(prev => [updatedClusters[0], ...prev.filter(cluster => targetClusters.some( t => t === cluster.prototype_id))])
      setTopClusters(prev => [updatedClusters[0], ...prev.filter(cluster => targetClusters.some( t => t === cluster.prototype_id))])
      clearSelection();
      setIsSelecting(false);
    } catch (err) {
      console.error("Merge failed", err);
    } finally {
      setIsChoosingParent(false);
    }
  };


  const handleMergeClustersClick = () => {
    if (selectedClusterIds.length === 0) return;
    startChooseParent();
  };

  const totalClustersCount = promptsOverview.total_clusters;
  const totalPages = Math.max(1, Math.ceil(totalClustersCount / pageSize));
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
          av = a.metadata?.mean_similarity ?? 0;
          bv = b.metadata?.mean_similarity ?? 0;
          break;
        case "std":
          av = a.metadata?.std_similarity ?? 0;
          bv = b.metadata?.std_similarity ?? 0;
          break;
        case "size":
          av = a.metadata?.prototype_size ?? 0;
          bv = b.metadata?.prototype_size ?? 0;
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
      <div className="text-sm text-gray-500 py-8 text-center">No clusters available</div>
    );
  }

  // helper to get cluster objects for the selected ids (preserves order of selectedClusterIds)
  const selectedClusters = selectedClusterIds
    .map((id) => clusters.find((c) => c.prototype_id === id))
    .filter(Boolean) as Cluster[];

  // Minimalist label helper
  const labelFor = (k: SortKey) => {
    if (k === 'mean') return 'Cohesion';
    if (k === 'std') return 'Spread';
    if (k === 'size') return 'Cluster size';
    return 'Default';
  }

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center p-8 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-2 items-center">
        <h1 className="text-2xl md:text-3xl">Clusters</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsRunAccVisisble((prev) => !prev)}
            disabled={running}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium disabled:opacity-60"
          >
            Test accuracy
          </button>

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

      {/* Selection header - visible only when selecting */}
    {isSelecting && (
          <MergeClustersView
            selectedClusterIds={selectedClusterIds}
            totalClustersCount={totalClustersCount}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pageClusters.map((cluster) => (
          <ClusterRow
            key={cluster.prototype_id}
            cluster={cluster}
            isSelecting={isSelecting}
            selected={selectedClusterIds.includes(cluster.prototype_id)}
            toggleSelection={() => toggleSelection(cluster.prototype_id)}
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
