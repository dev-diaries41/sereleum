'use client'
import { DashboardHeaderProps } from '@/app/types';
import UserProfileWidget from '@/app/ui/account/user-profile';

export default function DashboardNavBar({ email, credits }: DashboardHeaderProps) {
  return (
    <nav className='flex items-center justify-center gap-5 '>
      <div className="flex flex-row items-center gap-5">
        <span className="hidden sm:block mt-1 text-sm font-medium truncate">{credits} Credits</span>
        <UserProfileWidget userId={email} credits={credits}/>
      </div>
    </nav>
  );
}
