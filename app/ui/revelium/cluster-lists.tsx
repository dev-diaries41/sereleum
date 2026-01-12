'use client'
import { Cluster, ClusterMetadata } from '@/app/types';
import React from 'react';
import DropDownMenu from '@/app/ui/common/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassChart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


interface ClusterListWrapperProps {
    clusters: Cluster[];
    onDelete: (clusterId: string) => void
}

export default function ClusterListWrapper({
    clusters,
    onDelete
}: ClusterListWrapperProps) {
    return ( 
        <DropDownMenu title="Recent Analyses">
            {clusters.map((cluster, index) => (
            <div 
            key={index} 
            className="p-2 flex justify-between items-center cursor-pointer opacity-80 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition duration-300 overflow-hidden whitespace-nowrap relative group"
        >
            <Link 
            href={cluster.prototype_id} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap pr-1"
            >
                {cluster.label}
            </Link>
            <FontAwesomeIcon 
                icon={faTrashAlt} 
                className="ml-1 cursor-pointer text-red-500 hover:text-red-700 transition duration-300 opacity-0 group-hover:opacity-100"
                onClick={() => onDelete(cluster.prototype_id)}
            />
            </div>
            ))}
        </DropDownMenu>
    );
}
