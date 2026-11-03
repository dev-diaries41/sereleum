
'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HeaderProps } from '@/app/types';
import UserProfileWidget from '../account/user-profile';
import NavLinks from '../nav/links';

interface NavBarProps extends Omit<HeaderProps, 'credits'> {}

export default function DashboardNavBar({ email, navBarItems, className }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <nav className={className || "flex w-full items-center justify-between gap-5"}>
      {/* Mobile navigation */}
      <div className="md:hidden">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative z-50"
            type="button"
            aria-label="Open navigation"
            aria-expanded={isOpen}
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>
        )}

        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex min-h-[100dvh] w-full flex-col bg-gray-100 text-gray-900">
            <div className="flex w-full shrink-0 items-center justify-end px-6 py-5">
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                aria-label="Close navigation"
                className="flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-8">
              <NavLinks
                navItems={navBarItems}
                classname="flex flex-col gap-4"
              />
            </div>

            <div className="shrink-0 p-6">
              <UserProfileWidget username={email?.split("@")[0]} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex w-full items-center gap-8">
        <NavLinks navItems={navBarItems} classname="flex flex-row gap-4" />
        <div className="flex-1" />
        <UserProfileWidget username={email?.split("@")[0]} />
      </div>
    </nav>
  );
}
