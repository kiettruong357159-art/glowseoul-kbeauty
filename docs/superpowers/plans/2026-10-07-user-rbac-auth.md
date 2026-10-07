# User, Role-Based Access Control (RBAC) & Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete User and Role-Based Access Control (RBAC) system with models (`User`, `Role`), secure session cookie authentication, distinct admin login (`/admin/login`) and customer login (`/login`), user profile & logout on Admin Header/Sidebar, and an in-portal User & Role Manager.

**Architecture:** 
1. Database schema in Prisma with `User` and `Role` models storing hashed credentials and permissions JSON.
2. Lightweight secure auth layer in `src/lib/auth.ts` using Node.js built-in PBKDF2/SHA-256 for passwords and signed HttpOnly cookies (`glowseoul_session`) for sessions.
3. React `AuthContext` to expose authenticated state to both admin and storefront components.
4. Separate Admin Login (`/admin/login`) with 1-click demo logins for Admin & Staff, and Customer Login (`/login`).
5. Role-aware Admin Portal with route protection, header profile/logout, and a dedicated `UserManager` component.

**Tech Stack:** Next.js 15 App Router, React 19, Prisma ORM, SQLite, Node.js native `crypto`, Lucide Icons, Vitest.

**Spec:** `/Users/Kiet/.gemini/antigravity-ide/brain/be386353-8ed6-413a-b844-f24bae1b29e4/auth_rbac_design_spec.md`

## Global Constraints
- Passwords must be hashed with salt using Node.js `crypto.pbkdf2Sync` (no brittle native binaries like C++ bcrypt).
- Session cookie `glowseoul_session` must be HttpOnly, SameSite=Lax, Path=/.
- `/admin/login` must reject users with role `CUSTOMER` with a clear Vietnamese error message.
- Zero regression across all existing 32 test suites.
- Admin UI must follow existing K-Beauty aesthetic (`var(--color-primary)`, `var(--radius-md)`, `btn-primary`, `btn-outline`).

## Review Focus
- Attempting to access `/admin/login` with customer credentials properly displays an access-denied error.
- Clicking "Đăng xuất" clears the cookie and redirects to `/admin/login`.
- 1-click Demo Login buttons populate and auto-submit credentials for rapid testing.
- Passwords are never returned in any API responses (`GET /api/auth/me`, `GET /api/admin/users`).
- Existing unauthenticated tests continue to pass without breaks.

---

### Task 1: Prisma Schema & Seed for User and Role

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Create: `tests/db-user-role.test.ts`

- [ ] **Step 1: Write the failing test for User and Role queries**
  Create `tests/db-user-role.test.ts` testing `prisma.role.findMany()` and `prisma.user.findMany()` with relations.
- [ ] **Step 2: Run test to confirm it fails**
  Run `npx vitest run tests/db-user-role.test.ts`.
- [ ] **Step 3: Update `prisma/schema.prisma` with `Role` and `User` models**
  Add `Role` model (`name`, `displayName`, `description`, `permissions`) and `User` model (`email`, `password`, `name`, `avatar`, `phone`, `roleId`, `roleName`, `isActive`).
- [ ] **Step 4: Push schema changes to SQLite and generate Prisma client**
  Run `npx prisma db push`.
- [ ] **Step 5: Update `prisma/seed.ts` with default roles and hashed demo accounts**
  Seed roles `ADMIN`, `STAFF`, `CUSTOMER`, and users `admin@glowseoul.vn` (admin123), `staff@glowseoul.vn` (staff123), `customer@glowseoul.vn` (customer123). Run `npm run seed`.
- [ ] **Step 6: Run tests and verify they pass**
  Run `npx vitest run tests/db-user-role.test.ts`.

---

### Task 2: Authentication Library & API Endpoints

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`
- Create: `src/app/api/admin/users/route.ts`
- Create: `tests/auth-rbac-api.test.ts`

- [ ] **Step 1: Write tests for authentication and RBAC APIs**
  Create `tests/auth-rbac-api.test.ts` testing password verification, session token generation, `POST /api/auth/login` (admin vs customer portal check), `GET /api/auth/me`, and `POST /api/auth/logout`.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run tests/auth-rbac-api.test.ts`.
