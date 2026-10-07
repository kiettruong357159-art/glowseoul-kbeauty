import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

describe('Smart Skin Routine Quiz & Bundle Recommendation', () => {
  it('POST /api/quiz returns 4-step routine with bundle discount', async () => {
    const { POST } = await import('@/app/api/quiz/route');

    // 1. Test Oily / Acne profile
    const oilyReq = new NextRequest('http://localhost:3000/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skinType: 'oily',
        concern: 'acne',
        goal: 'minimal',
      }),
    });
    const oilyRes = await POST(oilyReq);
    expect(oilyRes.status).toBe(200);
    const oilyData = await oilyRes.json();

    expect(oilyData.success).toBe(true);
    expect(oilyData.steps).toHaveLength(4);
    expect(oilyData.pricing.discountPercent).toBe(10);
    expect(oilyData.pricing.couponCode).toBe('KBEAUTY10');
    expect(oilyData.pricing.finalPrice).toBe(oilyData.pricing.originalTotal - oilyData.pricing.discountAmount);

    // 2. Test Dry / Hydration profile
    const dryReq = new NextRequest('http://localhost:3000/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skinType: 'dry',
        concern: 'hydration',
        goal: 'glass_skin',
      }),
    });
    const dryRes = await POST(dryReq);
    expect(dryRes.status).toBe(200);
    const dryData = await dryRes.json();
    expect(dryData.profile.routineTitle).toContain('Cấp Ẩm');
  });

  it('verifies /quiz page UI structure and 3-step diagnostic flow', () => {
    const pagePath = path.resolve(__dirname, '../src/app/quiz/page.tsx');
    expect(fs.existsSync(pagePath)).toBe(true);
    const content = fs.readFileSync(pagePath, 'utf-8');

    // Questions
    expect(content).toContain('SKIN_TYPES');
    expect(content).toContain('SKIN_CONCERNS');
    expect(content).toContain('ROUTINE_GOALS');
    expect(content).toContain('currentStep === 1');
    expect(content).toContain('currentStep === 2');
    expect(content).toContain('currentStep === 3');

    // Result & 1-Click Bundle Add
    expect(content).toContain('handleAddBundleToCart');
    expect(content).toContain('KBEAUTY10');
    expect(content).toContain('Thêm trọn bộ vào giỏ hàng');
  });

  it('verifies homepage renders Smart Routine Quiz banner', () => {
    const homePath = path.resolve(__dirname, '../src/app/page.tsx');
    const content = fs.readFileSync(homePath, 'utf-8');

    expect(content).toContain('href="/quiz"');
    expect(content).toContain('Trắc Nghiệm Thông Minh');
    expect(content).toContain('Bắt đầu trắc nghiệm ngay');
  });
});
