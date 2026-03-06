import React from 'react';
import { LogoProps } from '@/app/types';

export default function Logo({
  src,
  name,
  width = 30,
  height = 30,
  color = '#4F46E5', // optional: allows tint color
}: LogoProps & { color?: string }) {
  return (
    <div className={`flex items-center -translate-x-2`}>
      <div
        className={``}
        style={{
          width: width,
          height: height,
          backgroundColor: color,
          WebkitMaskImage: `url(${src})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          maskImage: `url(${src})`,
          maskRepeat: 'no-repeat',
          maskSize: 'contain',
          maskPosition: 'center',
        }}
      />
      {name && <h1 className="text-2xl font-medium -translate-x-5">{name}</h1>}
    </div>
  );
}
