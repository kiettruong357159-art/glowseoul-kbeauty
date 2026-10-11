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
import FlashSaleManager from '@/components/admin/FlashSaleManager';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import AdminDashboardSkeleton from '@/components/ui/skeletons/AdminDashboardSkeleton';

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
    flashSales: 0,
    banners: 0,
    reviews: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({
    dashboard: true,
  });

  const handleSelectTab = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'dashboard') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState(null, '', url.toString());
      localStorage.setItem('glowseoul_admin_tab', tab);
    }
  }, []);

  // Sync tab from URL search param (?tab=...) or localStorage on initial client load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AdminTab | null;
      const storedTab = localStorage.getItem('glowseoul_admin_tab') as AdminTab | null;
      const targetTab = tabParam || storedTab;

      const validTabs: AdminTab[] = [
        'dashboard',
        'orders',
        'products',
        'categories',
        'brands',
        'taxonomies',
        'coupons',
        'flash-sales',
        'banners',
        'users',
        'reviews',
      ];
      if (targetTab && validTabs.includes(targetTab)) {
        setActiveTab(targetTab);
        setVisitedTabs((prev) => ({ ...prev, [targetTab]: true }));
        if (targetTab !== 'dashboard') {
          const url = new URL(window.location.href);
          url.searchParams.set('tab', targetTab);
          window.history.replaceState(null, '', url.toString());
        }
      }
    }
  }, []);

  useEffect(() => {
    setVisitedTabs((prev) => (prev[activeTab] ? prev : { ...prev, [activeTab]: true }));
  }, [activeTab]);

  // Client-side route protection: require ADMIN or STAFF
  useEffect(() => {
    if (!authLoading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
        router.replace('/admin/login');
      }
    }
  }, [user, authLoading, router]);

  const canManageProducts =
    !user ||
    user.role === 'ADMIN' ||
    user.permissions?.includes('*') ||
    user.permissions?.includes('products:manage') ||
    user.permissions?.includes('products:*');

  // Master data for filters & forms
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[] | undefined>(undefined);
  const [reviews, setReviews] = useState<any[] | undefined>(undefined);
  const [flashSales, setFlashSales] = useState<any[] | undefined>(undefined);
  const [flashTotal, setFlashTotal] = useState(0);
  const [usersList, setUsersList] = useState<any[] | undefined>(undefined);
  const [rolesList, setRolesList] = useState<any[] | undefined>(undefined);

  // Orders Tab State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Products Tab State
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [debouncedProductSearch, setDebouncedProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productBrand, setProductBrand] = useState('');

  // Debounce search input by 400ms to prevent flooding API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 400);
    return () => clearTimeout(handler);
  }, [productSearch]);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const refreshCountsAndTaxonomies = useCallback(async () => {
    try {
      const [catRes, brandRes, couponRes, userRes, flashRes, bannerRes, reviewRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands'),
        fetch('/api/admin/coupons'),
        fetch('/api/admin/users'),
        fetch('/api/admin/flash-sales?page=1&pageSize=6'),
        fetch('/api/admin/banners'),
        fetch('/api/admin/reviews'),
      ]);

      const [catData, brandData, couponData, userData, flashData, bannerData, reviewData] = await Promise.all([
        catRes.json(),
        brandRes.json(),
        couponRes.json(),
        userRes.json(),
        flashRes.json(),
        bannerRes.json(),
        reviewRes.json(),
      ]);

      setCategories(catData.categories || []);
      setBrands(brandData.brands || []);
      setCoupons(couponData.coupons || []);
      setBanners(bannerData.banners || []);
      setReviews(reviewData.reviews || []);
      setFlashSales(flashData.campaigns || []);
      setFlashTotal(flashData.total || 0);
      setUsersList(userData.users || []);
      setRolesList(userData.roles || []);

      setCounts((prev) => ({
        ...prev,
        categories: catData.categories?.length || 0,
        brands: brandData.brands?.length || 0,
        coupons: couponData.coupons?.length || 0,
        users: userData.total ?? (userData.users?.length || 0),
        flashSales: flashData.total ?? (flashData.campaigns?.length || 0),
        banners: bannerData.banners?.length || 0,
        reviews: reviewData.total ?? (reviewData.reviews?.length || 0),
      }));
    } catch (err) {
      console.error('Failed to load taxonomies & counts:', err);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedProductSearch.trim()) params.set('q', debouncedProductSearch.trim());
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
  }, [debouncedProductSearch, productCategory, productBrand]);

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

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshCountsAndTaxonomies(),
        loadProducts(),
        loadOrders(),
      ]);
      showSuccess('Đã đồng bộ dữ liệu mới nhất thành công!');
    } catch (err) {
      console.error('Failed to refresh admin data:', err);
      showError('Không thể đồng bộ dữ liệu lúc này');
    } finally {
      setIsRefreshing(false);
    }
  };

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
    'flash-sales': 'Flash Sale Giờ Vàng',
    reviews: 'Đánh giá sản phẩm',
  };

  // Prevent flashing admin dashboard content while verifying session or when unauthorized
  if (authLoading || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        counts={counts}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Work Area (Right Column) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: '60px' }}>
        <AdminHeader
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          currentTabTitle={tabTitles[activeTab]}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />

        <main style={{ flex: 1, padding: '28px 32px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>

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
            {visitedTabs['dashboard'] && (
              <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
                <DashboardOverview onNavigateTab={handleSelectTab} />
              </div>
            )}

            {visitedTabs['orders'] && (
              <div style={{ display: activeTab === 'orders' ? 'block' : 'none' }}>
                <OrderManager
                  orders={orders}
                  onRefresh={loadOrders}
                  loading={ordersLoading}
                />
              </div>
            )}

            {visitedTabs['products'] && (
              <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
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
                  canManage={canManageProducts}
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
              </div>
            )}

            {visitedTabs['categories'] && (
              <div id="tab-categories" style={{ display: activeTab === 'categories' ? 'block' : 'none' }}>
                <CategoryManager
                  categories={categories}
                  onRefresh={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['brands'] && (
              <div id="tab-brands" style={{ display: activeTab === 'brands' ? 'block' : 'none' }}>
                <BrandManager
                  brands={brands}
                  onRefresh={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['taxonomies'] && (
              <div id="tab-taxonomies" style={{ display: activeTab === 'taxonomies' ? 'block' : 'none' }}>
                <TaxonomiesManager
                  categories={categories}
                  brands={brands}
                  onRefresh={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['coupons'] && (
              <div id="tab-coupons" style={{ display: activeTab === 'coupons' ? 'block' : 'none' }}>
                <CouponManager
                  coupons={coupons}
                  onRefresh={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['flash-sales'] && (
              <div id="tab-flash-sales" style={{ display: activeTab === 'flash-sales' ? 'block' : 'none' }}>
                <FlashSaleManager
                  initialCampaigns={flashSales}
                  initialTotal={flashTotal}
                  storeProducts={productsLoading ? undefined : products}
                  canManage={canManageProducts}
                  onRefreshCounts={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['banners'] && (
              <div id="tab-banners" style={{ display: activeTab === 'banners' ? 'block' : 'none' }}>
                <BannerManager
                  banners={banners}
                  onRefreshCounts={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['users'] && (
              <div id="tab-users" style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
                <UserManager
                  initialUsers={usersList}
                  initialRoles={rolesList}
                  onRefreshCounts={refreshCountsAndTaxonomies}
                />
              </div>
            )}

            {visitedTabs['reviews'] && (
              <div id="tab-reviews" style={{ display: activeTab === 'reviews' ? 'block' : 'none' }}>
                <ReviewManager
                  initialReviews={reviews}
                  onRefreshCounts={refreshCountsAndTaxonomies}
                />
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
