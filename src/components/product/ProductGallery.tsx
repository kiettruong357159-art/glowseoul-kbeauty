'use client';

import React, { useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { getProductImageArray, DEFAULT_PRODUCT_IMAGE } from '@/lib/image-fallback';

export default function ProductGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const validatedImages = getProductImageArray(images);
  const currentImage = validatedImages[selectedIndex] || validatedImages[0] || DEFAULT_PRODUCT_IMAGE;

  return (
    <div>
      {/* Main Large Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#f8f8f8',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '16px',
        }}
      >
        <SafeImage
          src={currentImage}
          alt="Product visual"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Thumbnails row */}
      {validatedImages.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {validatedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                position: 'relative',
                width: '74px',
                height: '74px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                flexShrink: 0,
                opacity: selectedIndex === idx ? 1 : 0.65,
                transition: 'all 0.2s',
              }}
            >
              <SafeImage src={img} alt={`Thumbnail ${idx}`} fill sizes="74px" style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
