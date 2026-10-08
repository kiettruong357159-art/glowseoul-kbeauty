# TECH SPEC: Chuẩn Hóa Bộ Quy Chuẩn Dự Án, Tối Ưu Hiệu Năng Dữ Liệu Lớn & Thắt Chặt Phân Quyền RBAC

- **Ticket**: `[GLOW-2026-10-08] Project Rules & Enterprise Mindset Alignment`
- **Loại**: `Product Improvement / Architecture Refactoring / Performance & Security Optimization`
- **Mức độ**: `Cao`
- **Module ảnh hưởng**: `Database Schema (Prisma & Supabase), Backend API Routes (/api/admin/*), Admin Components & State`
- **Ngày**: `08/10/2026`
- **Tác giả**: `Antigravity Tech Lead`

---

## 1. Mô tả yêu cầu

### 1.1. Hiện trạng & Bối cảnh
Trước đợt rà soát này:
- Dự án `glowseoul-kbeauty` có tài liệu quy chuẩn bị pha trộn với các rule global ngoài hệ sinh thái (như Laravel/PHP, đa ngôn ngữ 4 thứ tiếng, Scribe, migration SQL Server), gây loãng và khó chuyển giao sang các dự án mới.
- **Về hiệu năng (Scalability)**: Các API quản trị nội bộ (`/api/admin/products`, `/api/admin/orders`, `/api/admin/coupons`) đang thực thi truy vấn nạp toàn bộ bản ghi (`findMany()`) không có giới hạn `take` và `skip`. Khi dữ liệu khách hàng và sản phẩm tăng lên > 10.000 records, truy vấn này sẽ gây tràn bộ nhớ RAM (OOM) của server và làm nghẽn Event Loop.
- **Về Database**: Các bảng chính trong database (`Product`, `Order`, `OrderItem`, `Review`, `Coupon`, `User`) thiếu các chỉ mục (`@@index`) tại các trường thường xuyên lọc (`category`, `brand`, `skinType`, `orderStatus`, `paymentStatus`, `userId`, `roleId`), dẫn đến tình trạng quét toàn bảng (Full Table Scan) với độ trễ cao.
- **Về Bảo mật (Security & RBAC)**: Dù đã có hệ thống phân quyền Role và Session HMAC SHA-256 (`src/lib/auth.ts`), một số API routes nội bộ chưa có cổng kiểm tra quyền (Permission Gate). Trên giao diện quản trị, một số nút hành động nhạy cảm (Thêm/Sửa/Xóa sản phẩm) vẫn hiển thị ngay cả khi tài khoản nhân viên không có quyền quản lý.

### 1.2. Nguyên nhân (Root Cause)
- Chưa có tài liệu quy chuẩn kỹ thuật độc lập (`PROJECT_RULES_TEMPLATE.md`) phản ánh chính xác 100% công nghệ Next.js 15, TypeScript, Prisma, Vanilla CSS Design System.
- Backend API handlers chưa tách biệt phân trang cấp server (`Server-side Pagination`) mà phụ thuộc vào việc client tải hết rồi tự phân trang.
- Prisma schema chưa khai báo các chỉ mục `@@index`, dẫn đến database PostgreSQL trên Supabase không tự sinh các b-tree index tương ứng.

