'use client';

import { useManageClusters } from "@/app/providers/prompts";
import { Cluster, Prompt } from "@/app/types";
import { faCheck, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MetricsItem } from "../../dashboard/metrics-item";
import { UNLABELLED_CLUSTER } from "@/app/constants/clusters";
import ItemsTable from "../items-table";

export function ClusterManagerView({ id }: { id?: string }) {
  const router = useRouter();
  const {clusters, onRenameCluster } = useManageClusters();
  const [labelDraft, setLabelDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [isItemsVisible, setIsPromptsVisible] = useState(false);

  if (!id){
    router.push('/dashboard/clusters')
  }
      
  const cluster = useMemo(() => {
    return clusters.find(
      (c) => ( c.id === id )|| (c.label === id)
    );
  }, [clusters, id]);

  if(!cluster) return <div className="mx-auto">Cluster not found</div>

  const isUnlabelled = cluster.label === UNLABELLED_CLUSTER
  
  useEffect(() => {
    setLabelDraft(cluster.label);
  }, [cluster]);


  const renameCluster = async () => {
    setSaving(true);
    try {
      await onRenameCluster(cluster.id, labelDraft);
    } finally {
      setSaving(false);
    }
  };

  const showItems = () => setIsPromptsVisible(prev => !prev)


return (
    <div className="mx-auto">
      <div className="p-8 max-w-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl">
              {isUnlabelled? cluster.id: cluster.label}
            </h2>
            {!isUnlabelled && <h3 className="text-sm md:text-md text-gray-500">
              id: {cluster.id}
            </h3>}
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
            isItemsVisible={isItemsVisible}
            onLabelDraftChange={(e) => setLabelDraft(e.target.value)}
            onSaveLabel={renameCluster}
            onshowItems={showItems}
          />
          <ClusterMetricsSummary cluster={cluster} />
        </div>

        { isItemsVisible && (
          <ItemsTable cluster={cluster} />
        )}
      </div>
  </div>
);

}

interface ClusterManagerFormProps {
  cluster:  Cluster;
  labelDraft: string, enabled:boolean;
  isItemsVisible: boolean;
  onLabelDraftChange: (e:  ChangeEvent<HTMLInputElement>) => void;
  onSaveLabel: () => Promise<void>;
  onshowItems:() => void;
}
function ClusterLabelForm({
  cluster, 
  labelDraft,
  enabled,
  isItemsVisible,
  onshowItems,
  onSaveLabel, 
  onLabelDraftChange}: ClusterManagerFormProps
){
  return (
  <div className="relative lg:col-span-2 border border-gray-300 rounded-2xl shadow-sm p-6 flex flex-col h-full">
  {/* Header */}
  <div className="mb-4">
    <h3 className="text-lg font-medium">Manage cluster label</h3>
    <p className="text-sm text-gray-500">
  Clusters are automatically labeled when possible. You can optionally edit the label below.
    </p>
  </div>

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
        onClick={onshowItems}
        type="button"
        className="text-sm text-indigo-600 hover:underline"
      >
        {isItemsVisible ? "Hide" : "Show"} items
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

function ClusterMetricsSummary({cluster, title = "Cluster metrics"}: {cluster: Cluster, title?: string}){
  const {
    mean_similarity,
    std_similarity,
    prototype_size,
  } = cluster || {};

  const pct = (v?: number | null) =>
    v === undefined || v === null ? '—' : `${Math.round(v * 100)}%`;
  const cohesionPercent = Math.round((mean_similarity ?? 0) * 100);

  return (
  <aside className="border border-gray-300 rounded-2xl shadow-sm p-6">
    <div className="space-y-4">
      <h4 className="text-sm text-gray-500 font-semibold mb-4">{title}</h4>
        <MetricsItem
          label="Cohesion"
          value={pct(mean_similarity)}
          largeValue={`${cohesionPercent}%`}
        />

        <MetricsItem
          label="Cluster size"
          value={String(prototype_size ?? 0)}
        />

        <MetricsItem
          label="Similarity spread"
          value={pct(std_similarity)}
        />
        <div className="pt-3">
          <div className="text-xs text-gray-500">Notes</div>
          <div className="text-xs text-gray-400 mt-2">
            Cohesion shows average similarity within the cluster, while similarity spread indicates how consistent that similarity is.
          </div>
        </div>
      </div> 
    </aside>
  )
}
