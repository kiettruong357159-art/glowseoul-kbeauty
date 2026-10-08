# Implementation Plan: Project Rules, Performance Indexing & RBAC Hardening

- **Date**: 2026-10-08
- **Status**: Completed & Verified
- **Spec**: `docs/superpowers/specs/2026-10-08-project-rules-performance-rbac-alignment.md`

---

## Proposed Changes

### 1. Database Indexing
- **File**: `prisma/schema.prisma`
- **Changes**: Add 14 `@@index` annotations across `Product`, `Order`, `OrderItem`, `Review`, `Coupon`, `User`.
- **Database Migration**: Executed `add_performance_indexes_for_large_datasets` on Supabase PostgreSQL (`oyzbmwwyrwfxjhzmbhkh`) using Supabase MCP.

### 2. Backend Scalability & Pagination
- **Files**: 
  - `src/app/api/admin/products/route.ts`
  - `src/app/api/admin/orders/route.ts`
  - `src/app/api/admin/coupons/route.ts`
- **Changes**: Introduce `page` and `pageSize` support with Prisma `skip` and `take`, avoiding full table memory ingestion.

### 3. API RBAC Enforcement
- **Files**:
  - `src/app/api/admin/products/route.ts`
  - `src/app/api/admin/orders/route.ts`
  - `src/app/api/admin/coupons/route.ts`
  - `src/app/api/admin/banners/route.ts`
- **Changes**: Validate `getCurrentUserFromCookie` for non-read operations, responding with `403 Forbidden` if permissions are insufficient.

### 4. UI Permission Alignment
- **Files**:
  - `src/components/admin/AdminSidebar.tsx`: Filter `users` tab for non-admin accounts.
  - `src/components/admin/ProductListTable.tsx`: Add `canManage` prop to conditionally hide the add button and disable write actions.
  - `src/app/admin/page.tsx`: Pass computed `canManage` prop based on current authenticated session.

### 5. Documentation & Task Tracking
- **Files**:
  - `PROJECT_RULES_TEMPLATE.md`: Reusable rule template containing 4 Core Engineering Mindsets.
  - `task.md`: Checklist tracking all dev & verification milestones.
  - `docs/superpowers/specs/2026-10-08-project-rules-performance-rbac-alignment.md`: 5-part Tech Spec.

---

## Verification Plan
1. `pg_indexes` query via Supabase MCP: Confirm 14 indexes active.
2. TypeScript static verification: Zero compilation errors in `src/`.
3. Backward compatibility: Ensure pagination falls back safely if parameters are omitted.