- [ ] **Step 3: Implement `src/lib/auth.ts`**
  Implement `hashPassword`, `verifyPassword`, `createSessionToken`, `verifySessionToken`, `getSessionUser`.
- [ ] **Step 4: Implement `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`**
  Implement handlers setting and clearing HttpOnly cookies.
- [ ] **Step 5: Implement `/api/admin/users`**
  Implement GET (list users, sanitize passwords) and PUT (update role, toggle active status).
- [ ] **Step 6: Run tests and verify they pass**
  Run `npx vitest run tests/auth-rbac-api.test.ts`.

---

### Task 3: React AuthContext & Global Provider

**Files:**
- Create: `src/context/AuthContext.tsx`
- Modify: `src/app/layout.tsx`
- Create: `tests/auth-context.test.ts`

- [ ] **Step 1: Write test for AuthContext structure and exports**
  Create `tests/auth-context.test.ts` checking `useAuth` hook and `AuthProvider`.
- [ ] **Step 2: Implement `src/context/AuthContext.tsx`**
  Implement state (`user`, `role`, `loading`), `login`, `logout`, and initial `/api/auth/me` check.
- [ ] **Step 3: Wrap root layout in `src/app/layout.tsx` with `AuthProvider`**
  Integrate `AuthProvider` alongside existing `ToastProvider` and `CartProvider`.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run tests/auth-context.test.ts`.

---

### Task 4: Admin Login Screen (`/admin/login`)

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `tests/admin-login-screen.test.ts`

- [ ] **Step 1: Write test for Admin Login UI**
  Create `tests/admin-login-screen.test.ts` verifying form fields, 1-click demo buttons ("Admin", "Staff"), submit handler, and back to store link.
- [ ] **Step 2: Implement `src/app/admin/login/page.tsx`**
  Build K-Beauty styled card with email/password inputs, quick demo filler buttons, error banner, and redirect to `/admin` upon success.
- [ ] **Step 3: Run test and verify it passes**
  Run `npx vitest run tests/admin-login-screen.test.ts`.

---

### Task 5: Storefront Customer Login Screen (`/login`)

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `tests/customer-login-screen.test.ts`

- [ ] **Step 1: Write test for Customer Login UI**
  Create `tests/customer-login-screen.test.ts` verifying storefront login page structure.
- [ ] **Step 2: Implement `src/app/login/page.tsx`**
  Build customer login page matching storefront aesthetics with quick demo button and link back to home.
- [ ] **Step 3: Run test and verify it passes**
  Run `npx vitest run tests/customer-login-screen.test.ts`.

---

### Task 6: Admin Header Profile/Logout, Sidebar User Tab & User Management

**Files:**
- Modify: `src/components/admin/AdminHeader.tsx`
- Modify: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/UserManager.tsx`
- Modify: `src/app/admin/page.tsx`
- Create: `tests/admin-user-management-ui.test.ts`

- [ ] **Step 1: Write test for User Manager and Header Logout**
  Create `tests/admin-user-management-ui.test.ts` checking User Manager table, role badge, header logout button, and sidebar `users` tab.
- [ ] **Step 2: Update `AdminHeader.tsx`**
  Add current user avatar, name, role badge (`ADMIN` / `STAFF`), and "Đăng xuất" button calling `logout()`.
- [ ] **Step 3: Update `AdminSidebar.tsx`**
  Add `users` tab ("Tài khoản & Phân quyền") with `Users` icon and count badge.
- [ ] **Step 4: Create `UserManager.tsx`**
  Build standardized table with search, role filter (`CustomSelect`), role switcher dropdown, active toggle, and user count.
- [ ] **Step 5: Update `src/app/admin/page.tsx`**
  Integrate `users` tab with `UserManager`, load user counts, and add client-side route guard redirecting unauthenticated users to `/admin/login`.
- [ ] **Step 6: Run test and verify it passes**
  Run `npx vitest run tests/admin-user-management-ui.test.ts`.

---

### Task 7: Full System Verification & Regression Testing

**Files:**
- Verify all test suites

- [ ] **Step 1: Run entire vitest test suite across repository**
  Run `npm test` and ensure all test files pass (32 existing + new auth suites).
- [ ] **Step 2: Verify dev server endpoints and page response**
  Test `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/login` and `http://localhost:3000/login`.
