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
    <div className='flex items-center'>
      {name && <h1 className='w-full text-2xl font-bold'>{name}</h1>}
       <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            // className="relative w-10 h-10"
          />
    </div>
  );
};
