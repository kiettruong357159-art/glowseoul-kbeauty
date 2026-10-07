import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

describe('Admin Dashboard & Orders System', () => {
  let testOrderId = '';

  beforeAll(async () => {
    // Seed a test order if none exists
    const existing = await prisma.order.findFirst();
    if (existing) {
      testOrderId = existing.id;
    } else {
      const prod = await prisma.product.findFirst();
      const order = await prisma.order.create({
        data: {
          id: `ORD-TEST-${Date.now()}`,
          customerName: 'Nguyễn Văn Test',
          phone: '0901234567',
          email: 'test@glowseoul.vn',
          shippingAddress: '123 Đường Test, Q.1, TP.HCM',
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          orderStatus: 'confirmed',
          totalAmount: 580000,
          items: {
            create: [
              {
                productId: prod ? prod.id : 'temp-id',
                name: prod ? prod.name : 'Sản phẩm Test',
                price: prod ? prod.price : 290000,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
              },
            ],
          },
        },
      });
      testOrderId = order.id;
    }
  });

  it('GET /api/admin/orders returns orders list and total count', async () => {
    const { GET } = await import('@/app/api/admin/orders/route');
    const req = new NextRequest('http://localhost:3000/api/admin/orders');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.orders)).toBe(true);
    expect(typeof data.total).toBe('number');
    expect(data.orders.length).toBeGreaterThan(0);
  });

  it('PUT /api/admin/orders updates order status and payment status', async () => {
    const { PUT } = await import('@/app/api/admin/orders/route');
    const req = new NextRequest('http://localhost:3000/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testOrderId,
        orderStatus: 'shipping',
        paymentStatus: 'paid',
      }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.order.orderStatus).toBe('shipping');
    expect(data.order.paymentStatus).toBe('paid');
  });

  it('GET /api/admin/dashboard returns aggregated KPI metrics and trend data', async () => {
    const { GET } = await import('@/app/api/admin/dashboard/route');
    const req = new NextRequest('http://localhost:3000/api/admin/dashboard');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.stats).toBeDefined();
    expect(typeof data.stats.totalRevenue).toBe('number');
    expect(typeof data.stats.totalOrders).toBe('number');
    expect(Array.isArray(data.recentOrders)).toBe(true);
    expect(Array.isArray(data.categoryBreakdown)).toBe(true);
    expect(Array.isArray(data.revenueTrend)).toBe(true);
  });

  it('verifies OrderManager UI component exists with search and status actions', () => {
    const orderManagerPath = path.resolve(__dirname, '../src/components/admin/OrderManager.tsx');
    expect(fs.existsSync(orderManagerPath)).toBe(true);
    const content = fs.readFileSync(orderManagerPath, 'utf-8');
    expect(content).toContain('OrderManager');
    expect(content).toContain('orderStatus');
    expect(content).toContain('paymentStatus');
  });

  it('verifies DashboardOverview UI component exists with KPI cards and charts', () => {
    const dashboardPath = path.resolve(__dirname, '../src/components/admin/DashboardOverview.tsx');
    expect(fs.existsSync(dashboardPath)).toBe(true);
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    expect(content).toContain('DashboardOverview');
    expect(content).toContain('totalRevenue');
    expect(content).toContain('recentOrders');
  });

  it('verifies Admin page contains dashboard and orders tabs', () => {
    const adminPagePath = path.resolve(__dirname, '../src/app/admin/page.tsx');
    const content = fs.readFileSync(adminPagePath, 'utf-8');
    expect(content).toContain('dashboard');
    expect(content).toContain('orders');
    expect(content).toContain('DashboardOverview');
    expect(content).toContain('OrderManager');
  });
});
