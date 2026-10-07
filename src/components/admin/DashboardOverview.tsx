'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, ArrowRight, Truck, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { OrderData } from './OrderManager';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  averageOrderValue: number;
  lowStockCount: number;
  productCount: number;
}

interface CategoryBreakdown {
  category: string;
  name: string;
  count: number;
  revenue: number;
}

interface RevenuePoint {
  day: string;
  revenue: number;
  ordersCount: number;
}

interface DashboardOverviewProps {
  onNavigateTab: (tabId: 'orders' | 'products' | 'taxonomies' | 'coupons' | 'banners') => void;
}

export default function DashboardOverview({ onNavigateTab }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setCategoryBreakdown(data.categoryBreakdown || []);
          setRevenueTrend(data.revenueTrend || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Đang tổng hợp dữ liệu Dashboard báo cáo...
      </div>
    );
  }

  const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue), 1);
  const totalCatRevenue = categoryBreakdown.reduce((sum, c) => sum + c.revenue, 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top 4 KPI Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* KPI 1: Revenue */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff5f7 0%, #ffffff 100%)',
            border: '1px solid rgba(255, 107, 129, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Tổng Doanh Thu</span>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>
            {formatPrice(stats?.totalRevenue || 0)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: '#059669', fontWeight: '700' }}>
            <TrendingUp size={14} />
            <span>+18.4% so với kỳ trước</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Tổng Đơn Hàng</span>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>
            {stats?.totalOrders || 0} đơn
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            <strong>{stats?.pendingOrders || 0}</strong> đơn đang chờ xử lý
          </div>
        </div>

        {/* KPI 3: Average Order Value (AOV) */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Giá Trị TB / Đơn (AOV)</span>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6',
              }}
            >
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>
            {formatPrice(stats?.averageOrderValue || 0)}
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Chuẩn mua sắm K-Beauty
          </div>
        </div>

        {/* KPI 4: Stock Alerts */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)' }}>Cảnh Báo Kho</span>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: (stats?.lowStockCount || 0) > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (stats?.lowStockCount || 0) > 0 ? '#ef4444' : '#10b981',
              }}
            >
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: (stats?.lowStockCount || 0) > 0 ? '#ef4444' : 'var(--color-text-main)', letterSpacing: '-0.5px' }}>
            {stats?.lowStockCount || 0} sản phẩm
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Tồn kho ít hơn 15 món
          </div>
        </div>
      </div>

      {/* Row 2: Charts and Category Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Revenue Trend Visual Bar Chart */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Xu Hướng Doanh Số 7 Ngày</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Thống kê doanh thu bán lẻ thời gian thực
              </p>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Doanh thu tuần này
            </span>
          </div>

          {/* Bar Chart Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', paddingTop: '20px', gap: '12px' }}>
            {revenueTrend.map((pt, idx) => {
              const heightPercent = Math.max(15, Math.round((pt.revenue / maxRevenue) * 100));
              const isToday = idx === revenueTrend.length - 1;

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    {Math.round(pt.revenue / 1000)}k
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '32px',
                      height: `${heightPercent}%`,
                      background: isToday ? 'var(--color-gradient-brand)' : 'rgba(255, 107, 129, 0.35)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease',
                      boxShadow: isToday ? '0 4px 12px rgba(255, 107, 129, 0.3)' : 'none',
                    }}
                    title={`${pt.day}: ${formatPrice(pt.revenue)} (${pt.ordersCount} đơn)`}
                  />
                  <div style={{ fontSize: '12px', fontWeight: isToday ? '800' : '600', color: isToday ? 'var(--color-primary)' : 'var(--color-text-muted)', marginTop: '8px' }}>
                    {pt.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown Progress Bars */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Cơ Cấu Doanh Số Theo Danh Mục</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Tỷ trọng đóng góp vào tổng doanh thu
              </p>
            </div>
            <Sparkles size={18} color="var(--color-primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryBreakdown.slice(0, 5).map((cat, idx) => {
              const percent = Math.min(100, Math.round((cat.revenue / totalCatRevenue) * 100));
              const colors = ['#ff6b81', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
              const color = colors[idx % colors.length];

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{cat.name}</span>
                    <span style={{ fontWeight: '800', color }}>{formatPrice(cat.revenue)} ({percent}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders Table */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Đơn Hàng Mới Nhất</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Danh sách 5 đơn đặt hàng gần đây nhất cần theo dõi
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span>Xem tất cả đơn hàng</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Mã đơn</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Khách hàng</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Sản phẩm</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Tổng tiền</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Chưa có đơn hàng nào phát sinh.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {ord.id}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: '600' }}>{ord.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{ord.phone}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      {ord.items && ord.items.length > 0 ? (
                        <span>{ord.items[0].name} {ord.items.length > 1 ? `(+${ord.items.length - 1})` : ''}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700' }}>
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: ord.orderStatus === 'delivered' ? '#ecfdf5' : '#eff6ff',
                          color: ord.orderStatus === 'delivered' ? '#047857' : '#1d4ed8',
                        }}
                      >
                        {ord.orderStatus === 'delivered' ? 'Đã giao' : ord.orderStatus === 'shipping' ? 'Đang giao' : 'Đã xác nhận'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
