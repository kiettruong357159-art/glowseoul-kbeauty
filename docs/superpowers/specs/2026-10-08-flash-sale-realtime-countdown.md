# TECH SPEC: Tính Năng Flash Sale & Khuyến Mãi Giờ Vàng Đếm Ngược Thời Gian Thực (Realtime Countdown)

- **Ticket**: `[GLOW-2026-10-08] Flash Sale & Hourly Deals with Realtime Countdown`
- **Loại**: `New Feature / Architecture & Business Subsystem`
- **Mức độ**: `Cao`
- **Module ảnh hưởng**: `Database Schema (Prisma, Supabase, Neon), Public API (/api/flash-sales/*), Admin API (/api/admin/flash-sales), Storefront Homepage, Product Detail, Checkout Order Flow, Admin Panel`
- **Ngày**: `08/10/2026`
- **Tác giả**: `Antigravity Tech Lead`

---

## 1. Mô tả yêu cầu

### 1.1. Hiện trạng & Bối cảnh
- Hiện tại, GlowSeoul K-Beauty có tính năng giảm giá cố định qua trường `originalPrice` và mã voucher giảm giá (`Coupon`).
- Hệ thống chưa có cơ chế thúc đẩy tâm lý mua sắm gấp gáp (FOMO - Fear Of Missing Out) thông qua các khung giờ vàng (Flash Sale), giới hạn số lượng suất ưu đãi và đồng hồ đếm ngược trực tiếp.
- Người quản trị chưa có công cụ để lên lịch tự động các chiến dịch Flash Sale theo khung giờ (ví dụ: Khung giờ 12:00 - 14:00, Khung giờ 20:00 - 24:00) với số lượng suất bán riêng biệt cho từng sản phẩm.

### 1.2. Nguyên nhân (Root Cause)
- Chưa có mô hình dữ liệu quan hệ (`FlashSale` và `FlashSaleItem`) để quản lý khoảng thời gian diễn ra chiến dịch, giá khuyến mãi đặc biệt và số lượng suất giới hạn.
- Storefront thiếu component đồng hồ đếm ngược (Countdown Timer) thời gian thực và thanh tiến trình cháy hàng (Progress Bar).
- Luồng checkout chưa tự động nhận diện giá Flash Sale và cập nhật số lượng đã bán (`soldQuantity`).

### 1.3. Yêu cầu & Mục tiêu (Scope & Target)
1. **Thiết kế Database**: Bổ sung bảng `FlashSale` và `FlashSaleItem` vào Prisma Schema, hỗ trợ quan hệ 1-N với `Product`, đánh index hiệu năng cao, thực thi DDL an toàn lên Supabase & Neon.
2. **API Public**: Endpoint `GET /api/flash-sales/active` trả về chiến dịch Flash Sale đang diễn ra (hoặc sắp diễn ra) kèm danh sách sản phẩm, giá flash sale, số lượng giới hạn và số lượng đã bán.
3. **API Admin**: Endpoint `/api/admin/flash-sales` hỗ trợ CRUD toàn diện cho quản trị viên (kèm phân quyền RBAC `admin` / `products:manage`).
4. **UI Storefront**:
   - Thêm section **Flash Sale Giờ Vàng** nổi bật ở Trang chủ (`/`), có tiêu đề gradient, biểu tượng sấm sét ⚡, đồng hồ đếm ngược thời gian thực (Giờ : Phút : Giây) và thanh trượt sản phẩm.
   - Thẻ sản phẩm hiển thị thanh nhiệt độ cháy hàng: *"🔥 Đang cháy hàng 80% (Còn lại 10 suất)"*.
   - Badge Flash Sale xuất hiện trên Card sản phẩm và Trang chi tiết (`/products/[id]`).
5. **Đồng bộ Luồng Đặt hàng (Checkout)**:
   - Khi khách đặt hàng sản phẩm trong thời gian Flash Sale và số lượng còn lại > 0: tính theo `discountPrice`.
   - Tự động tăng `soldQuantity` sau khi đơn hàng được tạo thành công.
6. **Admin Panel**: Thêm tab "Flash Sale" trong `/admin` cho phép tạo chiến dịch, chọn thời gian bắt đầu/kết thúc, thêm sản phẩm và theo dõi tiến độ bán.

---

## 2. Phạm vi ảnh hưởng

