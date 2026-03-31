'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HeaderProps, NavItemsProps } from '@/app/types';
import { navLinks } from '@/app/constants/navigation';
import NavLinks from './links';
import { usePathname } from 'next/navigation';
import UserProfileWidget from '../account/user-profile';

const NavBarItems = ({ navItems }: NavItemsProps) => {
  return (
    <>
      {navItems.map((navItem, index) => {
        return (
          <Link key={index.toString()} href={navItem.link} className=''>
            {navItem.name}
          </Link>
        );
      })}
    </>
  );
};

interface NavBarProps extends Omit<HeaderProps, 'credits'>{

}

export default function NavBar({ email }: NavBarProps) {
  const mainCTA = "Get Free Report";

  const pathname = usePathname();
  const showAccountWidget = pathname.includes("/dashboard")

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Disable background scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';  // Disable scroll
    } else {
      document.body.style.overflow = '';  // Re-enable scroll
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className='flex items-center justify-center gap-5 '>
      <div className="md:hidden">
        <div className='flex flex-row justify-center items-center gap-4'>
          <button
            onClick={toggleMenu}
            className={`navbar-toggler relative z-50 ${isOpen ? "invert dark:invert-0" : ""}`}
            type="button"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className='w-6 h-6' />
          </button>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
        <div className=" absolute top-0 right-0 flex flex-col items-start w-full  min-h-[100dvh] bg-gray-100 border border-r-1 border-gray-300 pt-32 p-6 text-3xl">
          <NavLinks navItems={navLinks} classname='flex flex-col gap-4'/>
             <div className="flex-1"></div>
           {!showAccountWidget? (
          <Link
          href={email ? '/dashboard' : '/login'}
          className="flex w-full items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 px-4 rounded-lg text-sm md:text-md"
        >
          {email ? mainCTA : 'Log in'}
        </Link>
        ): (
            <UserProfileWidget username={email?.split("@")[0]} />
        )}
        </div>
        )}
      </div>
      <div className="md:flex items-center gap-5 hidden">
        <NavBarItems navItems={navLinks} />
        {!showAccountWidget? (
          <Link
          href={email ? '/dashboard' : '/login'}
          className="flex w-auto items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 px-4 rounded-lg text-sm md:text-md"
        >
          {email ? mainCTA : 'Log in'}
        </Link>
        ): (
            <UserProfileWidget username={email?.split("@")[0]} />
        )}
      </div>
    </nav>
  );
}