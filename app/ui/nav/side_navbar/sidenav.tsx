'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './links';
import { topSidebarLinks } from '@/app/constants/navigation';
import UserProfileWidget from '../../account/user-profile';
import MobileNav from './mobile';
import Logo from '../../logo';
import ClusterListSideNavWrapper from '../../sereleum/clusters-sidenav';
import { usePrompts } from '@/app/providers/prompts';

export const SidenavToggleIcon = ({ open = true }) => (
  <div
    className="relative w-4 h-4 border-2 border-gray-400 rounded-sm mr-4"
    aria-hidden
  >
    {open && (
      <div className="absolute left-0 top-0 h-full w-1 border-r-2 border-gray-400" />
    )}
  </div>
);


interface SideNavProps { 
  email: string | null | undefined, 
  credits: number;
}
export default React.memo(function SideNav({ email, credits }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {topClusters} = usePrompts()

  // Prevent background scrolling when the mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop SideNav */}
      <div className="fixed flex flex-col w-[240px] min-h-screen bg-gray-50 border-r border-gray-200 p-2 lg:block hidden z-[100]">
        <div className='w-full flex flex-row justify-between items-center mb-2'>
          <Link
            className="flex items-center justify-start rounded-3xl"
            href="/"
          >
            <Logo
              src={'/sereleum-infinity-logo.png'}
              width={80} 
              height={80}
              alt={'logo'}
            />
          </Link>
          <button>
            <SidenavToggleIcon/>
          </button>
        </div>
       
        <div className='flex h-full flex-col justify-between'>
          <NavLinks navItems={topSidebarLinks} />
          <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar pb-24 mt-4">
             <ClusterListSideNavWrapper clusters={topClusters}/>
          </div>
          <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col">
            <UserProfileWidget credits={credits} userId={email} />
          </div>
        </div>
      </div>

      {/* Mobile SideNav */}
      <MobileNav email={email} isOpen={isOpen} onToggleMenu={() => setIsOpen(prev => !prev)} />
    </>
  );
});
