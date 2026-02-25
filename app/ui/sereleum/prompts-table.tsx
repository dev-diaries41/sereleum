'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PopUp from '../common/popup';
import { Prompt, UNLABELLED_CLUSTER, UNCLUSTERED } from '@/app/types/prompts';
import usePopUp from '@/app/hooks/usePopUp';
import { usePrompts } from '@/app/providers/prompts';

interface PromptsTableViewProps {
  pageSize?: number;
}

export default function PromptsTableView({ pageSize = 10 }: PromptsTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { popUpCta, popUpDescription, popUpTitle, showPopUp, closePopUp } = usePopUp();
  const { prompts, clusters, promptsOverview, onUpdatePrompt, onLoadMorePrompts } = usePrompts();

  const handleLabelChange = (prompt: Prompt, newClusterId: string) => {
    const updatedPrompt = {
      ...prompt,
      metadata: { ...prompt.metadata, cluster_id: newClusterId },
    };
    onUpdatePrompt(updatedPrompt, newClusterId);
  };

  const toggleExpanded = (promptId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(promptId)) next.delete(promptId);
      else next.add(promptId);
      return next;
    });
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.metadata.cluster_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.data.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute pagination
  const start = page * pageSize;
  const end = start + pageSize;
  const pagePrompts = filteredPrompts.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(promptsOverview.total_prompts / pageSize));

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
      const needMore = end >= prompts.length;
      if (needMore) {
        onLoadMorePrompts(pageSize, prompts.length);
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-4">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between mb-12">
        <h1 className="text-2xl md:text-3xl">Prompts</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // reset to first page when searching
          }}
          placeholder="Search by prompt ID, cluster, label, or content..."
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto w-full rounded-xl">
        <table className="table-fixed border-collapse border border-gray-300 w-full text-sm">
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '46%' }} />
          </colgroup>
          <thead>
            <tr className=" bg-gray-100 text-sm text-gray-500">
              <th className="border px-4 py-2 text-left">Prompt ID</th>
              <th className="border px-4 py-2 text-left">Cluster</th>
              <th className="border px-4 py-2 text-left">Label</th>
              <th className="border px-4 py-2 text-left">Content</th>
            </tr>
          </thead>
          <tbody>
            {pagePrompts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  {searchTerm ? "No prompts match the current filters." : "No prompts stored."}
                </td>
              </tr>
            ) : (
              pagePrompts.map((prompt) => {
                const clusterId = prompt.metadata.cluster_id;
                const isLinkable = clusterId !== UNCLUSTERED;
                const isExpanded = expandedIds.has(prompt.id);

                const collapsedStyle: React.CSSProperties = {
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                };

                const expandedStyle: React.CSSProperties = {
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                };

                return (
                  <tr key={prompt.id} className="hover:bg-gray-50 transition-all duration-200 align-top">
                    <td className="border px-4 py-2 break-words">{prompt.id}</td>

                    <td className="border px-4 py-2 break-words">
                      {isLinkable ? (
                        <Link href={`/dashboard/clusters/cluster/${clusterId}`} className="text-blue-600 hover:underline">
                          {clusterId}
                        </Link>
                      ) : (
                        <span>{clusterId}</span>
                      )}
                    </td>

                    <td className="border px-4 py-2 w-1/6" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={prompt.metadata.cluster_id}
                        onChange={(e) => handleLabelChange(prompt, e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value={UNLABELLED_CLUSTER}>{UNLABELLED_CLUSTER}</option>
                        {clusters.map((c) => (
                          <option key={c.prototype_id} value={c.prototype_id}>
                            {c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      className="border px-4 py-2 cursor-pointer"
                      onClick={() => toggleExpanded(prompt.id)}
                      title={isExpanded ? 'Click to collapse' : 'Click to expand'}
                    >
                      <div style={isExpanded ? expandedStyle : collapsedStyle}>
                        {prompt.data}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-2">
          Page {page + 1} of {totalPages || 1}
        </span>
        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {popUpTitle && popUpDescription && (
        <PopUp
          title={popUpTitle}
          description={popUpDescription}
          onConfirmCta={popUpCta}
          onClose={closePopUp}
          onConfirm={closePopUp}
        />
      )}
    </div>
  );
}
