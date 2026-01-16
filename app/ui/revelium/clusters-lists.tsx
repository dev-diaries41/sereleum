"use client";

import { usePrompts } from "@/app/providers/prompts";
import { ClusterRow } from "./cluster-row";
import Link from "next/link";
import { ClusterAccuracyPlayground } from "./cluster-accuracy";
import { useEffect, useRef, useState } from "react";
import { ClusterAccuracy } from "@/app/types";
import { reveliumClient } from "@/app/revelium/client";

export function ClustersWrapper() {
    const { clusters } = usePrompts();
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<ClusterAccuracy | null>(null);
    const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>([]);
    const [isRunAccVisisble, setIsRunAccVisisble] = useState(false)
  
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
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
  

  if (clusters.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-8 text-center">
        No clusters available
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center p-8">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Clusters</h1>
          <button
            onClick={() => setIsRunAccVisisble(prev => !prev)}
            disabled={running}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            Test accuracy
          </button>
      </div>
      {isRunAccVisisble && 
      <ClusterAccuracyPlayground
      runAccuracy={runAccuracy}
      running={running}
      toggleDropDown={() => setDropdownOpen(prev => !prev)}
      toggleSelection={toggleSelection}
      clusters={clusters}
      dropdownOpen={dropdownOpen}
      result={result}
      selectedClusterIds={selectedClusterIds}
      
      />
}
      {clusters.map((cluster) => (
        <Link
          key={cluster.prototype_id}
          href={`/dashboard/clusters/cluster/${cluster.prototype_id}`}
          className="block w-full"
        >
          <ClusterRow cluster={cluster} />
        </Link>
      ))}
    </div>
  );
}
