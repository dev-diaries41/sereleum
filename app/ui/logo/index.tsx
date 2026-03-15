import { LogoProps } from '@/app/types';
import Image from 'next/image';

export default function Logo({
  src,
  name,
  width = 30,
  height = 30,
  nameSize = 'text-2xl',
}: LogoProps) {
  return (
    <div className={`flex items-center gap-1`}>
      <Image
        src={src}
        alt="Sereleum logo"
        width={width}
        height={height}
        priority = {true}
        className="object-contain rounded-sm"
      />
      {name && <h1 className={`${nameSize} font-medium`}>{name}</h1>}
    </div>
  );
}
