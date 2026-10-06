'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex] || images[0] || '';

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
        {currentImage && (
          <Image
            src={currentImage}
            alt="Product visual"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {images.map((img, idx) => (
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
              <Image src={img} alt={`Thumbnail ${idx}`} fill sizes="74px" style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
