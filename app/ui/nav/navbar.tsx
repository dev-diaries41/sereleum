'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HeaderProps, NavItemsProps } from '@/app/types';
import { navLinks } from '@/app/constants/navigation';
import NavLinks from './links';

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
  const stage = process.env.NEXT_PUBLIC_APP_STAGE;
  const mainCTA = stage === "mvp"? "Get Free Report" : "Analyse Prompts";

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

    // Cleanup when component is unmounted
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredHeaderLinks = navLinks.filter((link) => !['License', 'Terms', 'Privacy Policy', 'Guide', 'Home'].includes(link.name));
  const filteredMobHeaderLinks = navLinks.filter((link) => !['License', 'Terms', 'Privacy Policy', 'Guide'].includes(link.name));

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
          <div className="absolute top-0 right-0 pb-32 flex flex-col min-h-screen w-full opacity-95 bg-white text-lg pt-16 p-4 z-40" id='navbar-menu'>
            <NavLinks navItems={filteredMobHeaderLinks} />
            <Link
              href={email ? '/dashboard' : '/login'}
              className="w-auto ml-auto flex items-center justify-center mt-auto mb-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 px-4 rounded-lg text-sm md:text-md"
            >
              {email ? 'Analyse prompts' : 'Log in'}
            </Link>
          </div>
        )}
      </div>
      <div className="md:flex items-center gap-5 hidden">
        <NavBarItems navItems={filteredHeaderLinks} />
        <Link
          href={email ? '/dashboard' : '/login'}
          className="flex w-auto items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 px-4 rounded-lg text-sm md:text-md"
        >
          {email ? mainCTA : 'Log in'}
        </Link>
      </div>
    </nav>
  );
}