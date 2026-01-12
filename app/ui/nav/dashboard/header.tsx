'use client'
import React from 'react';
import Link from 'next/link';
import Logo from '@/app/ui/logo';
import { DashboardHeaderProps } from '@/app/types';
import DashboardNavBar from './navbar';
import { useSession } from 'next-auth/react';


// session?.user.credits used to get latest credits
// fallback credits from session when page initially rendered, which is updated on refresh only
export default function DashboardHeader({email, credits}: DashboardHeaderProps) {
  const {data:session} = useSession();
  return (
    <div className={`fixed top-0 flex flex-row w-full mx-auto items-center justify-between pt-2 z-50`}>
      <div className='flex flex-row w-full max-w-7xl mx-auto items-center justify-between px-4'>
        <Link href={'/'} className='z-50'>
          <Logo name="Revelium" src={'/smartscan-logo.png'}/>
        </Link>
        <DashboardNavBar email={email} credits={session?.user.credits || credits}/> 
      </div>
    </div>
  );
};
