"use client"

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export interface CustomImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function CustomImage({
  src,
  fallbackSrc = "/favicon.ico",
  ...props
}: CustomImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
