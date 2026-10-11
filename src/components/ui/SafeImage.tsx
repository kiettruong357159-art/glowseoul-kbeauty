'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import {
  DEFAULT_PRODUCT_IMAGE,
  LOCAL_PLACEHOLDER_IMAGE,
  getProductImageUrl,
} from '@/lib/image-fallback';

export interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: unknown;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_PRODUCT_IMAGE,
  alt = 'Sản phẩm GlowSeoul K-Beauty',
  onError,
  ...restProps
}: SafeImageProps) {
  const initialUrl = getProductImageUrl(src, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Sync state whenever the src or fallback prop changes
  useEffect(() => {
    const nextUrl = getProductImageUrl(src, fallbackSrc);
    setCurrentSrc(nextUrl);
    setErrorCount(0);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (errorCount === 0) {
      // First error: switch to default image if current is different
      setErrorCount(1);
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      } else {
        // If current was already fallbackSrc, fallback to local SVG
        setCurrentSrc(LOCAL_PLACEHOLDER_IMAGE);
      }
    } else if (errorCount === 1) {
      // Second error: fallback to local SVG asset
      setErrorCount(2);
      setCurrentSrc(LOCAL_PLACEHOLDER_IMAGE);
    }

    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...restProps}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
