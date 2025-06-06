import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CustomImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className: string;
}

export default function CustomImage({ src, alt, width, height, className }: CustomImageProps) {
  const [error, setError] = useState(false);
  const isProfile = alt.toLowerCase().includes('perfil');
  const fallback = isProfile
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random&size=100`
    : 'https://placehold.co/300x200?text=Imagem';
  return (
    <Image
      src={!src || error ? fallback : src}
      alt={alt}
      width={width}
      height={height}
      className={cn(className, 'object-cover', isProfile && 'rounded-full')}
      onError={() => setError(true)}
    />
  );
}
