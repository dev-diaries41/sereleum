'use client'
import React, { useState } from 'react';
import { footerLinks } from '@/app/constants/navigation';
import NavLinks from '../nav/links';

export default function InformationMenu () {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative hidden md:block">
      <button
        onClick={toggleMenu}
        className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-2xl focus:outline-none shadow-md"
      >
        ?
      </button>
      {isOpen && (
        <div className="absolute bottom-12 right-0 p-2 bg-white rounded-md shadow-md w-48 z-10">
         <NavLinks navItems={footerLinks}/>
        </div>
      )}
    </div>
  );
};
