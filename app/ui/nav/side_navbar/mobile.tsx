
'use client'
import React from 'react';
import Link from 'next/link';
import NavLinks from '../links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { navLinks, sideBarLinks } from '@/app/constants/navigation';
import UserProfileWidget from '../../account/user-profile';
import { faClose, faGear } from '@fortawesome/free-solid-svg-icons';
// import { useSettings } from '@/app/providers/settings';
import { usePathname } from 'next/navigation';
import { shouldHide } from '@/app/lib/helpers';
import Logo from '../../logo';

interface MobileNavProps {
    email: string | null | undefined;
    isOpen: boolean;
    onToggleMenu: () => void;
}
export default function MobileNav({ 
email,
isOpen,
onToggleMenu

}: MobileNavProps){
  // const {toggleSettings}=useSettings();
  const pathname = usePathname();
  const pathsToHide = ['/dashboard/charts'];
  const hide = (shouldHide(pathname, pathsToHide))

  
    return(
      <div className="lg:hidden w-full p-4 fixed top-0 z-50 opacity-95">
{       !hide && <div className=' flex flex-row justify-between bg-transparent items-center'>
          <Link
            className="flex items-center justify-start rounded-ful z-50"
            href="/"
          >
          <Logo name="Sereleum" width={24} height={32} src={'/sereleum-infinity-logo.png'}/>
     
          </Link>
          <div className='flex flex-row justify-end items-center ml-auto'>
            <button
              className={`flex z-50`}
              onClick={onToggleMenu}
            >
              <FontAwesomeIcon icon={isOpen? faClose: faBars} size="lg" className="w-6 h-6" />
            </button>
          </div>
        </div>}

        {isOpen && (
        <div className=" absolute top-0 right-0 flex flex-col items-start w-full  min-h-[100dvh] bg-gray-100 border border-r-1 border-gray-300 pt-32 p-6 text-3xl">
          <NavLinks navItems={sideBarLinks} classname='flex flex-col gap-4'/>
          <div className="flex-1 mr-auto max-h-[50vh] overflow-y-auto mb-8 custom-scrollbar p-1 ">
          </div>
          {/* <button onClick={() => {
            toggleSettings();
            onToggleMenu()
            }}className='flex flex-row items-center justify-start gap-2 p-2 text-sm font-medium mt-auto focus:cursor-pointer'>
            <FontAwesomeIcon icon={faGear} className='w-4 h-4'/>
            Settings
          </button> */}
          <div className='flex flex-col mt-auto'>
            {/* <UserPlanWidget userId={email}/> */}
          </div>
          <div className="w-full rounded-md mt-3">
            <UserProfileWidget username={email?.split("@")[0]} />
          </div>
      </div>
        )}
    </div>
    )
}