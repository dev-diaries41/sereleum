'use client';

import { useState } from 'react';
import Link from 'next/link';
import PopUp from '../common/popup';
import { Collection } from '@/app/types/';
import { CollectionType } from '@/app/enums/collections';
import usePopUp from '@/app/hooks/usePopUp';
import { useCollectionItems } from '@/app/hooks/useCollectionItems';

interface ItemsTableViewProps<T extends CollectionType> {
  title?: string;
  pageSize?: number;
  collection: Collection<T>;
}

export default function ItemsTable<T extends CollectionType = CollectionType>({
  collection,
  title = 'Items',
  pageSize = 25,
}: ItemsTableViewProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { popUpCta, popUpDescription, popUpTitle, closePopUp } = usePopUp();

  const {
    items,
    onMoveItems,
    onLoadMoreItems,
  } = useCollectionItems<T>(collection, pageSize);

  const isCluster = collection.type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? 'Cluster' : 'Tag';
  const collectionUrl = isCluster
    ? `/dashboard/clusters/cluster/${collection.id}`
    : `/dashboard/tags/tag/${collection.id}`;


  const toggleExpanded = (itemId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const filteredItems = items.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = page * pageSize;
  const end = start + pageSize;
  const pageItems = filteredItems.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(collection.size / pageSize));

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
      if (end >= items.length) {
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
            setPage(0);
          }}
          placeholder="Search by item ID or content..."
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-300">
        <table className="w-full min-w-full table-auto border-collapse text-sm">
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '64%' }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-500">
              <th className="border border-gray-300 px-4 py-2 text-left">Item Id</th>
              <th className="border border-gray-300 px-4 py-2 text-left">{collectionLabel}</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Content</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-gray-300 py-6 text-center text-gray-500">
                  {searchTerm ? 'No items match the current filters.' : 'No items stored.'}
                </td>
              </tr>
            ) : (
              pageItems.map((item) => {
                const isExpanded = expandedIds.has(item.id);

                return (
                  <tr key={item.id} className="align-top transition-colors duration-200 hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 break-words">
                      {item.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 break-words">
                      <Link href={collectionUrl} className="text-blue-600 hover:underline">
                        {collection.name}
                      </Link>
                    </td>
                    <td
                      className="border border-gray-300 px-4 py-2 cursor-pointer"
                      onClick={() => toggleExpanded(item.id)}
                      title={isExpanded ? 'Click to collapse' : 'Click to expand'}
                    >
                      <div
                        className="break-words"
                        style={
                          isExpanded
                            ? { whiteSpace: 'pre-wrap' }
                            : {
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                              }
                        }
                      >
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
          Page {page + 1} of {totalPages}
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