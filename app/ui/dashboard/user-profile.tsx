'use client';

import React, { useState, useRef, useEffect } from 'react';
import { faUserCircle, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfileWidgetProps } from '@/app/types';
import Link from 'next/link';
import { logout } from '@/app/lib/server/actions';

export default function UserProfileWidget({ userId, credits }: UserProfileWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="w-full flex items-center p-2 justify-center hover:bg-gray-200 dark:hover:bg-[#444] rounded-md"
      >
        <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4 rounded-full" />
        <span className="hidden sm:inline-block ml-2 text-sm font-medium truncate">
          {userId}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 w-48 p-4 bg-white dark:bg-[#333] rounded-md shadow-md z-50 flex flex-col gap-2 text-sm">
          <Link
            href="/dashboard/account"
            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#444]"
          >
            <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4" />
            Account
          </Link>
          <form
            action={async () => {
              await logout();
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#444]"
            >
              <FontAwesomeIcon icon={faSignOut} className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </form>
          <span className="sm:hidden w-full p-2 rounded-md opacity-50 font-medium">
            {credits} Credits
          </span>
        </div>
      )}
    </div>
  );
}
