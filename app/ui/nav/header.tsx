'use client'
import React from 'react';
import Link from 'next/link';
import Logo from '../logo';
import { usePathname, useSearchParams } from 'next/navigation';
import NavBar from './navbar';
import { shouldHide } from '@/app/lib/helpers';
import { HeaderProps } from '@/app/types';
import { navLinks } from '@/app/constants/navigation';



export default function Header({email}: HeaderProps) {
  const pathname = usePathname();
  const pathsToHide = ['/login', '/register', 'reset-password', 'forgot-password', '/dashboard'];
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const hide = shouldHide(pathname, pathsToHide) || (callbackUrl && new URL(callbackUrl).pathname === '/dashboard')
  
  if (hide) {
    return null;
  }

  return (
    <div className={`fixed top-0 w-full pt-2 z-50`}>
      <div className='flex flex-row w-full max-w-7xl mx-auto items-center justify-between px-4'>
        <Link href={'/'} className='z-50'>
          <Logo name="Sereleum" width={24} height={32} src={'/sereleum-infinity-logo.png'}/>
        </Link>
        <NavBar email={email} navBarItems={navLinks}/>
      </div>
    </div>
  );
};
