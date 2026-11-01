'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PopUp from '../common/popup';
import { Cluster } from '@/app/types/';
import usePopUp from '@/app/hooks/usePopUp';
import { UNCLUSTERED, UNLABELLED_CLUSTER } from '@/app/constants/clusters';
import { useClusterItems } from '@/app/hooks/useClusterItems';

interface ItemsTableViewProps {
  title?: string;
  pageSize?: number;
  cluster: Cluster;
}

export default function ItemsTable({ 
  cluster ,
  title = 'Items',
  pageSize = 10, 
}: ItemsTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { popUpCta, popUpDescription, popUpTitle, showPopUp, closePopUp } = usePopUp();
  const { items, onMoveItem, onLoadMoreItems } = useClusterItems(cluster);

  const toggleExpanded = (ItemId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(ItemId)) next.delete(ItemId);
      else next.add(ItemId);
      return next;
    });
  };

  const filteredItems = items.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = page * pageSize;
  const end = start + pageSize;
  const pageItems = filteredItems.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(cluster.prototype_size / pageSize));
  const label = cluster.label !== UNLABELLED_CLUSTER ? cluster.label : cluster.id

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
      const needMore = end >= items.length;
      if (needMore) {
        onLoadMoreItems(pageSize, items.length);
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-4">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between mb-12">
        <h1 className="text-xl md:text-2xl">{title}</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // reset to first page when searching
          }}
          placeholder="Search by item ID, cluster, label, or content..."
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
              <th className="border px-4 py-2 text-left">Item Id</th>
              <th className="border px-4 py-2 text-left">Cluster</th>
              <th className="border px-4 py-2 text-left">Content</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  {searchTerm ? "No items match the current filters." : "No items stored."}
                </td>
              </tr>
            ) : (
              pageItems.map((item) => {
                const isLinkable = cluster.id !== UNCLUSTERED;
                const isExpanded = expandedIds.has(item.id);

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
                  <tr key={item.id} className="hover:bg-gray-50 transition-all duration-200 align-top">
                    <td className="border px-4 py-2 break-words">{item.id}</td>

                    <td className="border px-4 py-2 break-words">
                      {isLinkable ? (
                        <Link href={`/dashboard/clusters/cluster/${cluster.id}`} className="text-blue-600 hover:underline">
                          {label}
                        </Link>
                      ) : (
                        <span>{label}</span>
                      )}
                    </td>
                    <td
                      className="border px-4 py-2 cursor-pointer"
                      onClick={() => toggleExpanded(item.id)}
                      title={isExpanded ? 'Click to collapse' : 'Click to expand'}
                    >
                      <div style={isExpanded ? expandedStyle : collapsedStyle}>
                        {item.content}
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
