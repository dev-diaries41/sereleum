'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './links';
import { sidebarLinks } from '@/app/constants/navigation';
import UserProfileWidget from '../../account/user-profile';
import MobileNav from './mobile';
// import { useSettings } from '@/app/providers/settings';
import Logo from '../../logo';

export default React.memo(function SideNav({ email, credits }: { email: string | null | undefined, credits: number }) {
  const [isOpen, setIsOpen] = useState(false);
  // const { toggleSettings } = useSettings();

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
          <NavLinks navItems={sidebarLinks} />
          <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className='mr-auto px-1'>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 p-3 flex flex-col">
            {/* Uncomment this for settings */}
            {/* <button onClick={() => {
            toggleSettings();
          }} className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
            <FontAwesomeIcon icon={faGear} className='w-4 h-4' />
            Settings
          </button> */}
            {/* <UserPlanWidget userId={email} /> */}
            <UserProfileWidget credits={credits} userId={email} />
          </div>
        </div>
      </div>

      {/* Mobile SideNav */}
      <MobileNav email={email} isOpen={isOpen} onToggleMenu={() => setIsOpen(prev => !prev)} />
    </>
  );
});
