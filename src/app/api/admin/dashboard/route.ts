import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DAY_MS = 24 * 60 * 60 * 1000;
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

interface CategoryRevenueRow {
  category: string;
  count: number;
  revenue: number;
}

interface DailyRevenueRow {
  day: string;
  revenue: number;
  ordersCount: number;
}

export async function GET() {
  try {
    const categoryNames: Record<string, string> = {
      serum: 'Serum & Tinh Chất',
      sunscreen: 'Kem Chống Nắng',
      mask: 'Mặt Nạ Dưỡng Da',
      toner: 'Nước Hoa Hồng (Toner)',
      cleanser: 'Sữa Rửa Mặt',
      makeup: 'Trang Điểm',
      other: 'Khác',
    };

    // Mốc 7 ngày gần nhất theo múi giờ Việt Nam (UTC+7), gồm cả hôm nay
    const vnToday = new Date(Date.now() + VN_OFFSET_MS);
    const vnTodayStartUtc =
      Date.UTC(vnToday.getUTCFullYear(), vnToday.getUTCMonth(), vnToday.getUTCDate()) - VN_OFFSET_MS;
    const trendSince = new Date(vnTodayStartUtc - 6 * DAY_MS);

    // 1. High-Performance Database Aggregations for Financial KPIs (No full-table loading into RAM)
    const [
      revenueAgg,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      lowStockCount,
      productCount,
      recentOrders,
      categoryRows,
      dailyRows,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true },
        where: { orderStatus: { not: 'cancelled' } },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'confirmed' } }),
      prisma.order.count({ where: { orderStatus: 'delivered' } }),
      prisma.product.count({ where: { stock: { lte: 15 } } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.$queryRaw<CategoryRevenueRow[]>`
        SELECT p."category" AS category,
               COALESCE(SUM(oi."quantity"), 0)::float8 AS count,
               COALESCE(SUM(oi."price" * oi."quantity"), 0)::float8 AS revenue
        FROM "OrderItem" oi
        JOIN "Product" p ON p."id" = oi."productId"
        JOIN "Order" o ON o."id" = oi."orderId"
        WHERE o."orderStatus" <> 'cancelled'
        GROUP BY p."category"
        ORDER BY revenue DESC
      `,
      prisma.$queryRaw<DailyRevenueRow[]>`
        SELECT to_char(o."createdAt" AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD') AS day,
               COALESCE(SUM(o."totalAmount"), 0)::float8 AS revenue,
               COUNT(*)::float8 AS "ordersCount"
        FROM "Order" o
        WHERE o."orderStatus" <> 'cancelled' AND o."createdAt" >= ${trendSince}
        GROUP BY 1
      `,
    ]);

    const totalRevenue = revenueAgg._sum.totalAmount || 0;
    const validOrdersCount = revenueAgg._count.id || 0;
    const averageOrderValue = validOrdersCount > 0 ? Math.round(totalRevenue / validOrdersCount) : 0;

    // Doanh thu danh mục tính thật từ OrderItem (không tính đơn đã hủy)
    const categoryBreakdown = categoryRows.map((row) => ({
      category: row.category,
      name: categoryNames[row.category] || row.category,
      count: Number(row.count),
      revenue: Number(row.revenue),
    }));

    // Xu hướng 7 ngày: ngày không có đơn hiển thị 0
    const dailyMap = new Map(dailyRows.map((row) => [row.day, row]));
    const revenueTrend: { day: string; revenue: number; ordersCount: number }[] = [];
    for (let offset = 0; offset < 7; offset++) {
      const dayStart = new Date(vnTodayStartUtc - (6 - offset) * DAY_MS + VN_OFFSET_MS);
      const row = dailyMap.get(dayStart.toISOString().slice(0, 10));
      revenueTrend.push({
        day: WEEKDAY_LABELS[dayStart.getUTCDay()],
        revenue: row ? Number(row.revenue) : 0,
        ordersCount: row ? Number(row.ordersCount) : 0,
      });
    }

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        averageOrderValue,
        lowStockCount,
        productCount,
      },
      recentOrders,
      categoryBreakdown,
      revenueTrend,
    });
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    return NextResponse.json(
      { error: 'Không thể tổng hợp dữ liệu dashboard' },
      { status: 500 }
    );
  }
}
