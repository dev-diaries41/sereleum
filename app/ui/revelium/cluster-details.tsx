'use client';

import { usePrompts } from "@/app/providers/prompts";
import { reveliumClient } from "@/app/revelium/client";
import { Cluster } from "@/app/types";
import { faCheck, faFlask } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function ClusterDetail({ id }: { id?: string }) {
  const router = useRouter();
  const { clusters, setClusters } = usePrompts();
  const [labelDraft, setLabelDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const cluster = useMemo(() => {
    if (!id) return undefined;
    return clusters.find(
      (c) => c.prototype_id === id || (c as any).id === id || c.label === id
    ) as Omit<Cluster, 'embedding'> | undefined;
  }, [clusters, id]);

  useEffect(() => {
    setLabelDraft(cluster?.label ?? '');
  }, [cluster]);

  if (!id) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-sm text-gray-500">No cluster selected.</div>
      </div>
    );
  }

  if (!cluster) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => router.push('/dashboard/clusters')}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-100"
        >
          Back
        </button>
        <div className="text-sm text-gray-500">Cluster not found.</div>
      </div>
    );
  }

  const {
    mean_similarity,
    max_similarity,
    nearest_other_similarity,
    separation_margin,
    prototype_size,
  } = cluster.metadata || {};

  const pct = (v?: number | null) =>
    v === undefined || v === null ? '—' : `${Math.round(v * 100)}%`;

  const saveLabel = async () => {
    setSaving(true);
    try {
      const newLabel = await reveliumClient.updateClusterLabel(cluster.prototype_id, labelDraft)
      setClusters((prev) =>
        prev.map((c) =>
          c.prototype_id === cluster.prototype_id
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

  const cohesionPercent = Math.round((mean_similarity ?? 0) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            {cluster.label || 'Untitled cluster'}
          </h2>
          <p className="text-sm text-gray-500">
            Cluster · {prototype_size ?? 0} prototype(s)
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard/clusters')}
          className="px-3 py-2 rounded-md text-sm bg-gray-100"
        >
          Back to all clusters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Label & Notes</h3>
              <p className="text-sm text-gray-500">
                Give this cluster a clear, searchable label and save it.
              </p>
            </div>
            <div className="text-xs text-gray-400">
              id: {cluster.prototype_id}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cluster label
              </label>
              <div className="flex gap-2">
                <input
                  value={labelDraft}
                  onChange={(e) => setLabelDraft(e.target.value)}
                  placeholder="Enter label"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-200 outline-none"
                />
                <button
                  onClick={saveLabel}
                  disabled={
                    saving ||
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
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Quick actions
              </label>
        
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Notes
              </label>
              <textarea
                placeholder="Optional notes about this cluster — usage, findings, next steps..."
                className="w-full min-h-[120px] p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h4 className="text-sm font-semibold mb-4">Cluster metrics</h4>

          <div className="space-y-4">
            <Metric
              label="Cohesion (mean)"
              value={pct(mean_similarity)}
              largeValue={`${cohesionPercent}%`}
            />
            <Metric label="Max similarity" value={pct(max_similarity)} />
            <Metric
              label="Prototype size"
              value={String(prototype_size ?? 0)}
            />
            <Metric
              label="Nearest cluster similarity"
              value={pct(nearest_other_similarity)}
            />
            <Metric
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
                Cohesion close to 100% means prototypes in this cluster are very
                similar. Nearest cluster similarity indicates overlap risk.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  largeValue,
}: {
  label: string;
  value: string;
  largeValue?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
      {largeValue ? (
        <div className="text-lg font-extrabold">{largeValue}</div>
      ) : null}
    </div>
  );
}
