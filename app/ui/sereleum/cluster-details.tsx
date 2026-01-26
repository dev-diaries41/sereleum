'use client';

import { usePrompts } from "@/app/providers/prompts";
import { sereleumClient } from "@/app/sereleum/client";
import { Cluster, ClusterMetadata, Prompt } from "@/app/types";
import { faCheck, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MetricsItem } from "../dashboard/metrics-item";

export function ClusterDetail({ id }: { id?: string }) {
  const router = useRouter();
  const { clusters, setClusters, setTopClusters } = usePrompts();
  const [labelDraft, setLabelDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [topPrompts, setTopPrompts] = useState<Prompt[]>([]);
  const [isPromptsVisible, setIsPromptsVisible] = useState(false);


  const cluster = useMemo(() => {
    if (!id) return undefined;
    return clusters.find(
      (c) => c.prototype_id === id || (c as any).id === id || c.label === id
    ) as Cluster | undefined;
  }, [clusters, id]);
  

  useEffect(() => {
    setLabelDraft(cluster?.label ?? '');
  }, [cluster]);


  const saveLabel = async () => {
    setSaving(true);
    try {
      const newLabel = await sereleumClient.updateClusterLabel(cluster?.prototype_id!, labelDraft)
      setClusters((prev) =>
        prev.map((c) =>
          c.prototype_id === cluster?.prototype_id
            ? {
                ...c,
                label: newLabel,
                metadata: { ...c.metadata, label: newLabel },
              }
            : c
        )
      );
    } finally {
      setSaving(false);
    }
  };


  const getTopPrompts = async() => {
    const fetchedPrompts = await sereleumClient.getPrompts(undefined, 10, 0, [cluster?.prototype_id!])
    setTopPrompts(fetchedPrompts)
  }

  const showPrompts = async() => {
    if(topPrompts.length == 0){
      await getTopPrompts()
    }
    setIsPromptsVisible(prev => !prev)
  }


return (
    <div className="mx-auto">
    {!id ? (
      <div className="text-sm text-gray-500">No cluster selected.</div>
    ) : !cluster ? (
      <>
        <button
          onClick={() => router.push('/dashboard/clusters')}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-100"
        >
          Back
        </button>
        <div className="text-sm text-gray-500">Cluster not found.</div>
      </>
    ) : (
      <div className="p-8 max-w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl">
              {cluster.label || 'Untitled cluster'}
            </h2>
          </div>

          <button
            onClick={() => router.push('/dashboard/clusters')}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to all clusters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ClusterLabelForm
            cluster={cluster}
            labelDraft={labelDraft}
            enabled={saving}
            isPromptsVisible={isPromptsVisible}
            onLabelDraftChange={(e) => setLabelDraft(e.target.value)}
            onSaveLabel={saveLabel}
            onShowPrompts={showPrompts}
          />
          <ClusterMetricsSummary metadata={cluster.metadata} />
        </div>

        {topPrompts.length > 0 && isPromptsVisible && (
          <PromptsTable prompts={topPrompts} cluster={cluster} />
        )}
      </div>
    )}
  </div>
);

}

interface ClusterLabelFormPromptsProps {
  cluster:  Cluster;
  labelDraft: string, enabled:boolean;
  isPromptsVisible: boolean;
  onLabelDraftChange: (e:  ChangeEvent<HTMLInputElement>) => void;
  onSaveLabel: () => Promise<void>;
  onShowPrompts:() => Promise<void>;
}
function ClusterLabelForm({
  cluster, 
  labelDraft,
  enabled,
  isPromptsVisible,
  onShowPrompts,
  onSaveLabel, 
  onLabelDraftChange}: ClusterLabelFormPromptsProps
){
  return (
  <div className="relative lg:col-span-2 bg-white border border-gray-300 rounded-2xl shadow-sm p-6 flex flex-col h-full">
  {/* Header */}
  <div className="mb-4">
    <h3 className="text-lg font-semibold">Manage cluster label</h3>
    <p className="text-sm text-gray-500">
  Clusters are automatically labeled when possible. You can optionally edit the label below. Use the "Show sample prompts" button to see what this cluster contains.
    </p>
  </div>

  {/* Main content grows to fill remaining space */}
  <div className="flex-1 space-y-4">
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Cluster label
      </label>
      <div className="flex gap-2">
        <input
          value={labelDraft}
          onChange={onLabelDraftChange}
          placeholder="Enter label"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-200 outline-none"
        />
        <button
          onClick={onSaveLabel}
          disabled={
            enabled ||
            labelDraft.trim() === (cluster.label ?? '').trim()
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faCheck} />
          Save
        </button>
      </div>
    </div>

    <div>
      <button
        onClick={onShowPrompts}
        type="button"
        className="text-sm text-indigo-600 hover:underline"
      >
        {isPromptsVisible ? "Hide" : "Show"} sample prompts
      </button>
    </div>
  </div>

  {/* Footer or notes (optional) */}
  <div className="pt-4 text-xs text-gray-400">
    Use this form to clearly identify your cluster.
  </div>
    <div className="absolute bottom-4 right-4 opacity-50 text-3xl pointer-events-none">
    <FontAwesomeIcon icon={faTag} />
  </div>
</div>

  )
}

function ClusterMetricsSummary({metadata, title = "Cluster metrics"}: {metadata: ClusterMetadata, title?: string}){
  const {
    mean_similarity,
    nearest_other_similarity,
    separation_margin,
    prototype_size,
  } = metadata || {};

  const pct = (v?: number | null) =>
    v === undefined || v === null ? '—' : `${Math.round(v * 100)}%`;
  const cohesionPercent = Math.round((mean_similarity ?? 0) * 100);

  return (
  <aside className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
    <div className="space-y-4">
      <h4 className="text-sm font-semibold mb-4">{title}</h4>

        <MetricsItem
          label="Cohesion (mean)"
          value={pct(mean_similarity)}
          largeValue={`${cohesionPercent}%`}
        />
        <MetricsItem
          label="Cluster size"
          value={String(prototype_size ?? 0)}
        />
        <MetricsItem
          label="Nearest cluster similarity"
          value={pct(nearest_other_similarity)}
        />
        <MetricsItem
          label="Separation margin"
          value={
            separation_margin == null
              ? '—'
              : separation_margin.toFixed(2)
          }
        />

        <div className="pt-3">
          <div className="text-xs text-gray-500">Notes</div>
          <div className="text-xs text-gray-400 mt-2">
            Cohesion close to 100% means items in this cluster are very
            similar. Nearest cluster similarity indicates overlap risk.
          </div>
        </div>
      </div>
    </aside>
  )
}


function PromptsTable({ prompts, cluster }: { prompts: Prompt[], cluster: Cluster }) {
  return (
    <div className="overflow-x-auto w-full bg-white mt-8">
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm md:text-base">
        <thead>
          <tr className="uppercase text-sm">
            <th className="border px-4 py-2 text-left">Prompt ID</th>
            <th className="border px-4 py-2 text-left">Cluster</th>
            <th className="border px-4 py-2 text-left w-[120px]">Label</th>
            <th className="border px-4 py-2 text-left">Content</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => {
            const clusterId = prompt.metadata.cluster_id;
            return (
              <tr
                key={prompt.prompt_id}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="border px-4 py-2">{prompt.prompt_id}</td>
                <td className="border px-4 py-2">
                  <span>{clusterId}</span>
                </td>
                <td
                  className="border px-4 py-2 w-1/6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-full px-2 py-1 text-sm border rounded">
                    {cluster.label}
                  </span>
                </td>
                <td className="border px-4 py-2">{prompt.content}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
