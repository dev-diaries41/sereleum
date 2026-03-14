import { LogoProps } from '@/app/types';
import Image from 'next/image';

export default function Logo({
  src,
  name,
  width = 30,
  height = 30,
}: LogoProps & { color?: string }) {
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
      {name && <h1 className="text-2xl font-medium">{name}</h1>}
    </div>
  );
}
