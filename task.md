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

- [x] **Giai Đoạn 5: Triển khai Vercel Production**
  - [x] Khắc phục lỗi TypeScript `orderItemsData` tại `src/app/api/orders/route.ts` gây lỗi build Vercel
  - [x] Chạy verify `npm run build` cục bộ thành công 100% (30/30 routes)
  - [x] Chạy toàn bộ 49 test suites (132/132 tests passed)
  - [x] Push commit lên Git và kích hoạt Vercel build
  - [x] Nghiệm thu Vercel deployment trạng thái READY và URL hoạt động (`https://glowseoul-kbeauty.vercel.app`)

- [x] **Giai Đoạn 6: Chuẩn Hóa Hệ Thống Fallback Ảnh & Khắc Phục Lỗi Ảnh Yêu Thích**
  - [x] Tạo asset placeholder SVG dự phòng ngoại tuyến: `public/placeholder-product.svg`
  - [x] Tạo module quy chuẩn fallback ảnh: `src/lib/image-fallback.ts` (`DEFAULT_PRODUCT_IMAGE`, `LOCAL_PLACEHOLDER_IMAGE`, `getProductImageUrl`, `getProductImageArray`)
  - [x] Xuất `DEFAULT_PRODUCT_IMAGE` từ `src/lib/constants.ts`
  - [x] Tạo component `SafeImage.tsx` tự động xử lý `onError` và fallback đa tầng cho toàn hệ thống
  - [x] Sửa API `/api/account/wishlist` định dạng trả về trường `image` hợp lệ cho từng sản phẩm
  - [x] Cập nhật giao diện `/account` (wishlist card, order history items, Add to Cart) sử dụng `SafeImage` và fallback
  - [x] Chuẩn hóa toàn bộ hệ thống hiển thị ảnh sản phẩm: `ProductCard`, `QuickViewModal`, `ProductGallery`, `FlashSaleSection`, `CartItem`, `checkout/page.tsx`, `orders/[id]/page.tsx`, `quiz/page.tsx`, `ProductListTable`, `OrderManager`
  - [x] Viết test suite `tests/image-fallback.test.ts` (141/141 tests passed)
  - [x] Xác minh production build `npm run build` thành công 100%

