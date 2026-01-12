'use client';

import { PromptOverviewInfo } from '@/app/types';
import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faMoneyBill, faTag, faTerminal } from '@fortawesome/free-solid-svg-icons';


interface DashboardOverviewProps {
  overview: PromptOverviewInfo;
  email: string;
  credits?: number;
}

// Small, reusable metric card with optional sparkline
function MetricCard({ title, value, icon }: { title: string; value: React.ReactNode; icon?: any; }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-3xl md:text-4xl font-extrabold leading-none">{value}</h3>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50">
          {icon ? <FontAwesomeIcon icon={icon} className="w-6 h-6 text-gray-700" /> : null}
        </div>
      </div>
      {/* subtle sparkline placeholder */}
      <div className="mt-4 h-8">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-8">
          <polyline fill="none" stroke="#D1D5DB" strokeWidth={1.6} points="0,14 18,10 36,8 54,6 72,7 90,4 100,6" />
        </svg>
      </div>
    </div>
  );
}

function ClusterRow({ c }: { c: { label: string; prototype_size: number; mean_similarity?: number } }) {
  const percentage = Math.round((c.mean_similarity ?? 0) * 100);
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium">{c.label?.charAt(0)?.toUpperCase() ?? '—'}</div>
        <div>
          <div className="text-sm font-medium">{c.label}</div>
          <div className="text-xs text-gray-500">{c.prototype_size} prototype(s)</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-sm font-medium">{percentage}%</div>
        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div style={{ width: `${Math.min(100, percentage)}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview({ overview, email }: DashboardOverviewProps) {
  const metrics = useMemo(() => {
    return [
      { key: 'total_clusters', title: 'Total Clusters', value: overview.totalClusters, icon: faLayerGroup },
      { key: 'label_clusters', title: 'Labelled Clusters', value: 0, icon: faTag },
      { key: 'total_prompts', title: 'Total Prompts', value: overview.totalPrompts, icon: faTerminal },
      { key: 'average_prompt_cost', title: 'Average Token Cost', value: formatCost(overview.averageTokenCost), icon: faMoneyBill },
    ];
  }, [overview]);

  const clusters: any[] = [];
  const recent: any[] = [];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full">
      <div className="w-full flex flex-col mx-auto px-4">
        <div className="flex flex-col w-full min-h-screen items-center py-8 pt-24 lg:pt-8">

          <div className="w-full flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-md">
                Add Prompts
              </button>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((m) => (
              <MetricCard key={m.key} title={m.title} value={m.value} icon={m.icon}/>
            ))}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Clusters</h3>
                  <p className="text-sm text-gray-500">Top clusters and similarity metrics</p>
                </div>
                <div className="text-sm text-gray-500">{clusters.length} clusters</div>
              </div>

              <div className="flex flex-col gap-2">
                {clusters.length === 0 ? (
                  <div className="text-sm text-gray-500 py-6 text-center">No clusters yet — add prompts to generate clusters</div>
                ) : (
                  clusters.slice(0, 6).map((c, i) => <ClusterRow key={i} c={c} />)
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">Prototype separation and similarity help you understand cluster cohesion</div>
                <button className="text-sm text-indigo-600">View all clusters</button>
              </div>
            </div>
          </div>

          {/* optional analytics footer */}
          <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold mb-2">Token Cost (7d)</h4>
              <div className="text-2xl font-extrabold">{formatCost(overview.averageTokenCost)}</div>
              <p className="text-xs text-gray-500 mt-2">Average token cost per prompt</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold mb-2">Prototype Coverage</h4>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold">{calculateCoverage(clusters)}%</div>
                <div className="text-xs text-gray-500">Prototypes across clusters</div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
              <div className="flex flex-col gap-2 mt-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"> Index prompts</button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"> Cluster prompts</button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"> Manage labels</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// small helpers
function formatCost(n: number | undefined | null) {
  if (n === null || n === undefined) return '—';
  // assume n is token cost in cents or small integer: format as USD-like
  const asNumber = Number(n) || 0;
  if (asNumber === 0) return '0';
  return `$${(asNumber).toFixed(2)}`;
}

function calculateCoverage(clusters: Array<{ prototype_size: number }>) {
  if (!clusters || clusters.length === 0) return 0;
  const totalPrototypes = clusters.reduce((s, c) => s + (c.prototype_size || 0), 0);
  const coverage = Math.min(100, Math.round((totalPrototypes / Math.max(1, totalPrototypes + 4)) * 100));
  return coverage;
}
