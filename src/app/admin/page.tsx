'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import DashboardOverview from '@/components/admin/DashboardOverview';
import OrderManager, { OrderData } from '@/components/admin/OrderManager';
import ProductListTable from '@/components/admin/ProductListTable';
import ProductFormModal from '@/components/admin/ProductFormModal';
import CategoryManager from '@/components/admin/CategoryManager';
import BrandManager from '@/components/admin/BrandManager';
import TaxonomiesManager from '@/components/admin/TaxonomiesManager';
import CouponManager from '@/components/admin/CouponManager';
import BannerManager from '@/components/admin/BannerManager';
import UserManager from '@/components/admin/UserManager';
import ReviewManager from '@/components/admin/ReviewManager';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import { LayoutDashboard, ShoppingBag, Package, Layers, Award, Ticket, Megaphone, Users } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    orders: 0,
    products: 0,
    categories: 0,
    brands: 0,
    coupons: 0,
    users: 0,
  });

  // Client-side route protection: require ADMIN or STAFF
  useEffect(() => {
    if (!authLoading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
        router.push('/admin/login');
      }
    }
  }, [user, authLoading, router]);

  // Master data for filters & forms
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  // Orders Tab State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Products Tab State
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productBrand, setProductBrand] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const refreshCountsAndTaxonomies = useCallback(async () => {
    try {
      const [catRes, brandRes, couponRes, userRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands'),
        fetch('/api/admin/coupons'),
        fetch('/api/admin/users'),
      ]);

      const [catData, brandData, couponData, userData] = await Promise.all([
        catRes.json(),
        brandRes.json(),
        couponRes.json(),
        userRes.json(),
      ]);

      setCategories(catData.categories || []);
      setBrands(brandData.brands || []);
      setCoupons(couponData.coupons || []);

      setCounts((prev) => ({
        ...prev,
        categories: catData.categories?.length || 0,
        brands: brandData.brands?.length || 0,
        coupons: couponData.coupons?.length || 0,
        users: userData.total ?? (userData.users?.length || 0),
      }));
    } catch (err) {
      console.error('Failed to load taxonomies & users:', err);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams();
      if (productSearch.trim()) params.set('q', productSearch.trim());
      if (productCategory) params.set('category', productCategory);
      if (productBrand) params.set('brand', productBrand);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setCounts((prev) => ({ ...prev, products: data.total ?? (data.products?.length || 0) }));
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [productSearch, productCategory, productBrand]);

  useEffect(() => {
    refreshCountsAndTaxonomies();
  }, [refreshCountsAndTaxonomies]);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data.orders || []);
      setCounts((prev) => ({ ...prev, orders: data.total ?? (data.orders?.length || 0) }));
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSaveProduct = async (productData: any) => {
    const isEdit = Boolean(productData.id);
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Lỗi khi lưu sản phẩm');
    }

    showSuccess(isEdit ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
    await loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showSuccess('Đã xoá sản phẩm thành công!');
        await loadProducts();
      } else {
        const data = await res.json();
        showError(data.error || 'Không thể xoá sản phẩm');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showError('Lỗi kết nối khi xoá sản phẩm');
    }
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'orders' as const, label: 'Đơn hàng', icon: ShoppingBag, count: counts.orders },
    { id: 'products' as const, label: 'Sản phẩm', icon: Package, count: counts.products },
    { id: 'categories' as const, label: 'Danh mục', icon: Layers, count: counts.categories },
    { id: 'brands' as const, label: 'Thương hiệu', icon: Award, count: counts.brands },
    { id: 'taxonomies' as const, label: 'Danh mục & Thương hiệu', icon: Layers, count: counts.categories + counts.brands },
    { id: 'coupons' as const, label: 'Mã giảm giá', icon: Ticket, count: counts.coupons },
    { id: 'banners' as const, label: 'Banners & Khuyến mãi', icon: Megaphone },
  ];

  const tabTitles: Record<string, string> = {
    dashboard: 'Tổng quan Dashboard',
    orders: 'Quản lý đơn đặt hàng',
    products: 'Quản lý sản phẩm',
    categories: 'Quản lý danh mục sản phẩm',
    brands: 'Quản lý thương hiệu đối tác',
    taxonomies: 'Danh mục & Thương hiệu',
    coupons: 'Mã giảm giá & Voucher',
    banners: 'Banners & Khuyến mãi',
    users: 'Tài khoản & Phân quyền (RBAC)',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={counts}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Work Area (Right Column) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: '60px' }}>
        <AdminHeader
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          currentTabTitle={tabTitles[activeTab]}
        />

        <main style={{ flex: 1, padding: '28px 32px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          {/* Page Title & Intro */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>
              {activeTab === 'dashboard' && 'Bảng Điều Khiển Tổng Quan (Dashboard)'}
              {activeTab === 'orders' && 'Quản Lý Đơn Đặt Hàng (Orders Management)'}
              {activeTab === 'products' && 'Quản Lý Danh Sách Mỹ Phẩm K-Beauty'}
              {activeTab === 'categories' && 'Quản Lý Danh Mục Sản Phẩm (Categories)'}
              {activeTab === 'brands' && 'Quản Lý Thương Hiệu Đối Tác (Brands)'}
              {activeTab === 'taxonomies' && 'Quản Lý Danh Mục & Thương Hiệu'}
              {activeTab === 'coupons' && 'Cấu Hình Mã Giảm Giá & Voucher'}
              {activeTab === 'banners' && 'Cấu Hình Banner & Khuyến Mãi'}
              {activeTab === 'users' && 'Quản Lý Tài Khoản & Phân Quyền (RBAC)'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Hệ thống quản trị dữ liệu gốc và vận hành thương mại điện tử GlowSeoul K-Beauty.
            </p>
          </div>

          {/* Quick Stats Overview on Master Data Tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'orders' && (
            <AdminStatsCards
              productCount={counts.products}
              categoryCount={counts.categories}
              brandCount={counts.brands}
              couponCount={counts.coupons}
            />
          )}

          {/* Tab Content Panels */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          {activeTab === 'dashboard' && (
            <DashboardOverview onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'orders' && (
            <OrderManager
              orders={orders}
              onRefresh={loadOrders}
              loading={ordersLoading}
            />
          )}

          {activeTab === 'products' && (
            <ProductListTable
              products={products}
              categories={categories}
              brands={brands}
              search={productSearch}
              onSearchChange={setProductSearch}
              selectedCategory={productCategory}
              onCategoryChange={setProductCategory}
              selectedBrand={productBrand}
              onBrandChange={setProductBrand}
              canManage={
                !user ||
                user.role === 'ADMIN' ||
                user.permissions?.includes('*') ||
                user.permissions?.includes('products:manage') ||
                user.permissions?.includes('products:*')
              }
              onAddNew={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEdit={(p) => {
                setEditingProduct(p);
                setIsProductModalOpen(true);
              }}
              onDelete={handleDeleteProduct}
              loading={productsLoading}
            />
          )}

          {activeTab === 'categories' && (
            <div id="tab-categories">
              <CategoryManager
                categories={categories}
                onRefresh={refreshCountsAndTaxonomies}
              />
            </div>
          )}

          {activeTab === 'brands' && (
            <div id="tab-brands">
              <BrandManager
                brands={brands}
                onRefresh={refreshCountsAndTaxonomies}
              />
            </div>
          )}

          {activeTab === 'taxonomies' && (
            <div id="tab-taxonomies">
              <TaxonomiesManager
                categories={categories}
                brands={brands}
                onRefresh={refreshCountsAndTaxonomies}
              />
            </div>
          )}

          {activeTab === 'coupons' && (
            <div id="tab-coupons">
              <CouponManager
                coupons={coupons}
                onRefresh={refreshCountsAndTaxonomies}
              />
            </div>
          )}

          {activeTab === 'banners' && (
            <div id="tab-banners">
              <BannerManager />
            </div>
          )}

          {activeTab === 'users' && (
            <div id="tab-users">
              <UserManager onRefreshCounts={refreshCountsAndTaxonomies} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div id="tab-reviews">
              <ReviewManager />
            </div>
          )}
        </div>
      </main>
    </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
