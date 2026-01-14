'use client';

import { useState, useRef, useEffect } from 'react';
import { reveliumClient } from '@/app/revelium/client';
import { faChevronDown, faFlask } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClusterAccuracy, UNLABELLED_CLUSTER } from '@/app/types';
import { MetricsItem } from '../dashboard/metrics-item';
import Link from 'next/link';
import { usePrompts } from '@/app/providers/prompts';

export function ClusterAccuracyPlayground() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ClusterAccuracy | null>(null);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>([]);
  const {clusters} = usePrompts()

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const runAccuracy = async () => {
    setRunning(true);
    try {
      const res = await reveliumClient.calculateClusterAccuracy();
      setResult(res);
    } finally {
      setRunning(false);
    }
  };

  const pct = (v?: number) =>
    v == null ? '—' : `${Math.round(v * 100)}%`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedClusterIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mr-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faFlask} />
            Cluster Accuracy Playground
          </h2>
          <p className="text-sm text-gray-500">
            Measure clustering accuracy against labelled assignments.
          </p>
        </div>
      </div>

      {/* Input Section */}
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
          {/* Custom dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
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
                    checked={selectedClusterIds.includes('Unclustered')}
                    onChange={() => toggleSelection('Unclustered')}
                  />
                  Unclustered
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
            Run evaluation
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h4 className="text-sm font-semibold mb-4">Accuracy summary</h4>
            <MetricsItem
              label="Mean accuracy"
              value={pct(result.mean_accuracy)}
              largeValue={pct(result.mean_accuracy)}
            />
          </aside>

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h4 className="text-sm font-semibold mb-4">Accuracy by cluster label</h4>
            <div className="space-y-3">
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
