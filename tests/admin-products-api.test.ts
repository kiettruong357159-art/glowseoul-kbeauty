import { describe, it, expect } from 'vitest';
import { GET, POST, PUT, DELETE } from '../src/app/api/admin/products/route';
import { NextRequest } from 'next/server';

describe('Admin Products API', () => {
  it('GET /api/admin/products returns product list and total count', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products');
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.products)).toBe(true);
    expect(typeof data.total).toBe('number');
  });

  it('POST /api/admin/products validates required fields', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('DELETE /api/admin/products returns 404 for non-existent id', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products?id=non_existent_999', {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });

  it('performs full product lifecycle: create, update, delete', async () => {
    // 1. Create
    const createReq = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Serum Dưỡng Trắng K-Beauty Test',
        brand: 'COSRX',
        price: 250000,
        originalPrice: 350000,
        category: 'serum',
        skinType: 'all',
        ingredients: 'Niacinamide 5%',
        description: 'Mô tả thử nghiệm',
        usage: 'Thoa mỗi sáng',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
        stock: 30,
        isBestSeller: true,
        isNew: true,
      }),
    });
    const createRes = await POST(createReq);
    expect(createRes.status).toBe(201);
    const createdData = await createRes.json();
    expect(createdData.product.id).toBeDefined();
    const productId = createdData.product.id;

    // 2. Update
    const updateReq = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'PUT',
      body: JSON.stringify({
        id: productId,
        price: 290000,
        stock: 45,
      }),
    });
    const updateRes = await PUT(updateReq);
    expect(updateRes.status).toBe(200);
    const updatedData = await updateRes.json();
    expect(updatedData.product.price).toBe(290000);
    expect(updatedData.product.stock).toBe(45);

    // 3. Delete
    const deleteReq = new NextRequest(`http://localhost:3000/api/admin/products?id=${productId}`, {
      method: 'DELETE',
    });
    const deleteRes = await DELETE(deleteReq);
    expect(deleteRes.status).toBe(200);
  });
});