### 1.3. Yêu cầu & Mục tiêu (Scope & Target)
1. Tạo bộ quy chuẩn độc lập [PROJECT_RULES_TEMPLATE.md](file:///c:/Users/MSI%20RAIDER%20GE76/Documents/Project/glowseoul-kbeauty/PROJECT_RULES_TEMPLATE.md) chắt lọc 4 Tư Duy Cốt Lõi Enterprise (Dữ liệu lớn 10k, Kỷ luật RBAC, Kỷ luật Thẩm mỹ, Kỷ luật Workflow) và công nghệ thực tế.
2. Thêm chỉ mục `@@index` vào Prisma Schema và thực thi Safe DDL Migration trực tiếp lên database Supabase PostgreSQL qua Supabase MCP.
3. Bổ sung tham số phân trang `page` & `pageSize` (`skip`/`take`) ở tất cả các API quản trị, giới hạn tối đa `pageSize <= 100`.
4. Áp dụng cổng kiểm tra quyền `getCurrentUserFromCookie` tại các API `POST`, `PUT`, `DELETE`, trả về mã lỗi `403 Forbidden` khi tài khoản không đủ quyền.
5. Đồng bộ phân quyền lên UI: Tự động ẩn tab "Tài khoản & Phân quyền" trên Sidebar nếu không phải Admin; tự động ẩn nút "Thêm mới" và chuyển nút Sửa/Xóa thành nhãn "Chỉ xem" đối với tài khoản không có quyền quản lý sản phẩm.

---

## 2. Phạm vi ảnh hưởng

### 2.1. Đối tượng trong phạm vi (In-scope)
| # | Đối tượng | Module | Ghi chú tác động |
| :--- | :--- | :--- | :--- |
| 1 | `prisma/schema.prisma` | Database Schema | Bổ sung 14 chỉ mục `@@index` cho Product, Order, OrderItem, Review, Coupon, User |
| 2 | `Supabase PostgreSQL (glowseoul)` | Database Remote | Thực thi migration `add_performance_indexes_for_large_datasets` qua Supabase MCP |
| 3 | `/api/admin/products` | Route Handler | Hỗ trợ `page`, `pageSize`, kiểm tra quyền `products:manage` cho POST, PUT, DELETE |
| 4 | `/api/admin/orders` | Route Handler | Hỗ trợ `page`, `pageSize`, kiểm tra quyền `orders:manage` cho PUT |
| 5 | `/api/admin/coupons` | Route Handler | Hỗ trợ `page`, `pageSize`, kiểm tra quyền `coupons:manage` cho POST, PUT, DELETE |
| 6 | `/api/admin/banners` | Route Handler | Kiểm tra quyền `banners:manage` cho PUT |
| 7 | `AdminSidebar.tsx` | UI Component | Ẩn tab người dùng `users` đối với tài khoản không phải `ADMIN` |
| 8 | `ProductListTable.tsx` | UI Component | Thêm prop `canManage`, ẩn nút Thêm và khóa các thao tác Sửa/Xóa |
| 9 | `src/app/admin/page.tsx` | Container Page | Truyền trạng thái quyền `canManage` từ `useAuth()` xuống bảng sản phẩm |
| 10 | `PROJECT_RULES_TEMPLATE.md` | Tài liệu dự án | Tài liệu quy chuẩn hoàn chỉnh sẵn sàng copy sang dự án mới |
| 11 | `task.md` | Checklist tiến độ | Theo dõi checklist nghiệm thu chi tiết từng bước |

### 2.2. Ngoài phạm vi (Out-of-scope)
- Toàn bộ giao diện Storefront mua hàng của người dùng (`/products`, `/products/[id]`, `/checkout`, `/orders/[id]`) được giữ nguyên vẹn 100%, không bị ảnh hưởng.
- Không thay đổi cấu trúc bảng hay xóa/sửa bất kỳ cột dữ liệu nào đang có.
- Không sửa đổi logic tính toán thanh toán VietQR Napas247 và giỏ hàng (`CartContext`).

---

## 3. Giải pháp kỹ thuật

### 3.1. Tối ưu hóa Database & Indexing cho Dữ liệu lớn
Trong `prisma/schema.prisma`, bổ sung các chỉ mục phục vụ truy vấn thường xuyên:
```prisma
model Product {
  // ...
  @@index([category])
  @@index([brand])
  @@index([skinType])
  @@index([createdAt])
}

model Order {
  // ...
  @@index([userId])
  @@index([orderStatus])
  @@index([paymentStatus])
  @@index([createdAt])
}

model OrderItem {
  // ...
  @@index([orderId])
  @@index([productId])
}

model Review {
  // ...
  @@index([productId])
  @@index([userId])
}

model Coupon {
  // ...
  @@index([isActive])
}

model User {
  // ...
  @@index([roleId])
}
```

### 3.2. Migration Thực Tế Qua Supabase MCP
Sử dụng công cụ MCP `supabase:apply_migration` thực thi DDL an toàn trên cơ sở dữ liệu production/remote `glowseoul` (ID: `oyzbmwwyrwfxjhzmbhkh`):
```sql
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
CREATE INDEX IF NOT EXISTS "Product_brand_idx" ON "Product"("brand");
CREATE INDEX IF NOT EXISTS "Product_skinType_idx" ON "Product"("skinType");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt");

CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_orderStatus_idx" ON "Order"("orderStatus");
CREATE INDEX IF NOT EXISTS "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");

CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");

CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId");
CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");

CREATE INDEX IF NOT EXISTS "Coupon_isActive_idx" ON "Coupon"("isActive");
CREATE INDEX IF NOT EXISTS "User_roleId_idx" ON "User"("roleId");
```

### 3.3. Phân trang & RBAC Permission Gate tại Route Handlers
Cấu trúc chuẩn tại các route quản trị:
```typescript
// 1. Phân trang chuẩn với tham số page & pageSize
const pageParam = searchParams.get('page');
const pageSizeParam = searchParams.get('pageSize');
const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : null;
const pageSize = pageSizeParam ? Math.min(100, Math.max(1, parseInt(pageSizeParam, 10) || 10)) : null;

const findOptions: any = { where, orderBy: { createdAt: 'desc' } };
if (page && pageSize) {
  findOptions.skip = (page - 1) * pageSize;
  findOptions.take = pageSize;
}

// 2. Chặn quyền trước khi thực thi Create / Update / Delete
const cookieHeader = request.headers.get('cookie');
const currentUser = await getCurrentUserFromCookie(cookieHeader);
if (currentUser) {
  const isAllowed =
    currentUser.role === 'ADMIN' ||
    currentUser.permissions.includes('*') ||
    currentUser.permissions.includes('products:manage') ||
    currentUser.permissions.includes('products:*');
  if (!isAllowed) {
    return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này' }, { status: 403 });
  }
}
```

### 3.4. Danh sách 100% các file thay đổi
| # | Đường dẫn File (File Path) | Thay đổi | Mô tả chi tiết kỹ thuật |
| :--- | :--- | :--- | :--- |
| 1 | `prisma/schema.prisma` | `MODIFY` | Khai báo 14 chỉ mục `@@index` cho Product, Order, OrderItem, Review, Coupon, User |
| 2 | `src/app/api/admin/products/route.ts` | `MODIFY` | Bổ sung phân trang `skip`/`take` và kiểm tra quyền RBAC cho POST, PUT, DELETE |
| 3 | `src/app/api/admin/orders/route.ts` | `MODIFY` | Bổ sung phân trang `skip`/`take` và kiểm tra quyền RBAC cho PUT |
| 4 | `src/app/api/admin/coupons/route.ts` | `MODIFY` | Bổ sung phân trang `skip`/`take` và kiểm tra quyền RBAC cho POST, PUT, DELETE |
| 5 | `src/app/api/admin/banners/route.ts` | `MODIFY` | Bổ sung kiểm tra quyền RBAC cho PUT banner |
| 6 | `src/components/admin/AdminSidebar.tsx` | `MODIFY` | Tích hợp `useAuth()`, ẩn tab `users` đối với tài khoản không phải `ADMIN` |
| 7 | `src/components/admin/ProductListTable.tsx` | `MODIFY` | Bổ sung prop `canManage`, ẩn nút Thêm sản phẩm và chuyển Sửa/Xóa thành nhãn Chỉ xem |
| 8 | `src/app/admin/page.tsx` | `MODIFY` | Truyền prop `canManage` tính toán từ session của người dùng đăng nhập |
| 9 | `PROJECT_RULES_TEMPLATE.md` | `NEW` | Bộ quy chuẩn dự án hoàn chỉnh, chuẩn hóa 4 Tư Duy Cốt Lõi Enterprise |
| 10 | `task.md` | `NEW` | File checklist theo dõi tiến độ chi tiết và nghiệm thu các bước |
| 11 | `docs/superpowers/specs/2026-10-08-project-rules-performance-rbac-alignment.md` | `NEW` | Tài liệu Kỹ thuật (Tech Spec) chi tiết theo chuẩn 5 phần |

---

## 4. Rủi ro / Lưu ý khi triển khai (Risks & Considerations)

1. **Khả năng tương thích ngược (Backward Compatibility)**:
   - Các API `GET` nếu không nhận được tham số `page` hoặc `pageSize` thì vẫn trả về đầy đủ mảng dữ liệu kèm trường đếm `total` để đảm bảo 100% không làm gãy các component hoặc test suite hiện có.
2. **Cảnh báo Row Level Security (RLS)**:
   - 11 bảng trên Supabase hiện chưa bật RLS. Do backend Next.js truy vấn trực tiếp qua Prisma Client sử dụng Service Role / direct connection, quyền truy cập vẫn an toàn ở tầng backend. Tuy nhiên, nếu sau này mở rộng dùng Supabase Client ở trình duyệt thì cần viết RLS Policies trước khi enable RLS.

---

## 5. Checklist kiểm thử (Test Cases)

| Test Case | Loại kiểm thử | Nội dung kiểm thử & Kết quả mong đợi |
| :--- | :--- | :--- |
| **TC1** | Happy Path (Database) | Kiểm tra `pg_indexes`: Xác nhận đủ 14 chỉ mục mới với đuôi `_idx` đã tồn tại trên Supabase. |
| **TC2** | Happy Path (API) | Gửi `GET /api/admin/products?page=1&pageSize=5`: Trả về đúng 5 sản phẩm, `total=12`, `totalPages=3`. |
| **TC3** | Happy Path (API) | Gửi `GET /api/admin/orders?page=1&pageSize=10`: Trả về dữ liệu đơn hàng phân trang thành công. |
| **TC4** | Negative Path (RBAC) | Gửi `POST /api/admin/products` kèm cookie của tài khoản `STAFF` (không có quyền `products:manage`): Nhận phản hồi `403 Forbidden`. |
| **TC5** | Negative Path (RBAC) | Gửi `DELETE /api/admin/coupons?id=xxx` kèm cookie tài khoản không đủ quyền: Nhận phản hồi `403 Forbidden`. |
| **TC6** | Happy Path (RBAC) | Đăng nhập tài khoản `ADMIN`: Thực hiện đầy đủ các thao tác Thêm, Sửa, Xóa sản phẩm và coupon thành công. |
| **TC7** | UI State (Sidebar) | Đăng nhập tài khoản vai trò `STAFF`: Sidebar không hiển thị mục "Tài khoản & Phân quyền". |
| **TC8** | UI State (Sidebar) | Đăng nhập tài khoản vai trò `ADMIN`: Sidebar hiển thị đầy đủ mục "Tài khoản & Phân quyền". |
| **TC9** | UI State (Table) | Xem bảng sản phẩm khi `canManage=false`: Nút "Thêm sản phẩm mới" biến mất, cột thao tác hiển thị nhãn "Chỉ xem". |
| **TC10** | UI State (Table) | Xem bảng sản phẩm khi `canManage=true`: Nút "Thêm sản phẩm mới" và hai nút icon Sửa/Xóa hiển thị đầy đủ. |
| **TC11** | Regression | Truy cập Storefront (`/products`, `/products/[id]`): Tốc độ tải và bộ lọc sản phẩm hoạt động mượt mà, không phát sinh lỗi. |
| **TC12** | Regression | Đặt hàng kiểm thử VietQR: Luồng tạo đơn hàng và sinh mã QR Napas247 hoạt động chính xác. |
