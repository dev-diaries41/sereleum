'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import PopUp from '../common/popup';
import { Prompt, UNLABELLED_CLUSTER, UNCLUSTERED } from '@/app/types/prompts';
import usePopUp from '@/app/hooks/usePopUp';
import { usePrompts } from '@/app/providers/prompts';

interface PromptsTableViewProps {
  scrollLoadThreshold?: number;
}

export default function PromptsTableView({
  scrollLoadThreshold = 0.8,
}: PromptsTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { popUpCta, popUpDescription, popUpTitle, showPopUp, closePopUp } = usePopUp();
  const { prompts, clusters, onUpdatePrompt, onLoadMorePrompts } = usePrompts();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const limit = 10;
  let offset = useRef(prompts.length); // already loaded first batch

  const handleLabelChange = (prompt: Prompt, newClusterId: string) => {
    const updatedPrompt = {
      ...prompt,
      metadata: { ...prompt.metadata, cluster_id: newClusterId },
    };

    onUpdatePrompt(updatedPrompt, newClusterId);
  };

  // Reset the loading flag when prompts array changes (so subsequent loads can be requested)
  useEffect(() => {
    loadingRef.current = false;
  }, [prompts.length]);

  useEffect(() => {
    const handler = () => {
      const el = containerRef.current;
      if (el && el.scrollHeight > 0) {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const ratio = (scrollTop + clientHeight) / scrollHeight;
        if (ratio >= scrollLoadThreshold && !loadingRef.current) {
          loadingRef.current = true;
          onLoadMorePrompts(limit, offset.current);
          offset.current = offset.current + limit
        }
        return;
      }

      // Fallback to window/document scrolling
      // const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // const scrollHeight = document.documentElement.scrollHeight;
      // const clientHeight = window.innerHeight;
      // const ratio = (scrollTop + clientHeight) / scrollHeight;
      // if (ratio >= scrollLoadThreshold && !loadingRef.current) {
      //   loadingRef.current = true;
      //     onLoadMorePrompts(limit, offset.current);
      //     offset.current = offset.current + limit
      // }
    };

    // Attach listeners
    window.addEventListener('scroll', handler, { passive: true });
    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('scroll', handler, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handler);
      if (containerEl) {
        containerEl.removeEventListener('scroll', handler);
      }
    };
  }, [onLoadMorePrompts, scrollLoadThreshold]);

  const filteredPrompts = prompts.filter(
    (p) =>
      p.prompt_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.metadata.cluster_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center p-8">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Prompts</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by prompt ID, cluster, label, or content..."
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        />
      </div>

      <div
        ref={containerRef}
        className="overflow-x-auto w-full bg-white"
      >
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
            {filteredPrompts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No prompts match the current filters.
                </td>
              </tr>
            ) : (
              filteredPrompts.map((prompt) => {
                const clusterId = prompt.metadata.cluster_id;
                const isLinkable = clusterId !== UNCLUSTERED;

                return (
                  <tr
                    key={prompt.prompt_id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="border px-4 py-2">{prompt.prompt_id}</td>

                    <td className="border px-4 py-2">
                      {isLinkable ? (
                        <Link
                          href={`/dashboard/clusters/cluster/${clusterId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {clusterId}
                        </Link>
                      ) : (
                        <span>{clusterId}</span>
                      )}
                    </td>

                    <td
                      className="border px-4 py-2 w-1/6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={prompt.metadata.cluster_id}
                        onChange={(e) => handleLabelChange(prompt, e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value={UNCLUSTERED}>{UNCLUSTERED}</option>
                        {clusters.map((c) => (
                          <option key={c.prototype_id} value={c.prototype_id}>
                            {c.label === UNLABELLED_CLUSTER ? c.prototype_id : c.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border px-4 py-2">{prompt.content}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
