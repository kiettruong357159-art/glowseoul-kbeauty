'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import ProductListTable from '@/components/admin/ProductListTable';
import ProductFormModal from '@/components/admin/ProductFormModal';
import TaxonomiesManager from '@/components/admin/TaxonomiesManager';
import CouponManager from '@/components/admin/CouponManager';
import BannerManager from '@/components/admin/BannerManager';
import { Package, Layers, Ticket, Megaphone } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'taxonomies' | 'coupons' | 'banners'>('products');
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    coupons: 0,
  });

  // Master data for filters & forms
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

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
      const [catRes, brandRes, couponRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands'),
        fetch('/api/admin/coupons'),
      ]);

      const [catData, brandData, couponData] = await Promise.all([
        catRes.json(),
        brandRes.json(),
        couponRes.json(),
      ]);

      setCategories(catData.categories || []);
      setBrands(brandData.brands || []);
      setCoupons(couponData.coupons || []);

      setCounts((prev) => ({
        ...prev,
        categories: catData.categories?.length || 0,
        brands: brandData.brands?.length || 0,
        coupons: couponData.coupons?.length || 0,
      }));
    } catch (err) {
      console.error('Failed to load taxonomies:', err);
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

    await loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể xoá sản phẩm');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Lỗi kết nối khi xoá sản phẩm');
    }
  };

  const tabs = [
    { id: 'products' as const, label: 'Sản phẩm', icon: Package, count: counts.products },
    { id: 'taxonomies' as const, label: 'Danh mục & Thương hiệu', icon: Layers, count: counts.categories + counts.brands },
    { id: 'coupons' as const, label: 'Mã giảm giá', icon: Ticket, count: counts.coupons },
    { id: 'banners' as const, label: 'Banners & Khuyến mãi', icon: Megaphone },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '80px' }}>
      <AdminHeader />

      <main className="container" style={{ padding: '32px 20px' }}>
        {/* Page Title & Intro */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>
            Hệ Thống Quản Lý Dữ Liệu Gốc (Master Data)
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Quản trị danh mục mỹ phẩm Hàn Quốc, voucher ưu đãi và cấu hình thông điệp khuyến mại tức thì.
          </p>
        </div>

        {/* Global Stats Overview */}
        <AdminStatsCards
          productCount={counts.products}
          categoryCount={counts.categories}
          brandCount={counts.brands}
          couponCount={counts.coupons}
        />

        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            padding: '6px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '24px',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-muted)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-bg)',
                      color: isActive ? 'white' : 'var(--color-text-muted)',
                      fontWeight: '800',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
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
        </div>
      </main>

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
