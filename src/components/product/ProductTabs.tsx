'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, CheckCircle2 } from 'lucide-react';

export function parseIngredientsList(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProductTabs({
  description,
  ingredients,
  usage,
}: {
  description: string;
  ingredients: string;
  usage: string;
}) {
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'usage'>('desc');
  const ingredientsList = parseIngredientsList(ingredients);

  return (
    <div style={{ marginTop: '48px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      {/* Tabs Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
        }}
      >
        <button
          onClick={() => setActiveTab('desc')}
          style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '700',
            color: activeTab === 'desc' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'desc' ? '2.5px solid var(--color-primary)' : 'none',
            background: activeTab === 'desc' ? 'white' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          Công dụng & Điểm nổi bật
        </button>

        <button
          onClick={() => setActiveTab('ingredients')}
          style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '700',
            color: activeTab === 'ingredients' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'ingredients' ? '2.5px solid var(--color-primary)' : 'none',
            background: activeTab === 'ingredients' ? 'white' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          Bảng thành phần chính ({ingredientsList.length})
        </button>

        <button
          onClick={() => setActiveTab('usage')}
          style={{
            flex: 1,
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '700',
            color: activeTab === 'usage' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'usage' ? '2.5px solid var(--color-primary)' : 'none',
            background: activeTab === 'usage' ? 'white' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          Hướng dẫn & Routine Step
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ padding: '32px' }}>
        {activeTab === 'desc' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--color-primary)' }}>
              <Sparkles size={20} />
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Hiệu quả mang lại</h3>
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--color-text-main)', marginBottom: '20px' }}>
              {description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                <CheckCircle2 size={16} color="#10B981" /> Công thức dịu nhẹ lành tính
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                <CheckCircle2 size={16} color="#10B981" /> Đã kiểm nghiệm da liễu Hàn Quốc
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                <CheckCircle2 size={16} color="#10B981" /> Không thử nghiệm trên động vật (Cruelty-Free)
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--color-primary)' }}>
              <Shield size={20} />
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Thành phần hoạt tính</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Các hoạt chất được chọn lọc khắt khe giúp nuôi dưỡng làn da khỏe mạnh từ sâu bên trong:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {ingredientsList.map((ing, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    fontSize: '13px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(255, 107, 129, 0.2)',
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
              Quy trình sử dụng chuẩn K-Beauty (Skincare Routine)
            </h3>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--color-text-main)', marginBottom: '24px' }}>
              {usage}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--color-bg)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-muted)',
              }}
            >
              <span>1. Tẩy trang/Rửa mặt</span>
              <span>→</span>
              <span>2. Toner</span>
              <span>→</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: '800' }}>3. Sản phẩm này</span>
              <span>→</span>
              <span>4. Kem dưỡng khóa ẩm</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
