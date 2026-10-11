# Kiến Trúc Next.js 15 Fullstack Trên Vercel + Neon Serverless PostgreSQL

> **Dự án**: Coaching / Mentoring System  
> **Mô hình**: **Next.js 15 Fullstack (Serverless & Edge)**  
> **Hạ tầng Cloud**: **Vercel** (Hosting, Edge Network, Serverless Compute)  
> **Cơ sở dữ liệu**: **Neon Database** (Serverless PostgreSQL với Auto-scaling & Branching)  
> **Bộ nhớ đệm & Queue**: **Upstash Redis / QStash** (Serverless)  
> **Lưu trữ tệp (Storage)**: **Vercel Blob** hoặc **Cloudflare R2 / AWS S3**

---

## I. Sơ Đồ Kiến Trúc Serverless Hiện Đại (Vercel + Neon)

```
+-------------------------------------------------------------------------------------------------+
|                                       NGƯỜI DÙNG TOÀN CẦU (CLIENT)                             |
+-----------------------------------------------+-------------------------------------------------+
                                                |
                                                | HTTPS / HTTP2 / WSS
                                                v
+-------------------------------------------------------------------------------------------------+
|                                     VERCEL EDGE NETWORK (CDN)                                   |
|  - Tự động nén ảnh WebP/AVIF (next/image)                                                       |
|  - Cache tĩnh các trang ISR, CSS, JS bundle tại hơn 300+ Edge Data Centers                      |
|  - Middleware phân tách Web/Mobile không độ trễ (< 10ms)                                       |
+-----------------------------------------------+-------------------------------------------------+
                                                |
                                                v
+-------------------------------------------------------------------------------------------------+
|                                 VERCEL SERVERLESS FUNCTIONS (NODE.JS)                           |
|                                                                                                 |
|  [ FRONTEND (RSC & CLIENT) ]                                                                    |
|  - Next.js 15 App Router + React 19                                                             |
|  - Ant Design 5 (@ant-design/nextjs-registry) + Ant Design Mobile                               |
|                                                                                                 |
|  [ BACKEND (SERVER ACTIONS & ROUTE HANDLERS) ]                                                  |
|  - Server Actions gọi trực tiếp Neon qua Neon Serverless Driver (@neondatabase/serverless)      |
|  - Auth.js (NextAuth v5) với JWT Session mã hóa httpOnly Cookie                                |
|  - Xác thực 2 bước (2FA Google Authenticator qua `otplib`)                                      |
|  - Đọc/Ghi báo cáo: exceljs (Streaming) & docx                                                  |
|                                                                                                 |
|  [ HÀNG ĐỢI & REALTIME TRÊN SERVERLESS ]                                                        |
|  - Realtime Chat: Pusher Channels / Ably hoặc Server-Sent Events (SSE)                          |
|  - Async Jobs: Upstash QStash hoặc Inngest (thay thế Worker chạy ngầm)                          |
+--------------------+--------------------------+-------------------------+-----------------------+
                     |                          |                         |
                     | Neon HTTP / WebSocket    | REST (HTTP)             | S3 API
                     v                          v                         v
+--------------------+----+  +------------------+----+  +-----------------+-----------------------+
|  NEON POSTGRESQL (DB)   |  |   UPSTASH REDIS /     |  |       STORAGE TÀI LIỆU & MEDIA          |
|  - PgBouncer Pooler     |  |   UPSTASH QSTASH      |  |  - Vercel Blob hoặc Cloudflare R2       |
|  - Port 6543 / HTTP API |  |  - Session / Cache    |  |  - Ảnh minh chứng (ScheduleProof)       |
|  - Branching theo PR    |  |  - Hàng đợi Serverless|  |  - Tài liệu đính kèm, avatar            |
|  - Scale to Zero        |  |  - Không sợ nghẽn pool|  |  - Đường dẫn CDN công khai an toàn      |
+-------------------------+  +-----------------------+  +-----------------------------------------+
```

---

## II. Điểm Cốt Lõi Khi Chuyển Sang Vercel & Neon (Những Thay Đổi Cần Biết)

Do môi trường Serverless của Vercel là **Stateless** (ngắn hạn, không có ổ cứng cố định, tự động scale và tự động tắt khi không có request), hệ thống cần áp dụng các giải pháp chuẩn Serverless:

