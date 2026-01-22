'use client';

import { Cluster, UNCLUSTERED, UNLABELLED_CLUSTER } from '@/app/types';
import DropDownMenu from '@/app/ui/common/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ClusterListSideNavWrapperProps {
  title?: string;
  clusters: Cluster[];
  onDelete: (clusterId: string) => void;
}

export default function ClusterListSideNavWrapper({
  title = 'Top clusters',
  clusters,
  onDelete,
}: ClusterListSideNavWrapperProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropDownMenu title={title}>
      {clusters.map((cluster) => (
        <div
          key={cluster.prototype_id}
          className="relative p-2 flex justify-between items-center text-sm hover:bg-gray-200 rounded-md transition group"
        >
          <Link
            href={`/dashboard/clusters/cluster/${cluster.prototype_id}`}
            className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap pr-2"
          >
            {cluster.label == UNLABELLED_CLUSTER? cluster.prototype_id : cluster.label}
          </Link>

          <button
            onClick={() =>
              setOpenId((prev) =>
                prev === cluster.prototype_id ? null : cluster.prototype_id
              )
            }
            className="opacity-0 group-hover:opacity-100 transition"
          >
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>

          {openId === cluster.prototype_id && (
            <div
              ref={menuRef}
              className="absolute right-0 top-8 z-10 bg-white rounded-md shadow-md w-40"
            >
              <ClusterActionMenu
                onLabel={() => setOpenId(null)}
                onDelete={() => {
                  onDelete(cluster.prototype_id);
                  setOpenId(null);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </DropDownMenu>
  );
}

interface ClusterActionMenuProps {
  onDelete: () => void;
  onLabel: () => void;
}

function ClusterActionMenu({
  onDelete,
  onLabel,
}: ClusterActionMenuProps) {
  return (
    <div className="flex flex-col p-2">
      <button
        onClick={onLabel}
        className="h-8 text-left px-3 hover:bg-gray-200 text-sm rounded-md"
      >
        Label
      </button>
      <button
        onClick={onDelete}
        className="h-8 text-left text-red-500 px-3 hover:bg-gray-200 text-sm rounded-md"
      >
        Delete
      </button>
    </div>
  );
}
