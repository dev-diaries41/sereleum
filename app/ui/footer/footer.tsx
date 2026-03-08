'use client'

import FooterLinks from './footer-links';
import InformationMenu from '@/app/ui/common/info-menu';
import { usePathname } from 'next/navigation';
import { GradientWave } from '../background/waves';

export default function Footer() {
  const pathname = usePathname();
  const hide = pathname !== '/';

  if(hide) return null

  return (
    <footer className="flex flex-col w-full mt-auto relative min-h-[300px]">
          <div className="flex flex-col items-center text-center justify-center px-8 gap-4 py-8 z-10">
            <FooterLinks />
          </div>
      {/* <div className="fixed bottom-4 right-4 z-20">
        <InformationMenu />
      </div> */}
      <p className="mt-auto text-gray-400 text-center pb-8">
        Copyright © {new Date().getFullYear()} Sereleum. All rights reserved.
      </p>
         <div className="absolute inset-0 overflow-hidden z-0">
              <GradientWave opacity={0.06} />
              <GradientWave flip opacity={0.02} />
            </div>
    </footer>
  );
}
