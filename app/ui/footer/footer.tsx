'use client'

import React from 'react';
import FooterLinks from './footer-links';
import InformationMenu from '@/app/ui/common/info-menu';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const hide = pathname !== '/';

  return (
    <footer className="flex flex-col w-full mt-auto relative">
      {!hide && (
        <>
          {/* Links and copyright */}
          <div className="flex flex-col items-center text-center justify-center px-8 gap-4 py-8 z-10">
            <FooterLinks />

            <p className="text-gray-400 mt-4">
              Copyright © {new Date().getFullYear()} Revelium. All rights reserved.
            </p>
          </div>

          {/* Large responsive footer text with dots clipped to the letters */}
          <div className="w-full flex justify-center py-12 overflow-hidden relative">
            <h1 className="font-extrabold text-center text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none select-none pointer-events-none max-w-full break-words relative z-10">
              <span
                className="relative z-10 block"
                style={{
                  // two-layer background: top = dot pattern, bottom = gradient color
                  backgroundImage: `
                    radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px),
                    linear-gradient(to bottom, #34d399, #8b5cf6)
                  `,
                  // size: first value controls dot spacing, second fills the text
                  backgroundSize: '20px 20px, 100% 100%',
                  backgroundPosition: '0 0, 0 0',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                REVELIUM
              </span>
            </h1>
          </div>
        </>
      )}

      <div className="fixed bottom-4 right-4 z-20">
        <InformationMenu />
      </div>
    </footer>
  );
}
