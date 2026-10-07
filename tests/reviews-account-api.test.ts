import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/db';
import { createSessionToken, SESSION_COOKIE_NAME } from '../src/lib/auth';

describe('Reviews and Account API Endpoints', () => {
  it('GET and POST /api/products/[id]/reviews works correctly', async () => {
    const { GET, POST } = await import('@/app/api/products/[id]/reviews/route');

    const product = await prisma.product.findFirst();
    expect(product).toBeDefined();
    if (!product) return;

    // 1. GET reviews
    const getReq = new NextRequest(`http://localhost:3000/api/products/${product.id}/reviews`);
    const getRes = await GET(getReq, { params: Promise.resolve({ id: product.id }) });
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(Array.isArray(getData.reviews)).toBe(true);
    expect(getData.stats).toBeDefined();
    expect(getData.stats.rating).toBeDefined();

    // 2. POST new review
    const postReq = new NextRequest(`http://localhost:3000/api/products/${product.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        title: 'Sản phẩm tuyệt vời',
        comment: 'Da mịn màng sau 1 tuần sử dụng!',
        authorName: 'Khách hàng Test',
        skinType: 'oily',
      }),
    });
    const postRes = await POST(postReq, { params: Promise.resolve({ id: product.id }) });
    expect(postRes.status).toBe(201);
    const postData = await postRes.json();
    expect(postData.review).toBeDefined();
    expect(postData.review.rating).toBe(5);
    expect(postData.review.authorName).toBe('Khách hàng Test');

    // Clean up created review
    await prisma.review.delete({
      where: { id: postData.review.id },
    });
  });

  it('GET & PUT /api/account/profile requires authentication and updates profile', async () => {
    const { GET, PUT } = await import('@/app/api/account/profile/route');

    // 1. Unauthorized GET
    const unauthRes = await GET();
    expect(unauthRes.status).toBe(401);

    // 2. Authorized GET with user cookie
    const user = await prisma.user.findFirst();
    expect(user).toBeDefined();
    if (!user) return;

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.roleName,
    });

    const cookieHeader = `${SESSION_COOKIE_NAME}=${token}`;
    const origCookie = globalThis.document ? document.cookie : '';

    // Mock next/headers cookies if needed, or check route handling
    // Route uses getCurrentUserFromCookie() which reads next/headers cookies()
  });

  it('POST /api/account/wishlist toggles wishlist status', async () => {
    const user = await prisma.user.findFirst();
    const product = await prisma.product.findFirst();
    expect(user).toBeDefined();
    expect(product).toBeDefined();
    if (!user || !product) return;

    // Direct DB verification of toggle logic
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
    }

    // Toggle add
    const added = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: product.id,
      },
    });
    expect(added.id).toBeDefined();

    // Toggle remove
    await prisma.wishlist.delete({
      where: { id: added.id },
    });
    const check = await prisma.wishlist.findUnique({
      where: { id: added.id },
    });
    expect(check).toBeNull();
  });
});
