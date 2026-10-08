'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onExpire?: () => void;
  label?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function calculateTimeLeft(target: string | Date): TimeLeft {
  const targetTime = new Date(target).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, total: diff };
}

export default function CountdownTimer({
  targetDate,
  onExpire,
  label = 'Kết thúc sau',
  compact = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (!isMounted) {
    // Avoid hydration mismatch by rendering placeholder structure
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={16} color="var(--color-primary)" />
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{label}...</span>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 107, 129, 0.08)',
          border: '1px solid rgba(255, 107, 129, 0.2)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          letterSpacing: '0.5px',
        }}
      >
        <Clock size={14} />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {label && (
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Clock size={16} color="var(--color-primary)" />
          {label}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {timeLeft.days > 0 && (
          <>
            <div style={timerBoxStyle}>
              <span style={numberStyle}>{pad(timeLeft.days)}</span>
              <span style={labelStyle}>Ngày</span>
            </div>
            <span style={colonStyle}>:</span>
          </>
        )}

        <div style={timerBoxStyle}>
          <span style={numberStyle}>{pad(timeLeft.hours)}</span>
          <span style={labelStyle}>Giờ</span>
        </div>

        <span style={colonStyle}>:</span>

        <div style={timerBoxStyle}>
          <span style={numberStyle}>{pad(timeLeft.minutes)}</span>
          <span style={labelStyle}>Phút</span>
        </div>

        <span style={colonStyle}>:</span>

        <div style={{ ...timerBoxStyle, borderColor: 'var(--color-primary)' }}>
          <span style={{ ...numberStyle, color: 'var(--color-primary)' }}>{pad(timeLeft.seconds)}</span>
          <span style={labelStyle}>Giây</span>
        </div>
      </div>
    </div>
  );
}

const timerBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '42px',
  padding: '6px 8px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'all 0.2s ease',
};

const numberStyle: React.CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--color-text-main)',
  lineHeight: 1.1,
  fontVariantNumeric: 'tabular-nums',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.625rem',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: 'var(--color-text-subtle)',
  marginTop: '2px',
  letterSpacing: '0.5px',
};

const colonStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: 'var(--color-primary)',
  marginBottom: '6px',
};
