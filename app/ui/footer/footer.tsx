'use client'

import FooterLinks from './footer-links';
import InformationMenu from '@/app/ui/common/info-menu';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const hide = pathname !== '/';

  if(hide) return null

  return (
    <footer className="flex flex-col w-full mt-auto relative">
   
          <div className="flex flex-col items-center text-center justify-center px-8 gap-4 py-8 z-10">
            <FooterLinks />
          </div>

          <div className="w-full flex justify-center py-12 overflow-hidden relative">
            <h1 className="font-extrabold text-center leading-none select-none pointer-events-none max-w-full break-words relative z-10
               text-[4rem] sm:text-[6rem] md:text-[10vw] lg:text-[12rem]">
              <span
                className="block relative z-10"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px),
                    linear-gradient(to right, #4f46e5, #a78bfa, #818cf8)
                  `,
                  backgroundSize: '20px 20px, 100% 100%',
                  backgroundPosition: '0 0, 0 0',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                SERELEUM
              </span>
            </h1>
          </div>
      {/* <div className="fixed bottom-4 right-4 z-20">
        <InformationMenu />
      </div> */}
      <p className="text-gray-400 text-center pb-8">
        Copyright © {new Date().getFullYear()} Sereleum. All rights reserved.
      </p>
    </footer>
  );
}
