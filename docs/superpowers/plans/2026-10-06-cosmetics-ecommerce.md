# K-Beauty Cosmetics E-commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hoàn chỉnh nền tảng web bán mỹ phẩm K-Beauty chuẩn Fullstack Next.js 15+ App Router, SQLite qua Prisma ORM, giỏ hàng Cart Drawer mượt mà, bộ lọc theo loại da/thương hiệu, và thanh toán COD + VietQR Napas247.

**Architecture:** Next.js App Router với Server Components cho SEO và tốc độ tải trang; Client Components cho giỏ hàng, search và bộ lọc; cơ sở dữ liệu SQLite cục bộ bền vững qua Prisma ORM; tạo mã VietQR động tự động cho đơn hàng chuyển khoản.

**Tech Stack:** Next.js 15+, TypeScript, React 19, Prisma ORM, SQLite, Vanilla CSS Modules (Design Tokens K-Beauty), Vitest / React Testing Library.

**Spec:** [`docs/superpowers/specs/2026-10-06-cosmetics-ecommerce-design.md`](file:///Users/Kiet/Documents/shoppe/docs/superpowers/specs/2026-10-06-cosmetics-ecommerce-design.md)

---

## Global Constraints

- Không sử dụng TailwindCSS (tuân thủ nguyên tắc `<web_application_development>`: sử dụng Vanilla CSS / CSS Modules).
- Không dùng ảnh placeholder (sử dụng URL ảnh studio sắc nét thật cho từng sản phẩm K-Beauty).
- Đơn hàng và sản phẩm phải được lưu trữ trong SQLite qua Prisma (không dùng mock in-memory tạm thời).
- Phí vận chuyển: 0đ cho đơn từ 399.000đ trở lên; 30.000đ cho đơn dưới 399.000đ.
- Mã giảm giá: `KBEAUTY10` (giảm 10% trên tổng tiền hàng).

## Review Focus

1. **Khách hàng F5/chuyển trang nhưng không mất giỏ hàng:** `CartContext` phải đồng bộ ngay tức khắc với `localStorage`.
2. **Lọc sản phẩm theo nhiều tiêu chí kết hợp (Brand + SkinType + Price):** Kết quả lọc phải chính xác theo điều kiện AND, hiển thị thông báo "Không tìm thấy sản phẩm" thân thiện khi không có kết quả.
3. **Thanh toán VietQR:** Mã QR phải sinh ra đúng định dạng chuẩn ngân hàng kèm đúng số tiền và cú pháp mã đơn hàng.
4. **Form Checkout không cho submit khi thiếu trường bắt buộc:** Bắt buộc nhập Tên, Số điện thoại (chuẩn 10 số VN), và Địa chỉ.
5. **Hiển thị giá tiền chuẩn VNĐ:** Tất cả các giá tiền đều phải có format phân cách hàng nghìn (ví dụ: `285.000 ₫`).

---

## Tasks

### Task 1: Initialize Next.js Project Scaffolding & Testing Framework

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Consumes: Node.js, npm
- Produces: Môi trường chạy Next.js + Vitest hoạt động, test runner pass

- [ ] **Step 1: Write the failing test**
Create `tests/setup.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Project Environment Setup', () => {
  it('should verify test runner is operational', () => {
    const appName = 'GlowSeoul K-Beauty';
    expect(appName).toBe('GlowSeoul K-Beauty');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL with "vitest: command not found" or "no test specified"

- [ ] **Step 3: Scaffold Next.js app and install dependencies**
Initialize Next.js app with TypeScript, App Router, ESLint in current directory:
Install: `next`, `react`, `react-dom`, `@types/node`, `@types/react`, `vitest`, `@testing-library/react`, `jsdom`.
Configure `package.json` scripts: `"dev": "next dev"`, `"build": "next build"`, `"test": "vitest run"`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS (1 test passed)

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: scaffold Next.js project and configure vitest"
```

---

### Task 2: Database Layer & Data Seeding (Prisma + SQLite)

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `prisma/seed.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: Prisma CLI, SQLite engine
- Produces: `prisma` client instance, database `dev.db` with 15+ seeded products

- [ ] **Step 1: Write the failing test**
Create `tests/db.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database Product Queries', () => {
  it('should query products from sqlite database', async () => {
    const products = await prisma.product.findMany();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/db.test.ts`
Expected: FAIL with "cannot find module '../src/lib/db'"

- [ ] **Step 3: Define schema, create singleton client, and seed products**
1. Create `prisma/schema.prisma` with `Product`, `Order`, `OrderItem` models as specified in Design Spec.
2. Generate client: `npx prisma db push`.
3. Create `src/lib/db.ts` exporting singleton `prisma` instance.
4. Create `prisma/seed.ts` populating 15 real K-Beauty products (Beauty of Joseon Sun Relief, COSRX Snail Mucin, Laneige Lip Sleeping Mask, Skin1004 Centella, Torriden HA Serum, Anua Heartleaf Toner, Rom&nd Lip Tint...) with complete images, skinType, brand, price, ingredients, usage.
5. Run: `npx tsx prisma/seed.ts`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/db.test.ts`
Expected: PASS (All seeded products successfully queried)

- [ ] **Step 5: Commit**
```bash
git add prisma/ src/lib/db.ts tests/db.test.ts
git commit -m "feat: setup prisma sqlite database and seed K-Beauty products"
```

---

### Task 3: Global Design Tokens & Layout Shell (Header, PromoBar, Footer)

**Files:**
- Create: `src/app/globals.css`
- Create: `src/lib/utils.ts`
- Create: `src/components/layout/PromoBar.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/utils.test.ts`

**Interfaces:**
- Consumes: Next.js Layout, CSS Variables
- Produces: `formatPrice(amount: number): string`, sticky header with logo and cart badge, responsive footer

- [ ] **Step 1: Write the failing test**
Create `tests/utils.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice, calculateDiscount } from '../src/lib/utils';

describe('Price and Discount Utility Functions', () => {
  it('formats number to Vietnamese Dong currency format', () => {
    expect(formatPrice(285000)).toBe('285.000 ₫');
  });

  it('calculates discount percentage correctly', () => {
    expect(calculateDiscount(350000, 280000)).toBe(20);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/utils.test.ts`
Expected: FAIL with "cannot find module '../src/lib/utils'"

- [ ] **Step 3: Implement utilities, CSS tokens, and layout components**
1. Implement `formatPrice` and `calculateDiscount` in `src/lib/utils.ts`.
2. Add K-Beauty design tokens (coral `#FF6B81`, blush `#FFF0F3`, glassmorphism, animations) in `src/app/globals.css`.
3. Implement `PromoBar.tsx`, `Header.tsx` (with sticky glassmorphism and navigation links), `Footer.tsx` with brand values.
4. Assemble inside `src/app/layout.tsx`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/utils.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/app/globals.css src/lib/utils.ts src/components/layout/ src/app/layout.tsx tests/utils.test.ts
git commit -m "feat: implement K-Beauty design tokens and core layout shell"
```

---

### Task 4: Cart State Management & Slide-Over Cart Drawer

**Files:**
- Create: `src/context/CartContext.tsx`
- Create: `src/components/cart/CartDrawer.tsx`
- Create: `src/components/cart/CartItem.tsx`
- Create: `src/components/cart/FreeShippingBar.tsx`
- Test: `tests/cart.test.ts`

**Interfaces:**
- Consumes: `localStorage`, `formatPrice`
- Produces: `useCart()` hook with `cartItems`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `subtotal`, `totalItems`, `isCartOpen`, `setIsCartOpen`

- [ ] **Step 1: Write the failing test**
Create `tests/cart.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateCartTotals } from '../src/context/CartContext';

describe('Cart Calculation Logic', () => {
  it('calculates correct subtotal, shipping fee, and free shipping progress', () => {
    const items = [
      { id: '1', name: 'COSRX Essence', price: 250000, quantity: 1, image: '' },
      { id: '2', name: 'Laneige Mask', price: 100000, quantity: 1, image: '' }
    ];
    const { subtotal, shippingFee, freeShippingRemaining } = calculateCartTotals(items);
    expect(subtotal).toBe(350000);
    expect(shippingFee).toBe(30000); // Under 399.000đ threshold
    expect(freeShippingRemaining).toBe(49000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/cart.test.ts`
Expected: FAIL with "cannot find module '../src/context/CartContext'"

- [ ] **Step 3: Implement CartContext and CartDrawer components**
1. Implement `CartContext.tsx` with `calculateCartTotals`, `useCart()`, and `localStorage` persistence.
2. Implement `FreeShippingBar.tsx` with dynamic progress percentage.
3. Implement `CartItem.tsx` with quantity controls (+/-) and remove button.
4. Implement `CartDrawer.tsx` with backdrop blur, slide-in animation, and "Thanh toán" button.
5. Wrap `CartProvider` around `src/app/layout.tsx`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/cart.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/context/CartContext.tsx src/components/cart/ tests/cart.test.ts
git commit -m "feat: implement cart state management and slide-over cart drawer"
```

---

### Task 5: Home Page Components (Hero, Skin Type Shortcuts, Categories, Best Sellers)

**Files:**
- Create: `src/components/home/HeroBanner.tsx`
- Create: `src/components/home/SkinTypeSelector.tsx`
- Create: `src/components/home/CategoryGrid.tsx`
- Create: `src/components/home/BrandShowcase.tsx`
- Create: `src/components/product/ProductCard.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/product-card.test.ts`

**Interfaces:**
- Consumes: `prisma.product.findMany()`, `useCart()`, `formatPrice()`
- Produces: Vibrant K-Beauty Home Page with rich interactive sections

- [ ] **Step 1: Write the failing test**
Create `tests/product-card.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getDiscountBadgeText } from '../src/components/product/ProductCard';

describe('Product Card Helper', () => {
  it('returns discount tag string when original price is higher', () => {
    expect(getDiscountBadgeText(350000, 280000)).toBe('-20%');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/product-card.test.ts`
Expected: FAIL with "cannot find module '../src/components/product/ProductCard'"

- [ ] **Step 3: Implement ProductCard and Home Page sections**
1. Create `src/components/product/ProductCard.tsx` with hover animations, price display, discount badge, rating, and "Thêm vào giỏ" button calling `addItem`.
2. Create `src/components/home/HeroBanner.tsx` with eye-catching K-Beauty graphics and CTA button.
3. Create `src/components/home/SkinTypeSelector.tsx` with 4 shortcuts linking to `/products?skinType=...`.
4. Create `src/components/home/CategoryGrid.tsx` and `BrandShowcase.tsx`.
5. In `src/app/page.tsx`, fetch best sellers and new arrivals via Prisma and render the complete home page.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/product-card.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/home/ src/components/product/ProductCard.tsx src/app/page.tsx tests/product-card.test.ts
git commit -m "feat: implement home page with hero banner, skin type filters and bestsellers"
```

---

### Task 6: Product Catalog Page, Multi-Facet Filters & Live Search

**Files:**
- Create: `src/components/product/FilterSidebar.tsx`
- Create: `src/components/product/LiveSearch.tsx`
- Create: `src/components/product/QuickViewModal.tsx`
- Create: `src/app/products/page.tsx`
- Test: `tests/filter-logic.test.ts`

**Interfaces:**
- Consumes: Next.js `searchParams`, `prisma.product`
- Produces: Route `/products` with multi-facet filtering (Brand, SkinType, Category, Price, Sort)

- [ ] **Step 1: Write the failing test**
Create `tests/filter-logic.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { buildProductFilterQuery } from '../src/app/products/page';

describe('Catalog Filter Query Builder', () => {
  it('builds prisma where clause matching category and skinType', () => {
    const query = buildProductFilterQuery({ category: 'serum', skinType: 'oily' });
    expect(query.where.category).toBe('serum');
    expect(query.where.skinType).toBe('oily');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/filter-logic.test.ts`
Expected: FAIL with "cannot find module '../src/app/products/page'"

- [ ] **Step 3: Implement catalog filtering, live search, and quick view modal**
1. Implement `buildProductFilterQuery` supporting search text, brand, category, skinType, price range, and sort order.
2. Implement `FilterSidebar.tsx` with reactive checkboxes and price slider.
3. Implement `LiveSearch.tsx` with instant debounced dropdown preview.
4. Implement `QuickViewModal.tsx` displaying ingredients and usage in a popup.
5. Implement `src/app/products/page.tsx` combining all components.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/filter-logic.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/product/ src/app/products/page.tsx tests/filter-logic.test.ts
git commit -m "feat: implement product catalog page with multi-facet filters and quick view"
```

---

### Task 7: Product Detail Page with Ingredients & Routine Steps

**Files:**
- Create: `src/components/product/ProductGallery.tsx`
- Create: `src/components/product/ProductTabs.tsx`
- Create: `src/app/products/[id]/page.tsx`
- Test: `tests/product-detail.test.ts`

**Interfaces:**
- Consumes: `params.id`, `prisma.product.findUnique()`
- Produces: Dynamic route `/products/[id]` with full product gallery, tabs, and related products

- [ ] **Step 1: Write the failing test**
Create `tests/product-detail.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseIngredientsList } from '../src/components/product/ProductTabs';

describe('Ingredients Parser', () => {
  it('parses comma-separated ingredient string into formatted badges', () => {
    const raw = 'Centella Asiatica, Niacinamide 10%, Hyaluronic Acid';
    const list = parseIngredientsList(raw);
    expect(list).toEqual(['Centella Asiatica', 'Niacinamide 10%', 'Hyaluronic Acid']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/product-detail.test.ts`
Expected: FAIL with "cannot find module '../src/components/product/ProductTabs'"

- [ ] **Step 3: Implement product detail components and page**
1. Implement `parseIngredientsList` in `ProductTabs.tsx`.
2. Implement `ProductGallery.tsx` allowing thumbnail clicks to change main image.
3. Implement `ProductTabs.tsx` with 3 tabs: "Công dụng chính", "Bảng thành phần", "Cách sử dụng & Routine".
4. Implement `src/app/products/[id]/page.tsx` with Server Component data fetching, metadata generation, and Related Products section.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/product-detail.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/product/ProductGallery.tsx src/components/product/ProductTabs.tsx src/app/products/[id]/page.tsx tests/product-detail.test.ts
git commit -m "feat: implement product detail page with gallery and K-Beauty routine tabs"
```

---

### Task 8: Single-Page Checkout & VietQR Generator

**Files:**
- Create: `src/lib/vietqr.ts`
- Create: `src/components/checkout/VietQRModal.tsx`
- Create: `src/components/checkout/OrderSummary.tsx`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/checkout/page.tsx`
- Test: `tests/vietqr.test.ts`

**Interfaces:**
- Consumes: `useCart()`, `prisma.order.create()`
- Produces: Route `/checkout`, order creation API, VietQR payment URL generator

- [ ] **Step 1: Write the failing test**
Create `tests/vietqr.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { generateVietQRUrl } from '../src/lib/vietqr';

describe('VietQR URL Generator', () => {
  it('generates compliant Napas247 VietQR image URL with order code and amount', () => {
    const url = generateVietQRUrl({
      bankId: 'MB',
      accountNo: '0388888888',
      accountName: 'GLOWSEOUL STORE',
      amount: 450000,
      orderCode: 'ORD-8823'
    });
    expect(url).toContain('https://img.vietqr.io/image/MB-0388888888-compact2.png');
    expect(url).toContain('amount=450000');
    expect(url).toContain('addInfo=ORD-8823');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/vietqr.test.ts`
Expected: FAIL with "cannot find module '../src/lib/vietqr'"

- [ ] **Step 3: Implement VietQR generator, order API, and checkout page**
1. Implement `generateVietQRUrl` in `src/lib/vietqr.ts`.
2. Create `src/app/api/orders/route.ts` validating customer payload, calculating order total (handling `KBEAUTY10` coupon), saving to `prisma.order` and `prisma.orderItem`.
3. Implement `VietQRModal.tsx` displaying the generated QR code, bank transfer details, and countdown timer.
4. Implement `src/app/checkout/page.tsx` with customer form (Name, Phone, Address), payment method selection (COD vs VIETQR), voucher input, and submit action.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/vietqr.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/lib/vietqr.ts src/components/checkout/ src/app/api/orders/ src/app/checkout/ tests/vietqr.test.ts
git commit -m "feat: implement single-page checkout with COD and dynamic VietQR generation"
```

---

### Task 9: Order Confirmation & Status Tracking Page

**Files:**
- Create: `src/app/orders/[id]/page.tsx`
- Create: `src/components/order/OrderStatusTracker.tsx`
- Test: `tests/order-tracking.test.ts`

**Interfaces:**
- Consumes: `params.id`, `prisma.order.findUnique({ include: { items: true } })`
- Produces: Route `/orders/[id]` showing ordered items, shipping details, status progress bar

- [ ] **Step 1: Write the failing test**
Create `tests/order-tracking.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getOrderStatusStep } from '../src/components/order/OrderStatusTracker';

describe('Order Status Step Helper', () => {
  it('returns step index 0 for confirmed, 1 for preparing, 2 for shipping, 3 for completed', () => {
    expect(getOrderStatusStep('confirmed')).toBe(0);
    expect(getOrderStatusStep('shipping')).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/order-tracking.test.ts`
Expected: FAIL with "cannot find module '../src/components/order/OrderStatusTracker'"

- [ ] **Step 3: Implement OrderStatusTracker and Order Page**
1. Implement `getOrderStatusStep` and status visual timeline in `OrderStatusTracker.tsx`.
2. Implement `src/app/orders/[id]/page.tsx` fetching order from Prisma, displaying thank-you message, tracking timeline, item list, payment status, and link back to Home.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/order-tracking.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/order/ src/app/orders/[id]/page.tsx tests/order-tracking.test.ts
git commit -m "feat: implement order confirmation and status tracking page"
```

---

### Task 10: Production Build, End-to-End Flow & Verification

**Files:**
- Modify: `README.md`
- Test: Full test suite execution & production build validation

**Interfaces:**
- Consumes: All completed components and routes
- Produces: Passing test suite, successful production build bundle, verified end-to-end shopping flow

- [ ] **Step 1: Run all tests**
Run: `npm test`
Expected: PASS (All test suites pass)

- [ ] **Step 2: Build production bundle**
Run: `npm run build`
Expected: SUCCESS (All Next.js routes generated with zero TypeScript or lint errors)

- [ ] **Step 3: Launch and verify user flow**
Launch `npm run dev`, verify:
1. Home page renders hero banner, categories, skin type filters, bestsellers.
2. Clicking "Xem chi tiết" opens product detail with tabs.
3. Adding product to cart opens slide-over cart drawer.
4. Checkout flow accepts shipping details and generates VietQR / saves order to SQLite.
5. Order confirmation displays status tracking.

- [ ] **Step 4: Commit**
```bash
git add README.md
git commit -m "docs: complete setup instructions and verify end-to-end K-Beauty store"
```
