'use client';

import React from 'react';
import { CheckCircle2, Clock, Package, Truck } from 'lucide-react';

export function getOrderStatusStep(status: string): number {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 0;
    case 'preparing':
      return 1;
    case 'shipping':
      return 2;
    case 'completed':
      return 3;
    default:
      return 0;
  }
}

const STEPS = [
  { label: 'Đã xác nhận', icon: CheckCircle2, desc: 'Đơn hàng đã được tiếp nhận' },
  { label: 'Đang đóng gói', icon: Package, desc: 'Kiểm tra & bọc chống sốc' },
  { label: 'Đang vận chuyển', icon: Truck, desc: 'Giao cho đơn vị vận chuyển' },
  { label: 'Thành công', icon: Clock, desc: 'Khách hàng nhận hàng' },
];

export default function OrderStatusTracker({ status }: { status: string }) {
  const currentStep = getOrderStatusStep(status);

  return (
    <div style={{ padding: '24px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          position: 'relative',
          gap: '12px',
        }}
      >
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isDone ? 'var(--color-primary)' : 'var(--color-border)',
                  color: isDone ? 'white' : 'var(--color-text-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.3s ease',
                  marginBottom: '10px',
                  zIndex: 2,
                }}
              >
                <Icon size={20} />
              </div>

              {/* Step Title & Desc */}
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: isCurrent ? '800' : '600',
                  color: isDone ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                  marginBottom: '2px',
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  maxWidth: '120px',
                }}
              >
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
