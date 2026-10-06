# Admin Master Data Management Specification - GlowSeoul K-Beauty

**Date**: 2026-10-07  
**Status**: Approved  
**Author**: Antigravity  

---

## 1. Executive Summary

GlowSeoul requires a centralized **Admin Master Data Portal** (`/admin`) to enable store administrators to dynamically manage the foundational catalog and marketing assets that power the storefront:
1. **Products Catalog (CRUD)**: Create, view, search, edit (price, stock, details, badges), and delete cosmetics products.
2. **Categories & Brands Master Data**: Define and manage official product categories (Serum, Sunscreen, Toner, Mask...) and Korean beauty brands (COSRX, Laneige, Beauty of Joseon...).
3. **Coupons / Discount Vouchers**: Create and configure promotional coupons (e.g. `KBEAUTY10`, `GLOW20`) with percentage discounts, minimum order constraints, and real-time checkout validation.
4. **Banners & Marketing Announcements**: Manage the top announcement bar (Promo bar) and homepage Hero promotional messaging.

---

## 2. Database Schema Extension (`prisma/schema.prisma`)

Expand the SQLite schema with 4 new models while preserving the existing `Product`, `Order`, and `OrderItem` structures:

```prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  createdAt   DateTime  @default(now())
}

model Brand {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  tag         String?
  origin      String?   @default("Hàn Quốc")
  logo        String?
  createdAt   DateTime  @default(now())
}

model Coupon {
  id              String    @id @default(cuid())
  code            String    @unique
  discountPercent Int
  minOrderAmount  Int       @default(0)
  maxDiscount     Int?
  isActive        Boolean   @default(true)
  expiresAt       DateTime?
  createdAt       DateTime  @default(now())
}

model Banner {
  id          String    @id @default(cuid())
  type        String    // "hero" | "promo_bar"
  title       String
  subtitle    String?
  badgeText   String?
  linkUrl     String?
  imageUrl    String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## 3. API Architecture & REST Endpoints

### 3.1 Products Admin API (`/api/admin/products`)
- `GET /api/admin/products`: Returns list of products with optional search query `q`, `category`, and `brand`.
- `POST /api/admin/products`: Creates a new product. Validates required fields: `name`, `brand`, `price`, `category`, `skinType`, `ingredients`, `description`, `usage`, `images` (array of URLs). Sets initial `stock` (default 50).
- `PUT /api/admin/products`: Updates an existing product by `id`. Allows updating price, stock, details, badges (`isBestSeller`, `isNew`), and images.
- `DELETE /api/admin/products?id={id}`: Deletes product by `id`.

### 3.2 Categories & Brands API (`/api/admin/categories`, `/api/admin/brands`)
- `GET /api/admin/categories` & `POST /api/admin/categories` & `DELETE /api/admin/categories?id={id}`
- `GET /api/admin/brands` & `POST /api/admin/brands` & `DELETE /api/admin/brands?id={id}`

### 3.3 Coupons & Validation API (`/api/admin/coupons`, `/api/coupons/validate`)
- `GET /api/admin/coupons`: List all configured vouchers.
- `POST /api/admin/coupons`: Create a voucher (`code`, `discountPercent`, `minOrderAmount`).
- `DELETE /api/admin/coupons?id={id}`: Delete or deactivate voucher.
- `POST /api/coupons/validate`: Public endpoint for Checkout. Accepts `{ code, subtotal }`. Validates that coupon exists, is active, and `subtotal >= minOrderAmount`. Returns `{ valid: true, discountPercent, discountAmount }` or `{ valid: false, message }`. Supports fallback to `KBEAUTY10` (10%).

### 3.4 Banners API (`/api/admin/banners`)
- `GET /api/admin/banners`: Returns active hero & promo banners.
- `PUT /api/admin/banners`: Updates banner title, subtitle, badgeText, linkUrl.

---

## 4. Admin Portal UI Layout (`/admin`)

- **Route:** `src/app/admin/page.tsx`
- **Layout:**
  - **Header Bar:** Brand Logo GlowSeoul Admin, live clock, status badge, and "← Về cửa hàng" (Back to Storefront) button.
  - **Tab Navigation Bar:** 4 dedicated sections:
    1. **Sản phẩm (Products)**:
       - Header with total product count, search input, filter by brand/category, and "+ Thêm sản phẩm mới" button.
       - Data table: Image thumbnail, Product name & brand, Category, Price (VNĐ), Stock, Status badges (Best Seller, New), and Actions (Sửa, Xóa).
       - Modal Dialog: Comprehensive product form with image preview, brand dropdown, category dropdown, price, stock, and descriptions.
    2. **Danh mục & Thương hiệu (Categories & Brands)**:
       - 2-column manager: Categories list + form on left; Brands list + form on right.
       - Quick add new brand (name, tag) and new category (name, slug).
    3. **Mã giảm giá (Coupons)**:
       - Table of coupons: Code, Discount %, Minimum order requirement, Status, Delete action.
       - Quick create form: Code name, discount percentage, min order amount.
    4. **Banner & Khuyến mãi (Banners)**:
       - Live editor for Promo Top Bar message and Hero Banner headline/subtitle with instant preview.

---

## 5. Storefront Integration

- **Checkout Page (`/checkout`)**:
  - Replaces hardcoded coupon check with `fetch('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) })`.
- **Navigation & Dropdowns**:
  - In product creation/editing, Categories and Brands dropdowns pull from the master data.

---

## 6. Testing & Verification Plan

1. **Unit & API Tests**:
   - `tests/admin-products-api.test.ts`: Test product creation, updating, and validation.
   - `tests/admin-coupons-api.test.ts`: Test coupon creation and validation endpoint.
   - `tests/admin-categories-api.test.ts`: Test category and brand creation.
2. **Build & Route Verification**:
   - `npm test`: Verify all tests pass.
   - `npm run build`: Verify Next.js routes compile successfully.
   - `curl -I http://localhost:3000/admin`: Verify 200 OK.