| Thành Phần Nghiệp Vụ | Mô Hình Truyền Thống (VPS / XAMPP) | Giải Pháp Chuẩn Serverless (Vercel + Neon) | Lý Do & Lợi Ích |
| :--- | :--- | :--- | :--- |
| **Kết nối Database** | 1 process giữ 1 connection cố định | **Neon Connection Pooler (PgBouncer)** hoặc `@neondatabase/serverless` | Hàng ngàn Serverless Function cùng bật không làm sập Database nhờ PgBouncer tích hợp sẵn của Neon |
| **Quản lý Schema & Migrations** | `php artisan migrate` | `prisma migrate deploy` qua **Direct Connection** của Neon | Tận dụng tính năng **Database Branching** của Neon: Mỗi Vercel Preview PR tự sinh một Database Branch riêng |
| **Realtime Chat** | [Laravel Reverb](file:///c:/xampp/htdocs/coaching/backend-coaching/composer.json#L14) / Socket.io chạy ngầm | **Pusher Channels** / **Ably** hoặc **Server-Sent Events (SSE)** | Vercel Function không thể duy trì kết nối WebSocket liên tục; các dịch vụ Pub/Sub serverless giúp đẩy tin nhắn tức thì |
| **Lưu trữ Tệp Upload** | Ổ cứng cục bộ (`storage/app/public`) | **Vercel Blob** hoặc **Cloudflare R2** / **AWS S3** | Serverless function không có ổ đĩa lưu vĩnh viễn; lưu tệp trên Object Storage giúp tải ảnh/tài liệu cực nhanh qua CDN |
| **Queue / Cron Jobs** | `php artisan queue:work` | **Upstash QStash** hoặc **Inngest** / **Vercel Cron** | Gọi webhook theo hàng đợi không cần duy trì tiến trình worker chạy 24/7 tốn RAM |
| **Redis Cache** | Cài Redis / Memurai cục bộ | **Upstash Redis (Serverless)** | Kết nối qua HTTP REST API, không làm tốn connection pool |

---

## III. Tối Ưu Kết Nối Neon PostgreSQL Trong Next.js

Neon cung cấp 2 chuỗi kết nối quan trọng:
1. **Pooled Connection URL (Cổng 6543 hoặc domain có chữ `-pooler`)**: Dùng cho toàn bộ ứng dụng Next.js khi xử lý query / Server Actions để tránh cạn kiệt kết nối.
2. **Direct Connection URL (Cổng 5432)**: Dùng riêng cho Prisma Migration (`prisma migrate dev` / `prisma migrate deploy`).

### 1. Cấu hình file `.env` chuẩn Neon
```env
# Kết nối qua PgBouncer (Dùng cho truy vấn của ứng dụng)
DATABASE_URL="postgresql://user:password@ep-cool-branch-pooler.us-east-2.aws.neon.tech/coaching?sslmode=require&pgbouncer=true&connect_timeout=15"

# Kết nối trực tiếp (Dùng cho Prisma CLI / Migration)
DIRECT_URL="postgresql://user:password@ep-cool-branch.us-east-2.aws.neon.tech/coaching?sslmode=require"
```

### 2. Cấu hình `schema.prisma` hỗ trợ Direct URL & Neon Adapter
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}
```

### 3. Tối ưu Driver Neon Serverless (Giảm Cold Start Về < 50ms)
Cài đặt adapter của Neon để query qua giao thức HTTP / WebSocket tối ưu cho Edge:
```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
npm install -D @types/ws
```

Khởi tạo client ([lib/prisma.ts]):
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Thiết lập WebSocket cho môi trường Node.js cục bộ khi dev
neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## IV. Tối Ưu Tính Năng Neon Database Branching Trên Vercel

Một trong những ưu thế độc quyền lớn nhất của combo **Vercel + Neon**:
* **Xem trước an toàn (Preview Deployments)**:
  * Khi tạo một Pull Request trên GitHub/GitLab, Vercel tự động tạo một deployment preview (ví dụ: `coaching-pr-12.vercel.app`).
  * Neon tự động phân nhánh (Branch) một bản sao độc lập của cơ sở dữ liệu production trong tích tắc (Zero-copy clone).
  * Bạn có thể thoải mái chạy migration thử nghiệm, test tính năng mới mà **hoàn toàn không sợ ảnh hưởng đến dữ liệu thật**. Khi merge PR, branch đó tự động được xóa bỏ.

---

## V. Xử Lý Tệp & Media Bằng Vercel Blob (Thay Thế Laravel Storage)

Do không còn ổ cứng máy chủ XAMPP/VPS:
1. Cài đặt SDK:
   ```bash
   npm install @vercel/blob
   ```
2. Upload minh chứng buổi học ([ScheduleProof](file:///c:/xampp/htdocs/coaching/backend-coaching/app/Models/ScheduleProof.php)) trực tiếp lên CDN:
   ```typescript
   // app/api/upload/route.ts
   import { put } from '@vercel/blob';
   import { NextResponse } from 'next/server';

   export async function POST(request: Request): Promise<NextResponse> {
     const { searchParams } = new URL(request.url);
     const filename = searchParams.get('filename') || 'proof.jpg';

     const blob = await put(filename, request.body!, {
       access: 'public',
     });

     return NextResponse.json(blob);
   }
   ```
   * Tệp được phân phối qua Vercel Global Edge Network với tốc độ tải ảnh cực nhanh và tự động hỗ trợ cache vĩnh viễn.

---

## VI. Tối Ưu Realtime Chat & Thông Báo (Không Cần Server WebSocket)

Thay vì phải chạy server Laravel Reverb hay Socket.io ngốn tài nguyên:
* Dùng **Pusher Channels** (hoặc **Ably**) gói miễn phí hỗ trợ tới 200,000 tin nhắn/ngày và 100 kết nối đồng thời:
  * Khi học viên/mentor gửi tin nhắn qua Server Action:
    ```typescript
    // app/actions/chat.ts
    'use server';
    import { pusherServer } from '@/lib/pusher';
    import { prisma } from '@/lib/prisma';

    export async function sendMessage(sessionId: number, content: string) {
      const message = await prisma.chat_message.create({
        data: { session_id: sessionId, content }
      });

      // Bắn sự kiện tức thì tới phòng chat
      await pusherServer.trigger(`session-${sessionId}`, 'new-message', message);
      return message;
    }
    ```
  * Phía Client dùng `pusher-js` nhận tin nhắn tức thì:
    ```typescript
    // Hook bên Client Component
    useEffect(() => {
      const channel = pusherClient.subscribe(`session-${sessionId}`);
      channel.bind('new-message', (data) => setMessages((prev) => [...prev, data]));
      return () => { pusherClient.unsubscribe(`session-${sessionId}`); };
    }, [sessionId]);
    ```

---

## VII. Tối Ưu Frontend (Vercel Edge)

1. **Phân Tách Giao Diện Web & Mobile Tận Edge**:
   ```typescript
   // middleware.ts
   import { NextResponse, userAgent } from 'next/server';
   import type { NextRequest } from 'next/server';

   export function middleware(request: NextRequest) {
     const { device } = userAgent(request);
     const isMobile = device.type === 'mobile' || device.type === 'tablet';

     const requestHeaders = new Headers(request.headers);
     requestHeaders.set('x-device-type', isMobile ? 'mobile' : 'desktop');

     return NextResponse.next({
       request: { headers: requestHeaders },
     });
   }
   ```
   * Chạy trực tiếp tại Vercel Edge (< 5ms) trước khi đến hàm render, đảm bảo người dùng điện thoại và máy tính nhận đúng HTML ngay từ đầu mà không bị giật layout.

2. **Ant Design 5 SSR Registry**:
   * Bọc `@ant-design/nextjs-registry` để chống lỗi FOUC và Hydration Mismatch trên môi trường Vercel.

3. **Incremental Static Regeneration (ISR)**:
   * Các trang danh mục chức danh ([Position](file:///c:/xampp/htdocs/coaching/backend-coaching/app/Models/Position.php)), khu vực ([Location](file:///c:/xampp/htdocs/coaching/backend-coaching/app/Models/Location.php)), danh sách khóa học mẫu ([CourseSessionTemplate](file:///c:/xampp/htdocs/coaching/backend-coaching/app/Models/CourseSessionTemplate.php)) được cấu hình cache tĩnh trên Edge:
     ```typescript
     export const revalidate = 3600; // Tự động làm mới mỗi 1 tiếng
     ```

---

## VIII. Quy Trình Triển Khai Lên Vercel & Neon

1. **Tạo Database trên Neon**:
   * Truy cập [neon.tech](https://neon.tech), tạo Project `coaching`.
   * Lấy 2 chuỗi kết nối: `Pooled` và `Direct`.
2. **Khai báo Environment Variables trên Vercel**:
   * Vào **Project Settings -> Environment Variables** trên Vercel:
     * `DATABASE_URL`: Chuỗi kết nối Neon Pooled.
     * `DIRECT_URL`: Chuỗi kết nối Neon Direct.
     * `NEXTAUTH_SECRET`: Khóa bí mật sinh bằng `openssl rand -base64 32`.
     * `NEXTAUTH_URL`: Domain Vercel của bạn (ví dụ: `https://coaching.vercel.app`).
     * `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_KEY`: Khóa kết nối Pusher.
     * `BLOB_READ_WRITE_TOKEN`: Khóa Vercel Blob (bật trong tab Storage của Vercel).
