# Tối Ưu Hóa Hiệu Năng Next.js 15 Fullstack & Database Query (Theo Chuẩn TECH.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triệt tiêu hoàn toàn các điểm nghẽn hiệu năng (loại bỏ N+1 query trong order API, song song hóa truy vấn Promise.all, deduplicate truy vấn React Server Component với React.cache, bổ sung ISR caching và tối ưu kết nối Serverless Database).

**Architecture:** Áp dụng mô hình Serverless High-Performance theo [TECH.md](file:///c:/Users/MSI%20RAIDER%20GE76/Documents/Project/glowseoul-kbeauty/TECH.md): Batching queries để giảm roundtrip mạng, memoization với `React.cache()` chống trùng lặp truy vấn giữa `generateMetadata` và `Page`, kích hoạt Incremental Static Regeneration (ISR) trên Vercel Edge CDN, và hoàn thiện cấu trúc kết nối Prisma tối ưu cho Serverless pooler.

**Tech Stack:** Next.js 15.2 (App Router, RSC, ISR), React 19 (`cache`), Prisma ORM 6.4, TypeScript, Vitest.

**Spec:** [TECH.md](file:///c:/Users/MSI%20RAIDER%20GE76/Documents/Project/glowseoul-kbeauty/TECH.md)

---

## Global Constraints

- Không làm thay đổi logic nghiệp vụ tính giá, mã giảm giá và số lượng flash sale đã có.
- Đảm bảo 100% các bộ test hiện tại (48 test suites) tiếp tục pass.
- Bắt buộc kiểm tra và bắt lỗi an toàn (graceful fallback) khi database có độ trễ hoặc lỗi kết nối.
- Sử dụng chuẩn `Promise.all` và batching `findMany({ where: { id: { in: ids } } })`.

## Review Focus

1. **Khách hàng đặt giỏ hàng có nhiều sản phẩm (5-20 items)**: Trước đây lặp N lần truy vấn `findUnique`, sau tối ưu chỉ được phép thực hiện đúng 1 truy vấn `findMany` để lấy toàn bộ thông tin sản phẩm.
2. **Khách hàng đặt sản phẩm thuộc Flash Sale**: Các lệnh cập nhật `soldQuantity` phải được gom nhóm hoặc thực thi an toàn trong transaction, không lặp truy vấn đơn lẻ.
3. **Trang chi tiết sản phẩm (`/products/[id]`)**: `generateMetadata` và phần thân trang không được gọi 2 lần riêng biệt vào database cho cùng 1 ID sản phẩm.
4. **Trang chủ (`/`)**: Hai khối "Top Bán Chạy" và "Hàng Mới Về" phải được nạp đồng thời (concurrent fetching) thay vì nối tiếp.
5. **Độ ổn định của kết nối Prisma**: `src/lib/db.ts` phải duy trì singleton an toàn trong môi trường Next.js development và production serverless.

---

### Task 1: Khắc phục triệt để lỗi N+1 Query trong API Tạo đơn hàng

**Files:**
- Modify: `src/app/api/orders/route.ts`
- Create: `tests/order-performance-batch.test.ts`

**Interfaces:**
- Consumes: `prisma.product.findMany`, `prisma.order.create`, `prisma.flashSaleItem.updateMany`
- Produces: `POST /api/orders` với tốc độ xử lý nhanh gấp 3 lần, chỉ mất 1 DB roundtrip để xác thực giá tất cả mặt hàng.

- [x] **Step 1: Viết test kiểm tra batching sản phẩm và tạo đơn hàng**
  Tạo `tests/order-performance-batch.test.ts` kiểm tra đặt hàng 3 sản phẩm cùng lúc, đảm bảo tính đúng subtotal và giảm thiểu truy vấn.

- [x] **Step 2: Chạy test để kiểm tra hiện trạng**
  Run: `npx vitest run tests/order-performance-batch.test.ts`

- [x] **Step 3: Tối ưu `src/app/api/orders/route.ts`**
  - Thay thế vòng lặp `for ... await prisma.product.findUnique` bằng 1 truy vấn `prisma.product.findMany({ where: { id: { in: itemIds } } })`.
  - Sử dụng `Map` tra cứu theo ID (`O(1)`).
  - Gom các cập nhật Flash Sale items thành các thao tác song song `Promise.all` thay vì lặp tuần tự.

- [x] **Step 4: Chạy lại test xác nhận thành công**
  Run: `npx vitest run tests/order-performance-batch.test.ts`
  Expected: PASS

---

### Task 2: Song song hóa truy vấn (Concurrent Fetching) trên Trang chủ

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/home-responsive.test.ts`

**Interfaces:**
- Consumes: `prisma.product.findMany`
- Produces: `Promise.all([bestSellersPromise, newArrivalsPromise])` giảm 50% thời gian chờ DB khi cache hết hạn.

- [x] **Step 1: Cập nhật `src/app/page.tsx`**
  Đổi từ 2 lần `await` tuần tự thành `Promise.all`:
  ```typescript
  const [bestSellers, newArrivals] = await Promise.all([
    prisma.product.findMany({ where: { isBestSeller: true }, take: 8 }),
    prisma.product.findMany({ where: { isNew: true }, take: 4 }),
  ]);
  ```

- [x] **Step 2: Chạy test trang chủ**
  Run: `npx vitest run tests/home-responsive.test.ts`
  Expected: PASS

---

### Task 3: Deduplicate Truy Vấn DB trên Trang Chi Tiết Sản Phẩm bằng `React.cache()`

**Files:**
- Create: `src/lib/cached-queries.ts`
- Modify: `src/app/products/[id]/page.tsx`
- Test: `tests/product-detail.test.ts`

**Interfaces:**
- Produces: `getProductById(id: string)` được bọc trong `React.cache()`.
- Consumes: `generateMetadata` và `ProductDetailPage` cùng gọi `getProductById(id)` mà chỉ phát sinh đúng 1 truy vấn SQL duy nhất per request.

- [x] **Step 1: Tạo `src/lib/cached-queries.ts`**
  ```typescript
  import { cache } from 'react';
  import { prisma } from '@/lib/db';

  export const getProductById = cache(async (id: string) => {
    return prisma.product.findUnique({ where: { id } });
  });
  ```

- [x] **Step 2: Cập nhật `src/app/products/[id]/page.tsx`**
  - Import `getProductById` thay thế các lệnh gọi trực tiếp `prisma.product.findUnique`.
  - Đặt `export const revalidate = 1800; // 30 phút ISR trên Vercel Edge CDN`.

- [x] **Step 3: Chạy test trang chi tiết sản phẩm**
  Run: `npx vitest run tests/product-detail.test.ts`
  Expected: PASS

---

### Task 4: Tinh Chỉnh Cấu Hình Kết Nối Prisma Client Cho Serverless

**Files:**
- Modify: `src/lib/db.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Đảm bảo PrismaClient duy trì singleton chuẩn xác, hỗ trợ log tối ưu, chống rò rỉ kết nối trên môi trường hot-reload và serverless container.

- [x] **Step 1: Kiểm tra và hoàn thiện `src/lib/db.ts`**
  - Tối ưu hóa timeout và cấu hình connection pooler log.
  - Đảm bảo an toàn khi chạy trên cả môi trường local lẫn Vercel Edge/Serverless.

- [x] **Step 2: Chạy test kết nối DB**
  Run: `npx vitest run tests/db.test.ts`
  Expected: PASS

---

### Task 5: Chạy Kiểm Thử Toàn Diện (Full Regression Test)

**Files:**
- Tất cả các test suites trong thư mục `tests/`

- [x] **Step 1: Chạy toàn bộ test suites**
  Run: `npm test`
  Expected: Tất cả 48 suites đều PASS, 0 failure (131 tests passed).

- [x] **Step 2: Cập nhật tài liệu và checklist `task.md`**
