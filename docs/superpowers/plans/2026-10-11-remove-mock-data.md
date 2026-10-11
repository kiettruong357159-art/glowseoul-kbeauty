# Loại Bỏ Toàn Bộ Dữ Liệu Mẫu (Mock / Hardcoded) Khỏi Mã Nguồn

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xoá bỏ triệt để các dữ liệu mẫu (mock / hardcoded) còn sót lại trong giao diện storefront (PromoBar, CategoryGrid, BrandShowcase, HeroBanner) và thay thế bằng dữ liệu thực truy vấn từ cơ sở dữ liệu Postgres qua Prisma.

**Architecture:** Sử dụng Next.js Server Components tại `RootLayout` và `HomePage` (`src/app/page.tsx`) để nạp trực tiếp dữ liệu thực từ Prisma DB (Banner, Category với `_count.products`, Brand, Bestseller Product), sau đó truyền props vào các components hiển thị; loại bỏ hoàn toàn các mảng fallback tĩnh.

**Tech Stack:** Next.js 15 (App Router, Server Components), Prisma ORM, PostgreSQL (Neon), TypeScript.

---

## Global Constraints
- Không làm gãy bất kỳ tính năng nào đang có.
- Toàn bộ 52 test suites (156 vitest tests) phải PASS 100%.
- Không có lỗi typecheck (`npm run check:types`) và quy chuẩn kiểm tra (`npm run check:rules`).

---

### Task 1: Xóa Bỏ Text Mẫu và Kết Nối PromoBar Với Database Từ Server (SSR)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/StorefrontLayout.tsx`
- Modify: `src/components/layout/PromoBar.tsx`

- [x] **Step 1: Truy vấn active promo banner từ Prisma trong `src/app/layout.tsx`**
  - Trong `RootLayout`, truy vấn `prisma.banner.findFirst({ where: { type: 'promo_bar', isActive: true }, select: { title: true } })`.
  - Truyền `initialPromoText={promoBanner?.title || null}` vào `<StorefrontLayout>`.

- [x] **Step 2: Cập nhật `StorefrontLayout.tsx` để nhận `initialPromoText`**
  - Khai báo prop `initialPromoText?: string | null` trong `StorefrontLayoutProps`.
  - Truyền `initialMessage={initialPromoText}` vào `<PromoBar>`.

- [x] **Step 3: Xóa bỏ 3 dòng text mẫu hardcoded trong `PromoBar.tsx`**
  - Xóa bỏ toàn bộ block `<Truck /> Freeship toàn quốc...`, `<Sparkles /> Nhập KBEAUTY10...`, `<ShieldCheck /> 100% Mỹ phẩm...`.
  - Nếu `!promoText`, trả về `null` (ẩn thanh bar khi không có banner active trong DB thay vì hiện text giả).
  - Nếu `promoText` tồn tại, hiển thị nội dung thực tế từ DB.

---

### Task 2: Chuyển Đổi CategoryGrid Sang Dữ Liệu Thực Từ Database

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/CategoryGrid.tsx`

- [x] **Step 1: Truy vấn danh mục từ DB trong `src/app/page.tsx`**
  - Thêm truy vấn `prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } })` vào `Promise.all`.
  - Truyền `categories` vào `<CategoryGrid categories={categories} />`.

- [x] **Step 2: Xóa mảng hardcoded `const categories = [...]` trong `CategoryGrid.tsx`**
  - Nhận prop `categories?: CategoryItem[]`.
  - Hiển thị tên danh mục, số lượng sản phẩm thực tế (`${cat._count?.products || 0} sản phẩm`), và link danh mục tương ứng.

---

### Task 3: Chuyển Đổi BrandShowcase Sang Dữ Liệu Thực Từ Database

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/BrandShowcase.tsx`

- [x] **Step 1: Truy vấn thương hiệu từ DB trong `src/app/page.tsx`**
  - Thêm truy vấn `prisma.brand.findMany({ orderBy: { name: 'asc' }, take: 8 })` vào `Promise.all`.
  - Truyền `brands` vào `<BrandShowcase brands={brands} />`.

- [x] **Step 2: Xóa mảng hardcoded `const brands = [...]` trong `BrandShowcase.tsx`**
  - Nhận prop `brands?: BrandItem[]`.
  - Hiển thị tên thương hiệu từ DB và đường dẫn lọc theo thương hiệu thực tế.

---

### Task 4: Chuyển Đổi HeroBanner Floating Card Sang Sản Phẩm Bán Chạy Thực Tế

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/HeroBanner.tsx`

- [x] **Step 1: Truyền sản phẩm bán chạy top 1 và ảnh banner từ DB vào `HeroBanner`**
  - Trong `src/app/page.tsx`, truyền `imageUrl={heroBanner?.imageUrl || undefined}` và `topProduct={bestSellers[0] || undefined}` vào `<HeroBanner>`.

- [x] **Step 2: Cập nhật `HeroBanner.tsx` sử dụng dữ liệu thực**
  - Sử dụng ảnh banner từ DB nếu có (`imageUrl`).
  - Floating Card hiển thị tên, giá tiền, rating thực tế của sản phẩm bán chạy top 1 từ DB thay vì text cố định `"COSRX Snail Mucin 96%"`.

---

### Task 5: Kiểm Thử, Build & Deploy

- [x] **Step 1: Chạy vitest xác nhận 156/156 tests pass**
- [x] **Step 2: Chạy `npm run build` xác nhận compile Next.js thành công**
- [x] **Step 3: Commit, push lên `main` và `develop` để deploy Vercel**
