'use client';

import { useRef } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Cluster, ClusterAccuracy, UNLABELLED_CLUSTER } from '@/app/types';
import { MetricsItem } from '../dashboard/metrics-item';
import Link from 'next/link';

interface ClusterAccuracyPlaygroundProps {
  result: ClusterAccuracy | null;
  clusters: Omit<Cluster, "embedding">[];
  dropdownOpen: boolean;
  selectedClusterIds: string[];
  running: boolean;
  toggleDropDown: () => void;
  toggleSelection: (value: string) => void;
  runAccuracy: () => Promise<void>;
}

export function ClusterAccuracyPlayground({
  result,
  clusters,
  dropdownOpen,
  running,
  selectedClusterIds,
  toggleDropDown,
  toggleSelection,
  runAccuracy

}: ClusterAccuracyPlaygroundProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);


      
    const pct = (v?: number) =>
      v == null ? '—' : `${Math.round(v * 100)}%`;
  
  return (
    <div className="max-w-6xl mr-auto py-6 space-y-6">   
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-2">
          Labelled assignment input
        </h3>
        <p className="text-sm text-gray-500">
          Select existing clusters which have prompts that have been labelled, or{' '}
          <Link
            href="/dashboard/prompts"
            className="underline text-indigo-600 hover:text-indigo-800"
          >
            go to prompts page
          </Link>{' '}
          to label prompts first.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="relative" ref={dropdownRef}   onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                toggleDropDown();
              }
            }}>
            <button
              type="button"
              onClick={toggleDropDown}
              className="text-left px-3 py-2 border rounded-md bg-white border-gray-300"
            >
              {selectedClusterIds.length
                ? selectedClusterIds.join(', ')
                : 'Select clusters'}
              <FontAwesomeIcon icon={faChevronDown} className='px-2 w-4 h-4'/>
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 w-80 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedClusterIds.includes('unclustered')}
                    onChange={() => toggleSelection('unclustered')}
                  />
                  unclustered
                </label>
                {clusters.map((c) => {
                  const id = c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label;
                  const label = c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label;
                  return (
                    <label
                      key={id}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedClusterIds.includes(id)}
                        onChange={() => toggleSelection(id)}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={runAccuracy}
            disabled={running}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            Run
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h4 className="text-sm font-semibold mb-4">Accuracy summary</h4>
            <MetricsItem
              label="Mean accuracy"
              value={pct(result.mean_accuracy)}
              largeValue={pct(result.mean_accuracy)}
            />
          </aside> */}

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="space-y-3">
              <h4 className="text-md font-semibold mb-4">Results</h4>

              <MetricsItem
                label="Overall accuracy"
                value={pct(result.mean_accuracy)}
                largeValue={pct(result.mean_accuracy)}
              />
              
              <h4 className="text-sm font-semibold pt-4">Accuracy by cluster label</h4>
              {Object.entries(result.per_label).map(([label, acc]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border-b border-gray-50 pb-2"
                >
                  <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-gray-500">Per-label accuracy</div>
                  </div>
                  <div className="text-sm font-semibold">{pct(acc)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