3. **Deploy**:
   * Kết nối repo GitHub/GitLab với Vercel.
   * Mỗi lệnh `git push` lên `main` sẽ tự động trigger build và deploy production trong vòng chưa đầy 1 phút.


# QUY CHUẨN THIẾT KẾ, PHÁT TRIỂN & TỐI ƯU HỆ THỐNG
*(Dành riêng cho Next.js Fullstack: App Router, React 19, TypeScript, Server Actions & Modern ORM)*

> **Mục đích**: Tài liệu này đóng gói toàn bộ các nguyên tắc, tiêu chuẩn kỹ thuật (Frontend, Backend, Database, Tương tác UI 0ms, Bảo mật và Quy trình) được chuẩn hóa 100% cho hệ sinh thái **Next.js Fullstack**, sẵn sàng mang sang làm kim chỉ nam phát triển cho bất kỳ dự án nào.

---

## I. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Tư Duy Dữ Liệu Lớn (10.000+ Records Mindset)**:
   * Trước khi viết bất kỳ câu query (Prisma/Drizzle) hay render component danh sách, luôn tự hỏi: *"Nếu bảng có 10.000+ bản ghi, hệ thống có bị nghẽn RAM serverless hay đơ trình duyệt không?"*.
   * Triệt tiêu tư duy kéo toàn bộ mảng dữ liệu về RAM Node.js hoặc trình duyệt để lọc/đếm.
