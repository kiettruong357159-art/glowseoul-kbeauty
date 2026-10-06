import React from 'react';
import Link from 'next/link';
import { Droplets, Sparkles, Shield, HeartHandshake } from 'lucide-react';

const skinTypes = [
  {
    type: 'oily',
    title: 'Da Dầu & Lỗ Chân Lông',
    desc: 'Kiểm soát bã nhờn, se khít lỗ chân lông, không gây bí da',
    icon: Droplets,
    badge: 'Pore Care',
    color: '#0284c7',
    bg: '#f0f9ff',
  },
  {
    type: 'dry',
    title: 'Da Khô & Thiếu Nước',
    desc: 'Cấp ẩm đa tầng HA, nuôi dưỡng da căng mọng, phục hồi màng ẩm',
    icon: Sparkles,
    badge: 'Hydration 24h',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    type: 'sensitive',
    title: 'Da Nhạy Cảm & Dễ Đỏ',
    desc: 'Thành phần ốc sên & diếp cá, làm dịu và củng cố hàng rào da',
    icon: Shield,
    badge: 'Soothing Barrier',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    type: 'acne',
    title: 'Da Mụn & Tổn Thương',
    desc: 'Tràm trà & rau má kháng khuẩn, gom cồi mụn nhanh chóng',
    icon: HeartHandshake,
    badge: 'Acne Relief',
    color: '#e11d48',
    bg: '#fff1f2',
  },
];

export default function SkinTypeSelector() {
  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              letterSpacing: '1px',
            }}
          >
            Chăm Sóc Cá Nhân Hóa
          </span>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              marginTop: '4px',
              letterSpacing: '-0.5px',
            }}
          >
            Lựa Chọn Theo Loại Da Của Bạn
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Chu trình K-Beauty chuyên biệt giúp giải quyết đúng vấn đề của từng làn da
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {skinTypes.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.type}
                href={`/products?skinType=${item.type}`}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 20px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: item.bg,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: item.bg,
                      color: item.color,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  {item.desc}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Xem sản phẩm phù hợp →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
