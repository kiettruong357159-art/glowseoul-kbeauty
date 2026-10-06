import { describe, it, expect } from 'vitest';
import { GET, PUT } from '../src/app/api/admin/banners/route';
import { NextRequest } from 'next/server';

describe('Admin Banners API', () => {
  it('GET /api/admin/banners returns banner list', async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.banners)).toBe(true);
    expect(data.banners.length).toBeGreaterThan(0);
  });

  it('PUT /api/admin/banners updates existing banner', async () => {
    const listRes = await GET();
    const { banners } = await listRes.json();
    const targetBanner = banners[0];

    const req = new NextRequest('http://localhost:3000/api/admin/banners', {
      method: 'PUT',
      body: JSON.stringify({
        id: targetBanner.id,
        title: 'New Promotional Title 2026',
      }),
    });
    const updateRes = await PUT(req);
    const updateData = await updateRes.json();
    expect(updateRes.status).toBe(200);
    expect(updateData.banner.title).toBe('New Promotional Title 2026');
  });

  it('PUT /api/admin/banners rejects request without ID', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/banners', {
      method: 'PUT',
      body: JSON.stringify({ title: 'No ID provided' }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it('PUT /api/admin/banners returns 404 for non-existent banner', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/banners', {
      method: 'PUT',
      body: JSON.stringify({ id: 'non_existent_banner_999', title: 'Test' }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(404);
  });
});
