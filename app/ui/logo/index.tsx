import React from 'react';
import Image from 'next/image';
import { LogoProps } from '@/app/types';

export default function Logo({
  src,
  name,
  alt = 'logo',
  width = 30,
  height = 30,
}: LogoProps) {
  return (
    <div className='flex items-center space-x-1 p-2'>
       <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            // className="relative w-10 h-10"
          />
        {name && <h1 className='w-full mr-4 text-2xl font-bold'>{name}</h1>}
    </div>
  );
};