### 2.1. Đối tượng trong phạm vi (In-scope)
| # | Đối tượng | Module | Ghi chú tác động |
| :--- | :--- | :--- | :--- |
| 1 | `prisma/schema.prisma` | Database Schema | Thêm model `FlashSale` và `FlashSaleItem`, quan hệ với `Product` |
| 2 | Supabase & Neon PostgreSQL | Remote Database | Thực thi Safe SQL Migration tạo bảng và index |
| 3 | `/api/flash-sales/active` | Route Handler | API lấy chiến dịch Flash Sale đang chạy kèm tính toán thời gian thực |
| 4 | `/api/admin/flash-sales` | Route Handler | API CRUD chiến dịch Flash Sale, hỗ trợ phân trang và RBAC |
| 5 | `/api/orders` | Route Handler | Kiểm tra giá Flash Sale và cập nhật `soldQuantity` khi đặt hàng |
| 6 | `CountdownTimer.tsx` | UI Component Atom | Hiển thị đồng hồ đếm ngược HH:MM:SS với micro-animation |
| 7 | `FlashSaleProgressBar.tsx` | UI Component Atom | Hiển thị thanh tiến trình cháy hàng có màu gradient nhiệt |
| 8 | `FlashSaleSection.tsx` | UI Component Section | Block Flash Sale trên trang chủ |
| 9 | `FlashSaleManager.tsx` | UI Component Admin | Tab quản lý Flash Sale trong trang Admin |
| 10 | `src/app/admin/page.tsx` & `AdminSidebar.tsx` | Admin Layout | Tích hợp tab Flash Sale vào giao diện quản trị |
| 11 | `src/app/page.tsx` | Storefront Home | Gắn `FlashSaleSection` dưới Hero Banner |

### 2.2. Ngoài phạm vi (Out-of-scope)
- Không làm thay đổi luồng thanh toán VietQR Napas247 hay tính toán voucher giảm giá chung (`Coupon`).
- Không ảnh hưởng đến dữ liệu người dùng, review hay lịch sử đơn hàng cũ.

---

## 3. Giải pháp kỹ thuật

### 3.1. Thiết kế Mô hình Dữ liệu (Prisma Schema)
```prisma
model FlashSale {
  id          String          @id @default(cuid())
  title       String          // Ví dụ: "Flash Sale Giờ Vàng 20:00 - 24:00"
  description String?         // Mô tả chiến dịch
  startTime   DateTime        // Thời điểm bắt đầu
  endTime     DateTime        // Thời điểm kết thúc
  isActive    Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  items       FlashSaleItem[]

  @@index([isActive])
  @@index([startTime, endTime])
}

model FlashSaleItem {
  id            String    @id @default(cuid())
  flashSaleId   String
  flashSale     FlashSale @relation(fields: [flashSaleId], references: [id], onDelete: Cascade)
  productId     String
  product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  discountPrice Int       // Giá sale trong khung giờ (VNĐ)
  limitQuantity Int       @default(50) // Số suất giới hạn
  soldQuantity  Int       @default(0)  // Số suất đã bán
  createdAt     DateTime  @default(now())

  @@unique([flashSaleId, productId])
  @@index([flashSaleId])
  @@index([productId])
}
```

### 3.2. Safe DDL SQL Migration
Thực thi trên cả Supabase và Neon qua MCP:
```sql
CREATE TABLE IF NOT EXISTS "FlashSale" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FlashSaleItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "flashSaleId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "discountPrice" INTEGER NOT NULL,
  "limitQuantity" INTEGER NOT NULL DEFAULT 50,
  "soldQuantity" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FlashSaleItem_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "FlashSale"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FlashSaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "FlashSaleItem_flashSaleId_productId_key" ON "FlashSaleItem"("flashSaleId", "productId");
CREATE INDEX IF NOT EXISTS "FlashSale_isActive_idx" ON "FlashSale"("isActive");
CREATE INDEX IF NOT EXISTS "FlashSale_startTime_endTime_idx" ON "FlashSale"("startTime", "endTime");
CREATE INDEX IF NOT EXISTS "FlashSaleItem_flashSaleId_idx" ON "FlashSaleItem"("flashSaleId");
CREATE INDEX IF NOT EXISTS "FlashSaleItem_productId_idx" ON "FlashSaleItem"("productId");
```

### 3.3. Công thức Nghiệp vụ & Hiển thị

#### A. Công thức Tính toán Tiến độ Cháy hàng:
```text
Bước 1: Tính phần trăm đã bán
Tỷ lệ đã bán (%) = (Số lượng đã bán x 100) / Giới hạn số lượng

Bước 2: Tính số suất còn lại
Số suất còn lại = Giới hạn số lượng - Số lượng đã bán

Ví dụ:
Sản phẩm Sữa rửa mặt Cosrx:
- Giới hạn: 100 suất
- Đã bán: 75 suất
-> Tỷ lệ đã bán: (75 x 100) / 100 = 75%
-> Số suất còn lại: 100 - 75 = 25 suất
-> Hiển thị trên thanh tiến trình: "Đang cháy hàng 75% (Còn 25 suất)"
```

#### B. Công thức Đếm ngược Thời gian thực:
```text
Bước 1: Khoảng cách mili-giây
Khoảng cách = Thời điểm kết thúc - Thời điểm hiện tại

Bước 2: Chuyển đổi đơn vị
Số giờ còn lại (HH) = Làm tròn xuống (Khoảng cách / (1000 x 60 x 60))
Số phút còn lại (MM) = Làm tròn xuống ((Khoảng cách % (1000 x 60 x 60)) / (1000 x 60))
Số giây còn lại (SS) = Làm tròn xuống ((Khoảng cách % (1000 x 60)) / 1000)

Ví dụ:
Thời gian kết thúc: 24:00:00 hôm nay
Thời điểm hiện tại: 21:15:30
-> Khoảng cách: 2 giờ 44 phút 30 giây
-> Hiển thị trên bộ đếm: [02] : [44] : [30]
```

