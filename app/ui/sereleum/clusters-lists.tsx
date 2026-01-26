"use client";

import { usePrompts } from "@/app/providers/prompts";
import Link from "next/link";
import { ClusterAccuracyPlayground } from "./cluster-accuracy";
import { useEffect, useState } from "react";
import { ClusterAccuracy, Cluster, UNLABELLED_CLUSTER } from "@/app/types";
import { sereleumClient } from "@/app/sereleum/client";
import { ClusterRow } from "./cluster-row";

interface ClustersWrapperProps {
  pageSize?: number;
}

export function ClustersWrapper({ pageSize = 10 }: ClustersWrapperProps) {
  const { clusters, promptsOverview, topClusters, setTopClusters, setClusters, onLoadMoreClusters } = usePrompts();
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
      <div className="text-sm text-gray-500 py-8 text-center">No clusters available</div>
    );
  }

  // helper to get cluster objects for the selected ids (preserves order of selectedClusterIds)
  const selectedClusters = selectedClusterIds
    .map((id) => clusters.find((c) => c.prototype_id === id))
    .filter(Boolean) as Cluster[];

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center p-8 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-6 items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Clusters</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsRunAccVisisble((prev) => !prev)}
            disabled={running}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            Test accuracy
          </button>

          <button
            onClick={() => {
              setIsSelecting((s) => !s);
              if (isSelecting) clearSelection();
            }}
            className={`px-4 py-2 rounded-md text-sm border ${isSelecting ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
          >
            {isSelecting ? "Selecting..." : "Select clusters"}
          </button>
        </div>
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

      {/* Selection header - visible only when selecting */}
      {isSelecting && (
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center justify-between gap-4 p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">Selected</div>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">{selectedClusterIds.length}</div>
              <div className="text-sm text-gray-500">of {totalClustersCount}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={selectedClusterIds.length === 0}
                onClick={handleMergeClustersClick}
                className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm disabled:opacity-60"
              >
                Merge clusters
              </button>
              <button
                onClick={() => {
                  clearSelection();
                }}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  setIsSelecting(false);
                  clearSelection();
                }}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Parent chooser UI - compact select */}
          {isChoosingParent && (
            <div className="w-full bg-white rounded-md shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Choose parent cluster</div>
                  <div className="text-xs text-gray-500">The selected parent will remain; other selected clusters will be merged into it.</div>
                </div>
                <div className="text-sm text-gray-600">{selectedClusterIds.length} clusters selected</div>
              </div>

              <div className="mt-3">
                <select
                  value={parentClusterId ?? ""}
                  onChange={(e) => setParentClusterId(e.target.value)}
                  className="rounded border px-3 py-2 mt-2"
                  aria-label="Select parent cluster"
                >
                  <option value="" disabled>
                    -- choose parent cluster --
                  </option>
                  {selectedClusters.map((c) => (
                    <option key={c.prototype_id} value={c.prototype_id}>
                      {c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label} — {c.metadata?.prototype_size ?? 0} items
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsChoosingParent(false);
                    setParentClusterId(null);
                  }}
                  className="px-3 py-2 rounded-md border text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMerge}
                  disabled={!parentClusterId}
                  className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm disabled:opacity-60"
                >
                  Confirm merge
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full flex flex-col gap-2">
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