2. **Nói KHÔNG Với Suy Đoán Cảm Tính (Evidence-Based)**:
   * Mọi quyết định tối ưu phải dựa trên schema thực tế, execution plan (`EXPLAIN ANALYZE`), thời gian phản hồi mạng và hành vi người dùng.
3. **Type-Safety & Tái Sử Dụng Thành Phần (End-to-End Type Safety)**:
   * Sử dụng TypeScript Strict Mode. Một schema validation (Zod) dùng chung cho cả Form ở Client và Server Action ở Backend.
   * Ưu tiên tái sử dụng component/hook sẵn có, tuyệt đối không tự ý xóa code cũ nếu chưa được sự đồng ý.

---

## II. QUY CHUẨN FRONTEND & TƯƠNG TÁC UI/UX (FE STANDARDS)

### 1. Quy Tắc Xử Lý Click Không Bị Đơ/Lâu (Instant & Non-Blocking UI)
* **Chống Double Submit / Spam Click**:
  * Khi người dùng click vào nút hành động (Lưu, Gửi, Duyệt, Đặt lịch, Thêm giỏ hàng...), nút bấm **bắt buộc phải chuyển sang trạng thái `disabled` và hiện icon loading ngay lập tức** trong lúc Server Action đang xử lý (`isPending`).
  * Ngăn chặn người dùng click liên tục gây bắn nhiều request làm nghẽn kết nối và sinh dữ liệu trùng lặp.
* **Phân Biệt Rạch Ròi 4 Trạng Thái Giao Diện**:
  1. `initial loading`: Tải trang lần đầu (dùng `loading.tsx` hoặc Skeleton của Ant Design/Tailwind).
  2. `refreshing`: Làm mới dữ liệu nền (không che màn hình hay chặn thao tác của user).
  3. `mutation pending`: Đang xử lý sau khi click (chỉ xoay loading ngay tại nút bấm đó).
  4. `empty`: Không có dữ liệu (bắt buộc render Empty State component chuyên nghiệp, không để màn hình trắng hay treo vô tận).
* **Tận Dụng Phản Hồi Tức Thì (Optimistic UI với React 19)**:
  * Với các thao tác đơn giản (Like, Bookmark, Toggle trạng thái, Check hoàn thành...):
    * Sử dụng hook **`useOptimistic`** để đổi giao diện **ngay lập tức trong 0 mili-giây**.
    * Gửi Server Action ngầm xuống database. Nếu server báo lỗi thì tự động rollback về giá trị cũ.
