# Admin Master Data Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive, centralized Admin Master Data Management portal (`/admin`) allowing store managers to perform full CRUD on products, manage categories and brands, configure promotional discount vouchers with real-time checkout validation, and customize marketing banners.

**Architecture:** Extend SQLite database via Prisma with four new models (`Category`, `Brand`, `Coupon`, `Banner`). Build REST API route handlers under `/api/admin/*` and `/api/coupons/validate` for robust data mutations. Build a responsive, aesthetic Admin UI at `/admin` featuring tabbed management panels, live statistics cards, searchable/filterable product data tables, and modal forms with instant image previews. Connect checkout and storefront components to consume dynamic master data seamlessly with reliable fallback defaults.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Prisma ORM, SQLite, Vanilla CSS / CSS Modules, Lucide React icons, Vitest.

**Spec:** [`docs/superpowers/specs/2026-10-07-admin-master-data-design.md`](file:///Users/Kiet/Documents/shoppe/docs/superpowers/specs/2026-10-07-admin-master-data-design.md)

---

## Global Constraints

- **Styling**: Strictly Vanilla CSS / inline styles / CSS variables (No TailwindCSS).
- **Aesthetics**: Follow GlowSeoul K-Beauty palette (Cherry blossom pinks, clean white cards, subtle borders, sleek badges).
- **Image Assets**: Must use valid Unsplash URLs with working beauty/cosmetics photography (no broken links or placeholder SVGs).
- **Backward Compatibility**: Preserve existing `category` and `brand` string fields on `Product` to guarantee zero breaking changes for existing filters, catalog queries, and test assertions.
- **TDD Requirement**: Every endpoint and interactive component must have a test written and verified red before writing implementation code.
- **Build Isolation**: Dev server task must be stopped before running `npm run build` to prevent Next.js manifest cache corruption.

---

## Review Focus

1. **Product creation with missing or invalid fields (e.g. empty name, negative price)**: Must return HTTP 400 with a clear Vietnamese error message; tested in Task 2.
2. **Coupon applied when order subtotal is below `minOrderAmount`**: Must return `{ valid: false, message: 'Đơn hàng chưa đạt giá trị tối thiểu...' }`; tested in Task 4.
3. **Deleting non-existent resource by ID (product, category, brand, coupon)**: Must return HTTP 404 rather than unhandled 500 crash; tested in Task 2, Task 3, and Task 4.
4. **Duplicate category slug or brand name creation**: Must return HTTP 409 / 400 with conflict notification; tested in Task 3.
5. **Fallback to hardcoded `KBEAUTY10` (10%) when coupon table is unseeded or offline**: Must ensure existing storefront checkout never breaks; tested in Task 4.

---

### Task 1: Database Schema Expansion & Seed Master Data

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Test: `tests/db-master-data.test.ts`

**Interfaces:**
- Consumes: Prisma SQLite database client (`@/lib/db`)
- Produces: `Category`, `Brand`, `Coupon`, `Banner` models in `@prisma/client`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/db-master-data.test.ts
import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database Master Data Models', () => {
  it('should query categories, brands, coupons, and banners from sqlite', async () => {
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();
    const coupons = await prisma.coupon.findMany();
    const banners = await prisma.banner.findMany();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
    expect(Array.isArray(banners)).toBe(true);
    expect(banners.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/db-master-data.test.ts`
Expected: FAIL with `prisma.category is undefined` or table missing.

- [ ] **Step 3: Implement schema models and update seed script**

- In `prisma/schema.prisma`: Add `Category`, `Brand`, `Coupon`, and `Banner` models.
- Run `npx prisma db push` to generate SQLite tables and update Prisma Client.
- In `prisma/seed.ts`: Seed initial master records:
  - Categories: Serum, Kem chống nắng (Sunscreen), Mặt nạ (Mask), Nước hoa hồng (Toner), Sữa rửa mặt (Cleanser), Trang điểm (Makeup).
  - Brands: COSRX, Beauty of Joseon, Laneige, Skin1004, Anua, Torriden, Rom&nd, Innisfree, Round Lab, Some By Mi.
  - Coupons: `KBEAUTY10` (10%, min 0), `GLOW20` (20%, min 500000).
  - Banners: `promo_bar` message and `hero` headline banner.
- Run `npx tsx prisma/seed.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/db-master-data.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts tests/db-master-data.test.ts
git commit -m "feat(db): add Category, Brand, Coupon, and Banner models and seed data"
```

---

### Task 2: Admin Products CRUD API

**Files:**
- Create: `src/app/api/admin/products/route.ts`
- Test: `tests/admin-products-api.test.ts`

**Interfaces:**
- Consumes: `prisma.product` from `@/lib/db`
- Produces:
  - `GET /api/admin/products?q={query}&category={cat}&brand={brand}` -> `{ products: Product[], total: number }`
  - `POST /api/admin/products` -> `{ success: true, product: Product }`
  - `PUT /api/admin/products` -> `{ success: true, product: Product }`
  - `DELETE /api/admin/products?id={id}` -> `{ success: true, id: string }`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-products-api.test.ts
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
  });

  it('DELETE /api/admin/products returns 404 for non-existent id', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products?id=non_existent_999', {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-products-api.test.ts`
Expected: FAIL with module `src/app/api/admin/products/route` not found.

- [ ] **Step 3: Implement `src/app/api/admin/products/route.ts`**

- `GET`: Parse search parameters (`q`, `category`, `brand`). Query `prisma.product.findMany` with order by `createdAt: 'desc'`.
- `POST`: Validate `name`, `brand`, `price`, `category`. Parse `images` array as JSON string. Set default `stock: 50`. Create product via `prisma.product.create`. Return status 201.
- `PUT`: Validate `id`. Update fields (`name`, `brand`, `price`, `originalPrice`, `category`, `skinType`, `ingredients`, `description`, `usage`, `images`, `stock`, `isBestSeller`, `isNew`). Return updated record.
- `DELETE`: Parse query `id`. Verify existence; return 404 if missing. Delete via `prisma.product.delete`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-products-api.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/products/route.ts tests/admin-products-api.test.ts
git commit -m "feat(api): implement admin products CRUD endpoints with validation"
```

---

### Task 3: Admin Categories & Brands API

**Files:**
- Create: `src/app/api/admin/categories/route.ts`
- Create: `src/app/api/admin/brands/route.ts`
- Test: `tests/admin-taxonomies-api.test.ts`

**Interfaces:**
- Consumes: `prisma.category`, `prisma.brand` from `@/lib/db`
- Produces:
  - `GET /api/admin/categories` -> `{ categories: Category[] }`
  - `POST /api/admin/categories` -> `{ success: true, category: Category }`
  - `DELETE /api/admin/categories?id={id}` -> `{ success: true, id: string }`
  - `GET /api/admin/brands` -> `{ brands: Brand[] }`
  - `POST /api/admin/brands` -> `{ success: true, brand: Brand }`
  - `DELETE /api/admin/brands?id={id}` -> `{ success: true, id: string }`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-taxonomies-api.test.ts
import { describe, it, expect } from 'vitest';
import { GET as getCategories, POST as postCategory } from '../src/app/api/admin/categories/route';
import { GET as getBrands, POST as postBrand } from '../src/app/api/admin/brands/route';
import { NextRequest } from 'next/server';

describe('Admin Taxonomies API (Categories & Brands)', () => {
  it('GET /api/admin/categories returns category list', async () => {
    const res = await getCategories();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.categories)).toBe(true);
  });

  it('POST /api/admin/categories rejects missing name or slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await postCategory(req);
    expect(res.status).toBe(400);
  });

  it('GET /api/admin/brands returns brand list', async () => {
    const res = await getBrands();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.brands)).toBe(true);
  });

  it('POST /api/admin/brands rejects missing name or slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await postBrand(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-taxonomies-api.test.ts`
Expected: FAIL with missing category/brand route modules.

- [ ] **Step 3: Implement category and brand route handlers**

- In `src/app/api/admin/categories/route.ts`:
  - `GET`: fetch all categories ordered by `name: 'asc'`.
  - `POST`: validate `name` & `slug`, check for duplicate slug (return 409 if exists), insert record.
  - `DELETE`: validate `id`, return 404 if not found, delete record.
- In `src/app/api/admin/brands/route.ts`:
  - `GET`: fetch all brands ordered by `name: 'asc'`.
  - `POST`: validate `name` & `slug`, check for duplicate name or slug (return 409 if exists), insert record.
  - `DELETE`: validate `id`, return 404 if not found, delete record.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-taxonomies-api.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/categories/route.ts src/app/api/admin/brands/route.ts tests/admin-taxonomies-api.test.ts
git commit -m "feat(api): implement admin categories and brands endpoints"
```

---

### Task 4: Dynamic Coupons API & Storefront Checkout Integration

**Files:**
- Create: `src/app/api/admin/coupons/route.ts`
- Create: `src/app/api/coupons/validate/route.ts`
- Modify: `src/app/api/orders/route.ts`
- Modify: `src/app/checkout/page.tsx`
- Test: `tests/admin-coupons-api.test.ts`

**Interfaces:**
- Consumes: `prisma.coupon` from `@/lib/db`
- Produces:
  - `GET /api/admin/coupons` -> `{ coupons: Coupon[] }`
  - `POST /api/admin/coupons` -> `{ success: true, coupon: Coupon }`
  - `DELETE /api/admin/coupons?id={id}` -> `{ success: true, id: string }`
  - `POST /api/coupons/validate` -> `{ valid: boolean, discountPercent?: number, discountAmount?: number, message?: string }`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-coupons-api.test.ts
import { describe, it, expect } from 'vitest';
import { POST as validateCoupon } from '../src/app/api/coupons/validate/route';
import { NextRequest } from 'next/server';

describe('Coupon Validation API', () => {
  it('validates active coupon successfully when subtotal meets minOrderAmount', async () => {
    const req = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'KBEAUTY10', subtotal: 300000 }),
    });
    const res = await validateCoupon(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.discountPercent).toBe(10);
    expect(data.discountAmount).toBe(30000);
  });

  it('rejects coupon if subtotal is below minimum order amount', async () => {
    const req = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'GLOW20', subtotal: 200000 }), // GLOW20 requires 500k
    });
    const res = await validateCoupon(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.valid).toBe(false);
    expect(data.message).toContain('tối thiểu');
  });

  it('rejects unknown coupon code', async () => {
    const req = new NextRequest('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'INVALID_CODE', subtotal: 500000 }),
    });
    const res = await validateCoupon(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.valid).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-coupons-api.test.ts`
Expected: FAIL with module missing.

- [ ] **Step 3: Implement coupon endpoints and integrate into checkout & orders**

- In `src/app/api/admin/coupons/route.ts`:
  - `GET`: list all coupons.
  - `POST`: validate `code`, `discountPercent` (1-100), `minOrderAmount` (>= 0). Save upper-cased code.
  - `DELETE`: delete coupon by `id` (return 404 if not found).
- In `src/app/api/coupons/validate/route.ts`:
  - Find coupon matching `code.toUpperCase()`. If found: verify `isActive` and `subtotal >= minOrderAmount`. Return `{ valid: true, discountPercent, discountAmount }`.
  - Fallback: If code is `KBEAUTY10`, grant 10% discount.
  - If invalid, return `{ valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' }`.
- In `src/app/api/orders/route.ts`:
  - Query `prisma.coupon` to calculate discount percentage dynamically, keeping `KBEAUTY10` (10%) fallback.
- In `src/app/checkout/page.tsx`:
  - In `handleApplyCoupon`: send request to `/api/coupons/validate`.
  - Update `discountAmount` and `discountPercent` dynamically from response.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-coupons-api.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/coupons/route.ts src/app/api/coupons/validate/route.ts src/app/api/orders/route.ts src/app/checkout/page.tsx tests/admin-coupons-api.test.ts
git commit -m "feat(coupons): implement dynamic voucher management and real-time checkout validation"
```

---

### Task 5: Marketing Banners API & Dynamic Storefront Integration

**Files:**
- Create: `src/app/api/admin/banners/route.ts`
- Modify: `src/components/layout/PromoBar.tsx`
- Modify: `src/components/home/HeroBanner.tsx`
- Test: `tests/admin-banners-api.test.ts`

**Interfaces:**
- Consumes: `prisma.banner` from `@/lib/db`
- Produces:
  - `GET /api/admin/banners` -> `{ banners: Banner[] }`
  - `PUT /api/admin/banners` -> `{ success: true, banner: Banner }`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-banners-api.test.ts
import { describe, it, expect } from 'vitest';
import { GET, PUT } from '../src/app/api/admin/banners/route';
import { NextRequest } from 'next/server';

describe('Admin Banners API', () => {
  it('GET /api/admin/banners returns banner list', async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.banners)).toBe(true);
    expect(data.banners.length).toBeGreaterThan(0);
  });

  it('PUT /api/admin/banners updates existing banner', async () => {
    const listRes = await GET();
    const { banners } = await listRes.json();
    const targetBanner = banners[0];

    const req = new NextRequest('http://localhost:3000/api/admin/banners', {
      method: 'PUT',
      body: JSON.stringify({
        id: targetBanner.id,
        title: 'New Promotional Title 2026',
      }),
    });
    const updateRes = await PUT(req);
    const updateData = await updateRes.json();
    expect(updateRes.status).toBe(200);
    expect(updateData.banner.title).toBe('New Promotional Title 2026');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-banners-api.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement banner API and storefront components integration**

- In `src/app/api/admin/banners/route.ts`:
  - `GET`: return all banners with status 200.
  - `PUT`: parse `{ id, title, subtitle, badgeText, linkUrl, isActive }`. Update banner via `prisma.banner.update`.
- In `src/components/layout/PromoBar.tsx`:
  - Provide dynamic promo message support if banner exists, with fallback to default freeship & KBEAUTY10 text.
- In `src/components/home/HeroBanner.tsx`:
  - Support optional banner prop or fetch to display dynamic hero headline and badge.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-banners-api.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/banners/route.ts src/components/layout/PromoBar.tsx src/components/home/HeroBanner.tsx tests/admin-banners-api.test.ts
git commit -m "feat(banners): implement banners API with live PromoBar and HeroBanner configuration"
```

---

### Task 6: Admin Portal Layout, Header & Tab Navigation

**Files:**
- Create: `src/components/admin/AdminHeader.tsx`
- Create: `src/components/admin/AdminStatsCards.tsx`
- Create: `src/app/admin/page.tsx`
- Test: `tests/admin-portal-ui.test.ts`

**Interfaces:**
- Consumes: `/api/admin/products`, `/api/admin/categories`, `/api/admin/brands`, `/api/admin/coupons`
- Produces: Responsive Admin Shell with tab navigation ('products', 'taxonomies', 'coupons', 'banners') and quick metrics.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-portal-ui.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Portal Structure', () => {
  it('contains Admin page file with tab controls for all 4 master data domains', () => {
    const adminPath = path.resolve(__dirname, '../src/app/admin/page.tsx');
    expect(fs.existsSync(adminPath)).toBe(true);
    const content = fs.readFileSync(adminPath, 'utf-8');
    expect(content).toContain('products');
    expect(content).toContain('taxonomies');
    expect(content).toContain('coupons');
    expect(content).toContain('banners');
  });

  it('contains AdminHeader component with link back to storefront', () => {
    const headerPath = path.resolve(__dirname, '../src/components/admin/AdminHeader.tsx');
    expect(fs.existsSync(headerPath)).toBe(true);
    const content = fs.readFileSync(headerPath, 'utf-8');
    expect(content).toContain('GlowSeoul');
    expect(content).toContain('Về cửa hàng');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-portal-ui.test.ts`
Expected: FAIL with files not found.

- [ ] **Step 3: Implement AdminHeader, AdminStatsCards, and `src/app/admin/page.tsx`**

- `AdminHeader.tsx`:
  - Logo: GlowSeoul Admin with status badge (Online, SQLite Sync).
  - Clock / Date display.
  - Link to `/` ("← Về cửa hàng").
- `AdminStatsCards.tsx`:
  - 4 clean metric cards: Total Products, Categories, Brands, Active Coupons.
- `src/app/admin/page.tsx`:
  - State `activeTab: 'products' | 'taxonomies' | 'coupons' | 'banners'`.
  - Tab bar with icons (Package, Tags, Ticket, Megaphone) and responsive pill styling.
  - Render placeholder containers for each tab.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-portal-ui.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminHeader.tsx src/components/admin/AdminStatsCards.tsx src/app/admin/page.tsx tests/admin-portal-ui.test.ts
git commit -m "feat(admin): build admin portal layout, header, stats cards, and tab switcher"
```

---

### Task 7: Admin Products Tab UI (List, Search, Filter, Modal Form CRUD with Image Preview)

**Files:**
- Create: `src/components/admin/ProductListTable.tsx`
- Create: `src/components/admin/ProductFormModal.tsx`
- Modify: `src/app/admin/page.tsx`
- Test: `tests/admin-products-ui.test.ts`

**Interfaces:**
- Consumes: `/api/admin/products`, `/api/admin/categories`, `/api/admin/brands`
- Produces: Complete Product management interface with instant image preview, filter/search bar, and edit/create modal.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-products-ui.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Products UI Components', () => {
  it('verifies ProductListTable supports search, edit and delete actions', () => {
    const tablePath = path.resolve(__dirname, '../src/components/admin/ProductListTable.tsx');
    expect(fs.existsSync(tablePath)).toBe(true);
    const content = fs.readFileSync(tablePath, 'utf-8');
    expect(content).toContain('onEdit');
    expect(content).toContain('onDelete');
  });

  it('verifies ProductFormModal contains live image preview container', () => {
    const modalPath = path.resolve(__dirname, '../src/components/admin/ProductFormModal.tsx');
    expect(fs.existsSync(modalPath)).toBe(true);
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect(content).toContain('img');
    expect(content).toContain('onSubmit');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-products-ui.test.ts`
Expected: FAIL with files not found.

- [ ] **Step 3: Implement ProductListTable and ProductFormModal**

- `ProductListTable.tsx`:
  - Search input with debounce or instant filter.
  - Category and Brand filter dropdowns.
  - Table showing: Thumbnail image, Product Name, Brand tag, Category, Price in VNĐ, Stock level badge, Badges (Bestseller, New), Actions (Sửa, Xóa).
  - Empty state with friendly illustration and "+ Thêm sản phẩm đầu tiên".
- `ProductFormModal.tsx`:
  - Form fields: Name, Brand (select from master brands + write-in), Category (select from master categories), Price, Original Price, Stock, Skin Type, Ingredients, Usage, Description, Image URL.
  - Live Image Preview box displaying the Unsplash cosmetics photo as soon as URL is typed.
  - Checkboxes for `isBestSeller` and `isNew`.
  - Save button with loading indicator.
- Connect into `src/app/admin/page.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-products-ui.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/ProductListTable.tsx src/components/admin/ProductFormModal.tsx src/app/admin/page.tsx tests/admin-products-ui.test.ts
git commit -m "feat(admin): build products table with search, filters, and modal CRUD form"
```

---

### Task 8: Admin Categories, Brands, Coupons & Banners UI Tabs

**Files:**
- Create: `src/components/admin/TaxonomiesManager.tsx`
- Create: `src/components/admin/CouponManager.tsx`
- Create: `src/components/admin/BannerManager.tsx`
- Modify: `src/app/admin/page.tsx`
- Test: `tests/admin-managers-ui.test.ts`

**Interfaces:**
- Consumes: `/api/admin/categories`, `/api/admin/brands`, `/api/admin/coupons`, `/api/admin/banners`
- Produces: Interactive management tabs for Taxonomies, Coupons, and Banners.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/admin-managers-ui.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Master Data Managers UI', () => {
  it('TaxonomiesManager exists and handles categories and brands', () => {
    const p = path.resolve(__dirname, '../src/components/admin/TaxonomiesManager.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const content = fs.readFileSync(p, 'utf-8');
    expect(content).toContain('Danh mục');
    expect(content).toContain('Thương hiệu');
  });

  it('CouponManager exists and handles coupon creation and listing', () => {
    const p = path.resolve(__dirname, '../src/components/admin/CouponManager.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const content = fs.readFileSync(p, 'utf-8');
    expect(content).toContain('discountPercent');
  });

  it('BannerManager exists and handles banner updates', () => {
    const p = path.resolve(__dirname, '../src/components/admin/BannerManager.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const content = fs.readFileSync(p, 'utf-8');
    expect(content).toContain('promo_bar');
    expect(content).toContain('hero');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin-managers-ui.test.ts`
Expected: FAIL with files not found.

- [ ] **Step 3: Implement all 3 manager components and mount in `src/app/admin/page.tsx`**

- `TaxonomiesManager.tsx`:
  - 2-column layout: Left column = Categories list + Quick add category form (Name, Slug). Right column = Brands list + Quick add brand form (Name, Slug, Tag). Delete actions for each row.
- `CouponManager.tsx`:
  - Quick create form: Code name (auto-uppercased), Discount percentage (slider or number input), Min order amount (VNĐ).
  - Active vouchers table with delete action and copy button.
- `BannerManager.tsx`:
  - Promo bar editor: Live input for top announcement text, with a live mini-preview bar.
  - Hero banner editor: Live inputs for badge text, main headline, and subtitle, with a live mini-preview card.
- Mount into `src/app/admin/page.tsx` under their respective tabs.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin-managers-ui.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/TaxonomiesManager.tsx src/components/admin/CouponManager.tsx src/components/admin/BannerManager.tsx src/app/admin/page.tsx tests/admin-managers-ui.test.ts
git commit -m "feat(admin): build category, brand, coupon, and banner UI management tabs"
```

---

### Task 9: End-to-End System Verification & Regression Suite

**Files:**
- Modify: Any files requiring minor fixes based on end-to-end testing
- Test: All Vitest suites + Next.js build + HTTP health checks

**Interfaces:**
- Complete regression suite covering existing storefront and all new admin features.

- [ ] **Step 1: Run complete Vitest suite**

Run: `npm test`
Expected: All tests pass (30+ tests, 0 failures).

- [ ] **Step 2: Run production Next.js build check**

Run:
1. Stop dev server background task (`manage_task kill`).
2. Run `npm run build` to verify all routes and TypeScript compilation pass cleanly.
3. Restart dev server (`npm run dev`).
Expected: Build passes with 0 errors.

- [ ] **Step 3: Verify HTTP 200 on `/admin` and API endpoints**

Run:
- `curl -I http://localhost:3000/admin` -> Expect 200 OK.
- `curl -s http://localhost:3000/api/admin/products | head -c 200` -> Expect valid JSON.
- `curl -s http://localhost:3000/api/admin/categories | head -c 200` -> Expect valid JSON.
- `curl -s http://localhost:3000/api/admin/coupons | head -c 200` -> Expect valid JSON.

- [ ] **Step 4: Commit any final refinements**

```bash
git add -A
git commit -m "chore: complete Admin Master Data Management system verification"
```
