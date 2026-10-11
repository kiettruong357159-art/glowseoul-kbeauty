import React from 'react';

interface SkeletonBoxProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export default function SkeletonBox({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm, 6px)',
  style,
  className = '',
}: SkeletonBoxProps) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}
