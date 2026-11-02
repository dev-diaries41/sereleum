'use client';

import { useManageClusters } from "@/app/providers/sereleum";
import { useRouter } from "next/navigation";
import {  useEffect, useLayoutEffect, useMemo, useState } from "react";
import { UNLABELLED_CLUSTER } from "@/app/constants/clusters";
import ItemsTable from "../items-table";
import { ClusterLabelForm } from "./cluster-label-form";
import { ClusterMetricsSummary } from "./cluster-metric-summary";
import { Cluster } from "@/app/types";

export function ClusterManagerView({ id }: { id?: string }) {
  const router = useRouter();

  const [cluster, setCluster] = useState<Cluster | null>(null);
  const {onRenameCluster, onGetCluster} = useManageClusters();
  const [labelDraft, setLabelDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);

  if (!id){
    router.push('/dashboard/clusters')
  }
      
  useLayoutEffect(() => {
    if(!id) return 
    onGetCluster(id).then(c => setCluster(c))
  }, [id])

   useEffect(() => {
    if(!cluster) return 
    setLabelDraft(cluster.label);
  }, [cluster]);



  if(!cluster) return <div className="mx-auto">Cluster not found</div>

  const isUnlabelled = cluster.label === UNLABELLED_CLUSTER
  
 
  const renameCluster = async () => {
    setSaving(true);
    try {
      await onRenameCluster(cluster.id, labelDraft);
    } finally {
      setSaving(false);
    }
  };

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
            onLabelDraftChange={(e) => setLabelDraft(e.target.value)}
            onSaveLabel={renameCluster}
          />
          <ClusterMetricsSummary cluster={cluster} />
        </div>
        <ItemsTable cluster={cluster} />
      </div>
  </div>
);

}