* **Non-Blocking UI với `useTransition`**:
  * Khi click chuyển tab, lọc danh sách lớn hoặc gọi action, bọc thao tác trong `startTransition` để React không chặn luồng vẽ giao diện (main thread), giúp con trỏ chuột và nút bấm luôn mượt mà.
* **Chặn Request Cũ Ghi Đè Request Mới (Race Condition)**:
  * Khi người dùng gõ tìm kiếm hoặc đổi filter liên tục: **Bắt buộc dùng `debounce` (tối thiểu 300ms - 500ms)** để gom request. Request cũ chậm không được phép đè kết quả của request mới.
* **Tối Ưu Chuyển Trang & Tải Trước (Prefetching)**:
  * Sử dụng thẻ `<Link href="..." prefetch={true}>` của Next.js để tải trước code và dữ liệu trang đích ngay khi link xuất hiện trên màn hình.
  * Với modal/drawer chi tiết: Sử dụng sự kiện `onMouseEnter` (hover) để prefetch dữ liệu trước 200ms trong lúc não bộ người dùng chuẩn bị bấm chuột.

### 2. Quản Lý Dữ Liệu Lớn & Dropdown (Select / Autocomplete)
* **Quy tắc Ajax Dynamic Search**: Bắt buộc tìm kiếm từ khóa qua Server Action / API để tải dữ liệu động theo từng trang cho các trường Danh mục (Categories) hoặc trường dữ liệu có khả năng vượt quá 50 mục.
* **Cấm tuyệt đối**: **TUYỆT ĐỐI KHÔNG render toàn bộ hàng trăm/hàng nghìn thẻ `<option>` vào cây DOM**. Thao tác này sẽ làm đơ cứng trình duyệt khi người dùng click mở dropdown.

### 3. Hiển Thị Bảng Dữ Liệu (Datatables / Lists)
* **Bắt buộc 2 tính năng**: Mọi tính năng hiển thị danh sách dạng bảng đều phải tích hợp đầy đủ:
  1. **Phân trang từ Server (Server-side Pagination)**: Quản lý qua URL searchParams (ví dụ `?page=1&limit=15`).
  2. **Bộ lọc tìm kiếm (Filtering / Searching)**.
* **Dữ liệu lớn trên Mobile**: Sử dụng Virtualized List (như `@tanstack/react-virtual`) hoặc Infinite Scroll thay vì render toàn bộ danh sách.

### 4. Phân Quyền & Kiểm Soát Giao Diện (Access Control)
* **Check Permission Trước Khi Render**: Luôn kiểm tra quyền (Role / Gate / Session) trước khi render các nút bấm hoặc tính năng.
* Không được để tình trạng người dùng nhìn thấy nút bấm, click vào rồi Server Action mới ném ra lỗi `Unauthorized`. Nút ẩn/disabled là tối ưu UX, còn Server Action vẫn phải kiểm tra quyền bảo mật ở tầng cuối.

### 5. Đa Ngôn Ngữ & Màu Sắc Hệ Thống
* **Không Hardcode Text**: Toàn bộ chuỗi hiển thị phải qua hàm đa ngôn ngữ (ví dụ: `useTranslations()` của `next-intl`). Tái sử dụng key có sẵn, không tự ý tạo key trùng lặp nghĩa.
* **Không Bịa Màu Hex**: Sử dụng design tokens chuẩn của hệ thống (Tailwind classes hoặc Ant Design theme tokens).

---

## III. QUY CHUẨN BACKEND & DATA LAYER TRONG NEXT.JS (BE STANDARDS)

### 1. Kiến Trúc Backend Trong Next.js: Server Actions vs Route Handlers
* **Server Actions (`'use server'`)**: Ưu tiên hàng đầu cho toàn bộ thao tác thêm, sửa, xóa (Mutations) và form submissions từ giao diện.
* **Route Handlers (`app/api/**/route.ts`)**: Chỉ dùng cho Webhooks bên thứ ba, Streaming dữ liệu lớn, Export file nhị phân (Excel/PDF) hoặc cung cấp public API cho ứng dụng ngoài.

### 2. Cấu Trúc Trả Về Chuẩn (Server Action & API Envelope)
Mọi Server Action và Route Handler bắt buộc trả về cấu trúc đồng nhất:

* **Chuẩn Server Action Response**:
  ```typescript
  type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  };
  ```
* **Chuẩn Phân Trang (Paginated Response)**:
  ```typescript
  type PaginatedResponse<T> = {
    items: T[];
    meta: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };
  ```

