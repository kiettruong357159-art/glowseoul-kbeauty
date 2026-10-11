# Kế Hoạch Tối Ưu Toàn Diện Dự Án GlowSeoul K-Beauty (Dựa Trên Kinh Nghiệm Enterprise & TECH.md)

- [x] **Giai Đoạn 1: CSDL & Bổ Sung Composite Index**
  - [x] Cập nhật `prisma/schema.prisma` với composite indexes trên bảng `Order` (`[orderStatus, createdAt]`, `[paymentStatus, createdAt]`) và `Product` (`[category, createdAt]`, `[brand, createdAt]`)
  - [x] Chạy verify test `tests/db.test.ts`

- [x] **Giai Đoạn 2: Tối Ưu Toàn Diện Trang Admin (Admin Portal)**
  - [x] Cải tổ triệt để `src/app/api/admin/dashboard/route.ts` bằng SQL Aggregations (`_sum`, `count`, `take: 5`), triệt tiêu việc load toàn bộ bảng vào RAM
  - [x] Bổ sung Debounce Search (400ms) cho bộ lọc sản phẩm trong Admin (`src/app/admin/page.tsx`)
  - [x] Thêm trạng thái disabled và loading spinner chống double-click trên các modal quản trị (`ProductFormModal.tsx`)
  - [x] Chạy verify test `tests/admin-dashboard-orders.test.ts`

- [x] **Giai Đoạn 3: Tối Ưu Phân Hệ Khách Hàng (Customer / Storefront)**
  - [x] Nâng cấp `src/components/product/LiveSearch.tsx` thành True Live Search với Debounce 400ms
  - [x] Bổ sung `prefetch={true}` cho `CategoryGrid.tsx`, `BrandShowcase.tsx` và `ProductCard.tsx`
  - [x] Tối ưu Edge CDN Cache-Control header cho `src/app/api/flash-sales/active/route.ts` (`s-maxage=10, stale-while-revalidate=59`)
  - [x] Hoàn thiện guard chống double submit cho `src/app/account/page.tsx`

- [x] **Giai Đoạn 4: Kiểm Thử Toàn Diện & Nghiệm Thu**
  - [x] Viết unit test `tests/admin-dashboard-aggregation.test.ts` kiểm tra tính chính xác và tốc độ của aggregation
  - [x] Chạy `npm test` toàn bộ 49 test suites (132/132 tests passed)

- [ ] **Giai Đoạn 5: Triển khai Vercel Production**
  - [x] Khắc phục lỗi TypeScript `orderItemsData` tại `src/app/api/orders/route.ts` gây lỗi build Vercel
  - [x] Chạy verify `npm run build` cục bộ thành công 100% (30/30 routes)
  - [x] Chạy toàn bộ 49 test suites (132/132 tests passed)
  - [ ] Push commit lên Git và kích hoạt Vercel build
  - [ ] Nghiệm thu Vercel deployment trạng thái READY và URL hoạt động
