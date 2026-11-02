import { Cluster } from "@/app/types";
import { faCheck, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";


interface ClusterManagerFormProps {
  cluster:  Cluster;
  labelDraft: string, enabled:boolean;
  onLabelDraftChange: (e:  ChangeEvent<HTMLInputElement>) => void;
  onSaveLabel: () => Promise<void>;
}

export function ClusterLabelForm({
  cluster, 
  labelDraft,
  enabled,
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