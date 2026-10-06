import { describe, it, expect } from 'vitest';
import { GET as getCoupons, POST as postCoupon, DELETE as deleteCoupon } from '../src/app/api/admin/coupons/route';
import { POST as validateCoupon } from '../src/app/api/coupons/validate/route';
import { NextRequest } from 'next/server';

describe('Admin Coupons & Validation API', () => {
  it('GET /api/admin/coupons returns coupon list', async () => {
    const res = await getCoupons();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.coupons)).toBe(true);
    expect(data.coupons.length).toBeGreaterThan(0);
  });

  it('POST /api/admin/coupons validates code and discount percentage', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({ code: '', discountPercent: -5 }),
    });
    const res = await postCoupon(req);
    expect(res.status).toBe(400);
  });

  it('performs coupon lifecycle: create, validate, and delete', async () => {
    const uniqueCode = `VIP${Date.now()}`;
    // 1. Create
    const createReq = new NextRequest('http://localhost:3000/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({
        code: uniqueCode,
        discountPercent: 15,
        minOrderAmount: 200000,
      }),
    });
    const createRes = await postCoupon(createReq);
    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.coupon.code).toBe(uniqueCode);

    // 2. Validate valid
    const valReq = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: uniqueCode, subtotal: 300000 }),
    });
    const valRes = await validateCoupon(valReq);
    const valData = await valRes.json();
    expect(valRes.status).toBe(200);
    expect(valData.valid).toBe(true);
    expect(valData.discountPercent).toBe(15);
    expect(valData.discountAmount).toBe(45000);

    // 3. Delete
    const delReq = new NextRequest(`http://localhost:3000/api/admin/coupons?id=${created.coupon.id}`);
    const delRes = await deleteCoupon(delReq);
    expect(delRes.status).toBe(200);
  });

  it('validates active coupon successfully when subtotal meets minOrderAmount', async () => {
    const req = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'KBEAUTY10', subtotal: 300000 }),
    });
    const res = await validateCoupon(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.discountPercent).toBe(10);
    expect(data.discountAmount).toBe(30000);
  });

  it('rejects coupon if subtotal is below minimum order amount', async () => {
    const req = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'GLOW20', subtotal: 200000 }), // GLOW20 requires 500k
    });
    const res = await validateCoupon(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.valid).toBe(false);
    expect(data.message).toContain('tối thiểu');
  });

  it('rejects unknown coupon code', async () => {
    const req = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'INVALID_CODE_999', subtotal: 500000 }),
    });
    const res = await validateCoupon(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.valid).toBe(false);
  });

  it('DELETE /api/admin/coupons returns 404 for non-existent coupon', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/coupons?id=non_existent_coupon_999');
    const res = await deleteCoupon(req);
    expect(res.status).toBe(404);
  });
});
