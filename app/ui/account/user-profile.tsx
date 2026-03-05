'use client';

import React, { useState, useRef, useEffect } from 'react';
import { faUserCircle, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfileWidgetProps } from '@/app/types';
import Link from 'next/link';
import { logout } from '@/app/lib/server/auth';

export default function UserProfileWidget({ userId, credits }: UserProfileWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
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

  // Decide dropdown direction when opening
  const handleToggle = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 160; // approximate height of your dropdown in px
      setDropUp(spaceBelow < dropdownHeight);
    }
    setIsOpen(prev => !prev);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center p-2 justify-start hover:bg-gray-200 rounded-md"
      >
        <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4 rounded-full" />
        <span className="hidden sm:inline-block ml-2 text-sm font-medium truncate">
          {userId}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 w-48 p-4 bg-white rounded-md shadow-md z-50 flex flex-col gap-2 text-sm border border-gray-200 ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <Link
            href="/dashboard/account"
            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
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
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
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