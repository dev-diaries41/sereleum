'use client'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItemsProps } from '@/app/types';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
 
export default function NavLinks({navItems}: NavItemsProps) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-4'>
      {navItems.map((navItem) => {
        return (
          <Link
            key={navItem.name}
            href={navItem.link}
            className={clsx(
              'flex h-10 grow items-center justify-center gap-4 rounded-md bg-transparent hover:bg-gray-200 justify-start p-2 px-3',
              {
                'text-blue-500': pathname === navItem.link,
              },
            )}
            {...(navItem.newPage
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {navItem.icon && <FontAwesomeIcon icon={navItem.icon} className="w-6 h-6" />}
            <span className="w-full text-sm">{navItem.name}</span>
          </Link>
        );
      })}
    </div>
  );
}