import { describe, it, expect } from 'vitest';
import { GET as getCategories, POST as postCategory, DELETE as deleteCategory, PUT as putCategory } from '../src/app/api/admin/categories/route';
import { GET as getBrands, POST as postBrand, DELETE as deleteBrand, PUT as putBrand } from '../src/app/api/admin/brands/route';
import { NextRequest } from 'next/server';

describe('Admin Taxonomies API (Categories & Brands)', () => {
  it('GET /api/admin/categories returns category list', async () => {
    const res = await getCategories();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories.length).toBeGreaterThan(0);
  });

  it('POST /api/admin/categories rejects missing name or slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await postCategory(req);
    expect(res.status).toBe(400);
  });

  it('performs category lifecycle: create, duplicate check, and delete', async () => {
    const uniqueSlug = `test-cat-${Date.now()}`;
    // 1. Create
    const createReq = new NextRequest('http://localhost:3000/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Mặt Nạ Giấy Dưỡng Ẩm',
        slug: uniqueSlug,
        description: 'Mặt nạ chuyên sâu',
      }),
    });
    const createRes = await postCategory(createReq);
    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.category.slug).toBe(uniqueSlug);

    // 2. Duplicate check
    const dupCatReq = new NextRequest('http://localhost:3000/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Mặt Nạ Giấy Dưỡng Ẩm',
        slug: uniqueSlug,
      }),
    });
    const dupRes = await postCategory(dupCatReq);
    expect(dupRes.status).toBe(409);

    // 3. Delete
    const delReq = new NextRequest(`http://localhost:3000/api/admin/categories?id=${created.category.id}`);
    const delRes = await deleteCategory(delReq);
    expect(delRes.status).toBe(200);
  });

  it('DELETE /api/admin/categories returns 404 for non-existent category', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/categories?id=non_existent_cat_999');
    const res = await deleteCategory(req);
    expect(res.status).toBe(404);
  });

  it('GET /api/admin/brands returns brand list', async () => {
    const res = await getBrands();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.brands)).toBe(true);
    expect(data.brands.length).toBeGreaterThan(0);
  });

  it('POST /api/admin/brands rejects missing name or slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await postBrand(req);
    expect(res.status).toBe(400);
  });

  it('performs brand lifecycle: create, duplicate check, and delete', async () => {
    const uniqueSlug = `test-brand-${Date.now()}`;
    const uniqueName = `Brand Test ${Date.now()}`;

    // 1. Create
    const createReq = new NextRequest('http://localhost:3000/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify({
        name: uniqueName,
        slug: uniqueSlug,
        tag: 'Dưỡng da hữu cơ',
        origin: 'Hàn Quốc',
      }),
    });
    const createRes = await postBrand(createReq);
    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.brand.slug).toBe(uniqueSlug);

    // 2. Duplicate check
    const dupBrandReq = new NextRequest('http://localhost:3000/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify({
        name: uniqueName,
        slug: uniqueSlug,
      }),
    });
    const dupRes = await postBrand(dupBrandReq);
    expect(dupRes.status).toBe(409);

    // 3. Delete
    const delReq = new NextRequest(`http://localhost:3000/api/admin/brands?id=${created.brand.id}`);
    const delRes = await deleteBrand(delReq);
    expect(delRes.status).toBe(200);
  });

  it('DELETE /api/admin/brands returns 404 for non-existent brand', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/brands?id=non_existent_brand_999');
    const res = await deleteBrand(req);
    expect(res.status).toBe(404);
  });

  it('PUT /api/admin/categories updates category details', async () => {
    const uniqueSlug = `test-cat-edit-${Date.now()}`;
    const createReq = new NextRequest('http://localhost:3000/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name: 'Cat Pre Edit', slug: uniqueSlug }),
    });
    const createRes = await postCategory(createReq);
    const created = await createRes.json();

    const updateReq = new NextRequest('http://localhost:3000/api/admin/categories', {
      method: 'PUT',
      body: JSON.stringify({
        id: created.category.id,
        name: 'Cat Post Edit',
        slug: `${uniqueSlug}-mod`,
        description: 'Mô tả sau khi sửa',
      }),
    });
    const updateRes = await putCategory(updateReq);
    expect(updateRes.status).toBe(200);
    const updated = await updateRes.json();
    expect(updated.category.name).toBe('Cat Post Edit');
    expect(updated.category.description).toBe('Mô tả sau khi sửa');

    // Clean up
    await deleteCategory(new NextRequest(`http://localhost:3000/api/admin/categories?id=${created.category.id}`));
  });

  it('PUT /api/admin/brands updates brand details', async () => {
    const uniqueSlug = `test-brand-edit-${Date.now()}`;
    const createReq = new NextRequest('http://localhost:3000/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify({ name: 'Brand Pre Edit', slug: uniqueSlug, tag: 'Tag 1' }),
    });
    const createRes = await postBrand(createReq);
    const created = await createRes.json();

    const updateReq = new NextRequest('http://localhost:3000/api/admin/brands', {
      method: 'PUT',
      body: JSON.stringify({
        id: created.brand.id,
        name: 'Brand Post Edit',
        slug: `${uniqueSlug}-mod`,
        tag: 'Tag 2 Updated',
        origin: 'Hàn Quốc',
      }),
    });
    const updateRes = await putBrand(updateReq);
    expect(updateRes.status).toBe(200);
    const updated = await updateRes.json();
    expect(updated.brand.name).toBe('Brand Post Edit');
    expect(updated.brand.tag).toBe('Tag 2 Updated');

    // Clean up
    await deleteBrand(new NextRequest(`http://localhost:3000/api/admin/brands?id=${created.brand.id}`));
  });
});