### 3.4. Danh sách 100% các file thay đổi / tạo mới
| # | Đường dẫn File (File Path) | Loại | Mô tả chi tiết kỹ thuật |
| :--- | :--- | :--- | :--- |
| 1 | `prisma/schema.prisma` | `MODIFY` | Khai báo 2 model `FlashSale`, `FlashSaleItem` và quan hệ |
| 2 | `src/app/api/flash-sales/active/route.ts` | `NEW` | API public lấy chiến dịch Flash Sale đang active |
| 3 | `src/app/api/admin/flash-sales/route.ts` | `NEW` | API admin CRUD chiến dịch, hỗ trợ phân trang & RBAC |
| 4 | `src/app/api/orders/route.ts` | `MODIFY` | Cập nhật `soldQuantity` sau khi tạo đơn hàng có Flash Sale |
| 5 | `src/components/ui/CountdownTimer.tsx` | `NEW` | Component đếm ngược thời gian thực, có animation đổi số |
| 6 | `src/components/ui/FlashSaleProgressBar.tsx` | `NEW` | Thanh tiến trình cháy hàng gradient màu cam đỏ |
| 7 | `src/components/product/FlashSaleSection.tsx` | `NEW` | Section hiển thị sản phẩm Flash Sale trang chủ |
| 8 | `src/components/admin/FlashSaleManager.tsx` | `NEW` | Giao diện quản lý Flash Sale trong trang Admin |
| 9 | `src/components/admin/AdminSidebar.tsx` | `MODIFY` | Thêm tab 'flash-sales' vào danh sách điều hướng |
| 10 | `src/app/admin/page.tsx` | `MODIFY` | Nhúng `FlashSaleManager` vào Admin Page |
| 11 | `src/app/page.tsx` | `MODIFY` | Hiển thị `FlashSaleSection` trên trang chủ |
| 12 | `tests/flash-sale.test.ts` | `NEW` | Test suite tự động cho tính toán thời gian, progress bar và API |
| 13 | `task.md` | `MODIFY` | Checklist theo dõi dev và nghiệm thu kiểm thử |

---

## 4. Rủi ro / Lưu ý khi triển khai

1. **Lệch múi giờ (Timezone Drift)**:
   - Thời gian lưu trong PostgreSQL là UTC. Khi client tính toán countdown, sử dụng `new Date(item.endTime).getTime() - Date.now()` để đảm bảo đồng nhất thời gian theo Epoch timestamp, không bị ảnh hưởng bởi múi giờ của người dùng.
2. **Quá giới hạn suất bán (Overselling Concurrency)**:
   - Khi nhiều người đặt cùng lúc, sử dụng điều kiện `soldQuantity: { lt: limitQuantity }` hoặc kiểm tra trước khi xác nhận đơn để không bị âm số lượng còn lại.
3. **Hiệu năng SSR/SSG**:
   - Component `CountdownTimer` sử dụng Client Component (`"use client"`) để cập nhật `setInterval(..., 1000)` mà không gây ra lỗi Hydration Mismatch trên Next.js 15.

---

## 5. Checklist kiểm thử (Test Cases)

| Test Case | Loại kiểm thử | Nội dung kiểm thử & Kết quả mong đợi |
| :--- | :--- | :--- |
| **TC1** | Happy Path (Database) | Tạo bảng `FlashSale` và `FlashSaleItem` thành công trên cả Supabase và Neon qua MCP. |
| **TC2** | Happy Path (Countdown) | Timer đếm lùi chính xác từng giây; khi hết giờ tự kích hoạt callback `onExpire`. |
| **TC3** | Happy Path (Progress Bar) | Tính đúng tỷ lệ phần trăm đã bán và đổi màu thanh tiến trình khi vượt quá 80%. |
| **TC4** | Happy Path (API Public) | `GET /api/flash-sales/active` trả về đúng chiến dịch có `isActive=true` và nằm trong khung giờ. |
| **TC5** | Negative Path (API Public) | Không có chiến dịch nào active: API trả về `{ active: false, data: null }` an toàn. |
| **TC6** | Happy Path (Admin API) | Admin tạo chiến dịch Flash Sale mới, thêm sản phẩm và giá khuyến mãi thành công. |
| **TC7** | Negative Path (RBAC) | Nhân viên không có quyền quản lý sản phẩm gửi request tạo/sửa Flash Sale: Nhận `403 Forbidden`. |
| **TC8** | Order Integration | Khách đặt mua sản phẩm Flash Sale: Đơn hàng ghi nhận giá giảm, `soldQuantity` tự động tăng 1. |
| **TC9** | Sold Out Handling | Khi `soldQuantity >= limitQuantity`: Sản phẩm hiển thị nhãn "Đã hết suất Flash Sale". |
| **TC10** | Storefront UI | Trang chủ hiển thị khối Flash Sale mượt mà, đầy đủ thông tin giảm giá, thời gian và sản phẩm. |
