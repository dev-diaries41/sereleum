
'use client'
import Link from 'next/link';
import Logo from '../logo';
import { usePathname, useSearchParams } from 'next/navigation';
import { shouldShow } from '@/app/lib/helpers';
import { HeaderProps } from '@/app/types';
import { dashboardLinks } from '@/app/constants/navigation';
import DashboardNavBar from './dashboard-navbar';

export default function DashboardHeader({ email, className }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const show = shouldShow(pathname, ['/dashboard']) ||
    (callbackUrl && new URL(callbackUrl).pathname === '/dashboard');

  if (!show) return null;

  return (
    <header className={className || 'relative z-50 w-full pt-2'}>
      <div className="mx-auto flex w-full max-w-7xl items-center px-4">
        <Link href="/" className="z-50 shrink-0">
          <Logo width={24} height={32} src="/sereleum-infinity-logo.png" />
        </Link>

        <div className="ml-auto w-auto md:ml-8 md:flex-1">
          <DashboardNavBar email={email} navBarItems={dashboardLinks} />
        </div>
      </div>
    </header>
  );
}
