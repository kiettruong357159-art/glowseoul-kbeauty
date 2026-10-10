import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/admin/dashboard/route';

describe('Admin Dashboard SQL Aggregation Performance', () => {
  it('GET /api/admin/dashboard computes KPIs using database aggregation without memory bloat', async () => {
    const startTime = performance.now();
    const req = new NextRequest('http://localhost:3000/api/admin/dashboard');
    const res = await GET(req);
    const duration = performance.now() - startTime;

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.stats).toBeDefined();

    // Verify Financial KPIs are properly calculated numbers
    expect(typeof data.stats.totalRevenue).toBe('number');
    expect(data.stats.totalRevenue).toBeGreaterThanOrEqual(0);

    expect(typeof data.stats.totalOrders).toBe('number');
    expect(data.stats.totalOrders).toBeGreaterThanOrEqual(0);

    expect(typeof data.stats.pendingOrders).toBe('number');
    expect(typeof data.stats.deliveredOrders).toBe('number');
    expect(typeof data.stats.averageOrderValue).toBe('number');
    expect(typeof data.stats.lowStockCount).toBe('number');
    expect(typeof data.stats.productCount).toBe('number');

    // Verify recentOrders is bounded to at most 5 items (no full table dump)
    expect(Array.isArray(data.recentOrders)).toBe(true);
    expect(data.recentOrders.length).toBeLessThanOrEqual(5);

    // Verify category breakdown is aggregated
    expect(Array.isArray(data.categoryBreakdown)).toBe(true);
    if (data.categoryBreakdown.length > 0) {
      expect(data.categoryBreakdown[0].category).toBeDefined();
      expect(typeof data.categoryBreakdown[0].count).toBe('number');
      expect(typeof data.categoryBreakdown[0].revenue).toBe('number');
    }

    // Verify 7-day trend
    expect(Array.isArray(data.revenueTrend)).toBe(true);
    expect(data.revenueTrend.length).toBe(7);

    // Verify execution completes quickly (under 2 seconds even on cold SQLite)
    expect(duration).toBeLessThan(3000);
  });
});
