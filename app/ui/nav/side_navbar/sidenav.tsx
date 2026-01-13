'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './links';
import { bottomSidebarLinks, sideBarLinks, topSidebarLinks } from '@/app/constants/navigation';
import UserProfileWidget from '../../account/user-profile';
import MobileNav from './mobile';
import Logo from '../../logo';
import ClusterListSideNavWrapper from '../../revelium/clusters-sidenav';
import { Cluster } from '@/app/types';

export default React.memo(function SideNav({ email, credits, initialClusters }: { email: string | null | undefined, credits: number , initialClusters: Omit<Cluster, "embedding">[]}) {
  const [isOpen, setIsOpen] = useState(false);
  const [clusters, setClusters] = useState<Omit<Cluster, "embedding">[]>(initialClusters)

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
      <div className="fixed flex flex-col w-[240px] min-h-screen bg-white border-r border-gray-200 p-2 lg:block hidden z-[100]">
        <Link
          className="flex w-100 h-20 items-center justify-start rounded-3xl"
          href="/"
        >
          <Logo
            src={'/smartscan-logo.png'}
            alt={'logo'}
            name="Revelium"
          />
        </Link>
        <div className='flex h-full flex-col justify-between'>
          <NavLinks navItems={topSidebarLinks} />
          <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar pb-24">
             <ClusterListSideNavWrapper clusters={clusters}  onDelete={(id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        // existing delete logic here
      }
    }}/>
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
