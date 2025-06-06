"use client";

import { useEffect, useState } from 'react';

export function useBannerImage() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const res = await fetch('https://source.unsplash.com/featured/600x200?clinic');
        setUrl(res.url);
      } catch (e) {
        console.error(e);
      }
    }
    fetchImage();
  }, []);

  return url;
}
