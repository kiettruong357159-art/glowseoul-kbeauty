import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database Review and Wishlist Models', () => {
  it('queries seeded reviews and associates with products', async () => {
    const reviews = await prisma.review.findMany({
      include: { product: true },
    });
    expect(reviews.length).toBeGreaterThanOrEqual(5);

    const first = reviews[0];
    expect(first.rating).toBeGreaterThanOrEqual(1);
    expect(first.rating).toBeLessThanOrEqual(5);
    expect(first.comment).toBeTruthy();
    expect(first.authorName).toBeTruthy();
    expect(first.product).toBeDefined();
    expect(first.product.name).toBeTruthy();
  });

  it('creates and deletes a wishlist item for a user', async () => {
    const user = await prisma.user.findFirst();
    const product = await prisma.product.findFirst();
    expect(user).toBeDefined();
    expect(product).toBeDefined();

    if (user && product) {
      // Create wishlist item
      const item = await prisma.wishlist.upsert({
        where: {
          userId_productId: {
            userId: user.id,
            productId: product.id,
          },
        },
        create: {
          userId: user.id,
          productId: product.id,
        },
        update: {},
      });
      expect(item.userId).toBe(user.id);
      expect(item.productId).toBe(product.id);

      // Clean up
      await prisma.wishlist.delete({
        where: { id: item.id },
      });
    }
  });
});
