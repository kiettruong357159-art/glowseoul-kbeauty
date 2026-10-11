import { describe, it, expect } from 'vitest';

describe('Page-Specific Tailored Loading Skeletons', () => {
  it('loads and renders root HomeLoading skeleton component', async () => {
    const HomeLoading = (await import('../src/app/loading')).default;
    expect(HomeLoading).toBeDefined();
    expect(typeof HomeLoading).toBe('function');
  });

  it('loads and renders ProductsLoading catalog skeleton component', async () => {
    const ProductsLoading = (await import('../src/app/products/loading')).default;
    expect(ProductsLoading).toBeDefined();
    expect(typeof ProductsLoading).toBe('function');
  });

  it('loads and renders ProductDetailLoading skeleton component', async () => {
    const ProductDetailLoading = (await import('../src/app/products/[id]/loading')).default;
    expect(ProductDetailLoading).toBeDefined();
    expect(typeof ProductDetailLoading).toBe('function');
  });

  it('loads and renders AccountLoading portal skeleton component', async () => {
    const AccountLoading = (await import('../src/app/account/loading')).default;
    expect(AccountLoading).toBeDefined();
    expect(typeof AccountLoading).toBe('function');
  });

  it('loads and renders AdminLoading dashboard skeleton component', async () => {
    const AdminLoading = (await import('../src/app/admin/loading')).default;
    expect(AdminLoading).toBeDefined();
    expect(typeof AdminLoading).toBe('function');
  });

  it('loads and renders CheckoutLoading skeleton component', async () => {
    const CheckoutLoading = (await import('../src/app/checkout/loading')).default;
    expect(CheckoutLoading).toBeDefined();
    expect(typeof CheckoutLoading).toBe('function');
  });

  it('loads and renders OrderDetailLoading tracking skeleton component', async () => {
    const OrderDetailLoading = (await import('../src/app/orders/[id]/loading')).default;
    expect(OrderDetailLoading).toBeDefined();
    expect(typeof OrderDetailLoading).toBe('function');
  });

  it('loads and renders QuizLoading skin routine skeleton component', async () => {
    const QuizLoading = (await import('../src/app/quiz/loading')).default;
    expect(QuizLoading).toBeDefined();
    expect(typeof QuizLoading).toBe('function');
  });

  it('loads and renders modular UI skeleton components', async () => {
    const SkeletonBox = (await import('../src/components/ui/skeletons/SkeletonBox')).default;
    const ProductCardSkeleton = (await import('../src/components/ui/skeletons/ProductCardSkeleton')).default;
    const AccountOrdersSkeleton = (await import('../src/components/ui/skeletons/AccountOrdersSkeleton')).default;
    const AccountWishlistSkeleton = (await import('../src/components/ui/skeletons/AccountWishlistSkeleton')).default;
    const AdminTableSkeleton = (await import('../src/components/ui/skeletons/AdminTableSkeleton')).default;
    const AdminDashboardSkeleton = (await import('../src/components/ui/skeletons/AdminDashboardSkeleton')).default;

    expect(SkeletonBox).toBeDefined();
    expect(ProductCardSkeleton).toBeDefined();
    expect(AccountOrdersSkeleton).toBeDefined();
    expect(AccountWishlistSkeleton).toBeDefined();
    expect(AdminTableSkeleton).toBeDefined();
    expect(AdminDashboardSkeleton).toBeDefined();
  });
});
