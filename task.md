# Checklist Kế hoạch Phát triển & Kiểm thử (Task Checklist)

## 1. Mục tiêu & Chuẩn bị
- [x] Rà soát và bóc tách các quy chuẩn cốt lõi Enterprise (Dữ liệu lớn > 10k, Phân quyền RBAC, Thẩm mỹ Design Tokens, Workflow Plan-first).
- [x] Tạo file tài liệu quy chuẩn kỹ thuật độc lập `PROJECT_RULES_TEMPLATE.md`.
- [x] Lập Kế hoạch Thực hiện (`docs/superpowers/plans/2026-10-08-project-rules-performance-rbac.md`).
- [x] Viết Tech Spec 5 phần chuẩn chỉnh (`docs/superpowers/specs/2026-10-08-project-rules-performance-rbac-alignment.md`).

## 2. Tối ưu Hiệu năng Database & DDL Migration
- [x] Thêm 14 chỉ mục `@@index` trong `prisma/schema.prisma` cho các bảng `Product`, `Order`, `OrderItem`, `Review`, `Coupon`, `User`.
- [x] Thực thi migration DDL an toàn trực tiếp lên Supabase PostgreSQL (`oyzbmwwyrwfxjhzmbhkh`) qua Supabase MCP.
- [x] Kiểm tra xác nhận 14 chỉ mục đã hoạt động qua truy vấn `pg_indexes`.
- [x] Đồng bộ các chỉ mục sang Neon Serverless PostgreSQL (`broad-voice-84173872`).

## 3. Phân trang Backend & Hardening Phân quyền RBAC
- [x] Bổ sung phân trang `page` & `pageSize` (`skip`/`take`) tại `/api/admin/products`.
- [x] Bổ sung phân trang `page` & `pageSize` (`skip`/`take`) tại `/api/admin/orders`.
- [x] Bổ sung phân trang `page` & `pageSize` (`skip`/`take`) tại `/api/admin/coupons`.
- [x] Thắt chặt kiểm tra quyền `getCurrentUserFromCookie` tại các API `POST`, `PUT`, `DELETE` (`/api/admin/products`, `/api/admin/orders`, `/api/admin/coupons`, `/api/admin/banners`), trả về mã `403 Forbidden` khi vi phạm.

## 4. Đồng bộ Phân quyền lên Giao diện Quản trị (UI/UX)
- [x] `AdminSidebar.tsx`: Tự động ẩn tab "Tài khoản & Phân quyền" đối với tài khoản không phải `ADMIN`.
- [x] `ProductListTable.tsx`: Thêm prop `canManage`, ẩn nút "Thêm sản phẩm mới" và chuyển các nút Sửa/Xóa thành nhãn "Chỉ xem" đối với tài khoản không đủ quyền.
- [x] `src/app/admin/page.tsx`: Truyền prop `canManage` tính toán từ session của người dùng đăng nhập.

## 5. Kiểm thử Tự động & Hồi quy
- [x] Chạy toàn bộ test suite tự động: 46/46 test files PASSED, 124/124 tests PASSED (100%).
- [x] Kiểm tra Storefront & luồng mua hàng: giữ nguyên vẹn 100%, không phát sinh hồi quy.

## 6. Triển khai & Xuất bản (Git & Vercel)
- [x] Commit các thay đổi vào git local (`3c82ff9`: 13 files changed, 830 insertions(+), 75 deletions(-)).
- [x] Khắc phục route type signature tại `src/app/api/admin/coupons/route.ts` cho Next.js 15 build worker.
- [x] Kích hoạt Neon Serverless PgBouncer pooler qua MCP `mcp-server-neon`.
- [x] Build và Deploy thành công lên **Vercel Production**: `https://glowseoul-kbeauty.vercel.app` (State: **READY**).
- [ ] Push commit lên GitHub repo `kiettruong357159-art/glowseoul-kbeauty:main`.

## 7. Tính Năng Flash Sale & Khuyến Mãi Giờ Vàng (Completed)
- [x] Lập Tech Spec 5 phần chuẩn chỉnh (`docs/superpowers/specs/2026-10-08-flash-sale-realtime-countdown.md`).
- [x] Lập Implementation Plan chi tiết (`docs/superpowers/plans/2026-10-08-flash-sale-realtime-countdown.md`).
- [x] Thêm model `FlashSale` và `FlashSaleItem` vào `prisma/schema.prisma`.
- [x] Thực thi Safe SQL Migration trên Supabase & Neon qua MCP.
- [x] Xây dựng API public `GET /api/flash-sales/active`.
- [x] Xây dựng API admin `GET, POST, PUT, DELETE /api/admin/flash-sales` kèm RBAC.
- [x] Cập nhật luồng `POST /api/orders` tăng `soldQuantity` khi mua sản phẩm Flash Sale.
- [x] Xây dựng UI Atom: `CountdownTimer.tsx` (real-time countdown) và `FlashSaleProgressBar.tsx` (tiến trình cháy hàng).
- [x] Xây dựng UI Section: `FlashSaleSection.tsx` cho trang chủ (`/`).
- [x] Xây dựng UI Admin: `FlashSaleManager.tsx` và gắn tab vào `AdminSidebar.tsx` + `admin/page.tsx`.
- [x] Viết test suite `tests/flash-sale.test.ts` (Vitest) kiểm thử toàn diện (130/130 tests PASSED).
- [x] Kiểm tra build `npm run build` thành công 100% (30/30 routes).
- [ ] Deploy lên Vercel Production và cập nhật commit.



