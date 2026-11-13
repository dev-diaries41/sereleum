
"use client";

import { useState } from "react";
import Link from "next/link";
import PopUp from "../common/popup";
import { Collection, DocItem } from "@/app/types/";
import { CollectionType } from "@/app/enums/collections";
import usePopUp from "@/app/hooks/usePopUp";

interface ItemsTableViewProps<T extends CollectionType> {
  title?: string;
  items: DocItem[];
  collection: Collection<T>;
  isSelecting: boolean;
  isSelected: (itemId: string) => boolean;
  onRowClick: (item: DocItem) => void;
  page: number;
  totalPages: number;
  loading: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export default function ItemsTable<T extends CollectionType = CollectionType>({
  collection,
  title = "Items",
  items,
  isSelecting,
  isSelected,
  onRowClick,
  page,
  totalPages,
  loading,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage
}: ItemsTableViewProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { popUpCta, popUpDescription, popUpTitle, closePopUp } = usePopUp();

  const isCluster = collection.type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? "Cluster" : "Tag";

  const collectionUrl = isCluster
    ? `/dashboard/clusters/cluster/${collection.id}`
    : `/dashboard/tags/tag/${collection.id}`;

  const toggleExpanded = (itemId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);

      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);

      return next;
    });
  };

  // TODO: replace with api search
  const filteredItems = items.filter(
    item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8">
      <div className="w-full flex flex-col gap-8 md:flex-row justify-between mb-12">
        <h1 className="text-xl md:text-2xl">{title}</h1>

        <div className="flex gap-3 w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by item ID or content..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-300">
        <table className="w-full table-auto border-collapse text-sm">
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "75%" }} />
          </colgroup>

          <thead>
            <tr className="bg-gray-100 text-sm text-gray-500">
              <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                Id
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left w-full">
                Content
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-gray-300 py-6 text-center text-gray-500">
                  {loading
                    ? "Loading items..."
                    : searchTerm
                      ? "No items match the current filters."
                      : "No items stored."}
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const expanded = expandedIds.has(item.id);
                const selected = isSelected(item.id);

                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      if (isSelecting) onRowClick(item);
                    }}
                    className={`align-top transition-colors duration-200 hover:bg-gray-50 ${
                      isSelecting ? "cursor-pointer" : ""
                    } ${selected ? "bg-indigo-50" : ""}`}
                  >
                    <td className="border border-gray-300 px-4 py-2 break-words">
                      <div className="flex items-center gap-2">
                        {isSelecting && (
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onRowClick(item)}
                            onClick={e => e.stopPropagation()}
                          />
                        )}
                        {item.id}
                      </div>
                    </td>

                    <td
                      className="border border-gray-300 px-4 py-2 cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();

                        if (isSelecting) onRowClick(item);
                        else toggleExpanded(item.id);
                      }}
                      title={expanded ? "Click to collapse" : "Click to expand"}
                    >
                      <div
                        className="break-words"
                        style={
                          expanded && !isSelecting
                            ? { whiteSpace: "pre-wrap" }
                            : {
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                whiteSpace: "normal",
                                wordBreak: "break-word"
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
          onClick={onPrevPage}
          disabled={!hasPrevPage || loading}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-2 py-2">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
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