### 3. Xác Thực, Phân Quyền & Validation Dữ Liệu
* **Validation với Zod (Single Source of Truth)**:
  * Mọi dữ liệu đầu vào của Server Action / Route Handler **bắt buộc phải qua `schema.parse()` hoặc `schema.safeParse()`**.
  ```typescript
  const schema = z.object({
    slotId: z.number().int().positive(),
  });
  ```
* **Bảo Mật Danh Tính (Authentication Check)**:
  * Bắt buộc kiểm tra session đăng nhập (ví dụ: `const session = await auth()`) ngay tại dòng đầu tiên của Server Action.
  * **Tuyệt đối không tin tưởng `userId` truyền từ client**: Luôn lấy `userId` từ `session.user.id` của token đã được verify.
* **Xử lý XSS & Dữ liệu Rich Text**:
  * Khi cho phép người dùng nhập nội dung HTML/Markdown (bài viết, mô tả khóa học), bắt buộc làm sạch qua thư viện sanitizer (ví dụ: `sanitize-html`) trước khi lưu vào CSDL.

### 4. Tối Ưu Truy Vấn CSDL (Prisma / Drizzle / PostgreSQL)
* **Chỉ Select Cột Cần Dùng**:
  * Tuyệt đối không query toàn bộ bảng (`select *`). Với Prisma, luôn dùng `select` để giới hạn các trường hiển thị, đặc biệt tránh kéo các cột JSONB hoặc text dài nếu không cần.
  ```typescript
  // Chuẩn:
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, status: true },
  });
  ```
* **Đếm Trực Tiếp Bằng CSDL (Aggregations)**:
  * Dùng `prisma.model.count({ where: ... })` hoặc `_count` trong relation. Tuyệt đối không kéo cả mảng records về rồi gọi `.length`.
* **Sử Dụng Transactions Cho Nhiều Bước Thay Đổi**:
  * Khi một hành động thay đổi từ 2 bảng trở lên (ví dụ: trừ sĩ số slot + tạo bản ghi đăng ký), bắt buộc dùng `prisma.$transaction()` để đảm bảo toàn vẹn dữ liệu.
* **Đánh Chỉ Mục (Indexes)**:
  * Mọi trường khóa ngoại (`foreignKey`), trạng thái (`status`), thời gian (`createdAt`) bắt buộc có `@@index`.
  * Các câu truy vấn có từ 2 điều kiện lọc trở lên phải có **Composite Index** trong schema.
* **Quản Lý Connection Pool (Đặc biệt với Serverless / Neon DB)**:
  * Khởi tạo Prisma Client dạng Singleton trên `globalThis`.
  * Sử dụng chuỗi kết nối có Pooler (`PgBouncer`, cổng 6543 hoặc tham số `connection_limit`) để tránh lỗi quá tải kết nối khi Serverless Function scale tự động.

### 5. Caching & Làm Mới Dữ Liệu (Cache Invalidation)
* Sau khi thực hiện Server Action thay đổi dữ liệu, bắt buộc gọi:
  * `revalidatePath('/schedules')` để làm mới trang.
  * Hoặc `revalidateTag('schedules-list')` để xóa cache dữ liệu theo tag tương ứng.
* Dùng `unstable_cache` của Next.js cho các hàm đọc danh mục ít thay đổi để phản hồi tức thì trong 5ms - 20ms.

---

## IV. QUY TRÌNH PHÁT TRIỂN & BÀN GIAO (WORKFLOW)

1. **Lên Kế Hoạch Trước (Plan First)**:
   * Trước khi viết code, luôn làm rõ 4 điểm:
     1. Schema CSDL (Model, Relations, Indexes).
     2. Zod Schema (Validation rules).
     3. Server Actions / API Handlers cần tạo.
     4. Trạng thái UI (Loading, Empty, Mutation Pending, Success, Error).
2. **Kiểm Tra Lỗi Cú Pháp & Type (Verification Bắt Buộc)**:
   * Trước khi xác nhận hoàn thành task, bắt buộc chạy:
     ```bash
     npm run build
     # Hoặc: npx tsc --noEmit
     ```
   * Đảm bảo không còn bất kỳ lỗi TypeScript, lint error nào.
3. **Kiểm Thử Trải Nghiệm Mạng Chậm**:
   * Bật Network Throttling (Slow 3G) trong DevTools để kiểm tra xem nút bấm có bị double submit không, giao diện loading có mượt mà không.
