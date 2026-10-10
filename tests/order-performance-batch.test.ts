import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { POST } from '@/app/api/orders/route';

describe('Order Creation API Performance & Batching', () => {
  let product1: any;
  let product2: any;
  let createdOrderId = '';

  beforeAll(async () => {
    // Ensure two test products exist
    product1 = await prisma.product.create({
      data: {
        name: 'Serum Test Perf 1',
        brand: 'GlowSeoul Lab',
        price: 350000,
        originalPrice: 450000,
        category: 'serum',
        skinType: 'all',
        ingredients: 'Hyaluronic Acid, B5',
        description: 'Serum cấp ẩm phục hồi chuyên sâu',
        usage: 'Dùng ngày 2 lần',
        images: JSON.stringify(['https://images.unsplash.com/photo-1620916566398-39f1143ab7be']),
        stock: 100,
      },
    });

    product2 = await prisma.product.create({
      data: {
        name: 'Kem Chống Nắng Test Perf 2',
        brand: 'GlowSeoul Lab',
        price: 250000,
        originalPrice: 300000,
        category: 'sunscreen',
        skinType: 'oily',
        ingredients: 'Zinc Oxide, Niacinamide',
        description: 'Kem chống nắng nâng tone kiềm dầu',
        usage: 'Thoa trước khi ra nắng 20 phút',
        images: JSON.stringify(['https://images.unsplash.com/photo-1556228720-195a672e8a03']),
        stock: 50,
      },
    });
  });

  afterAll(async () => {
    if (createdOrderId) {
      await prisma.orderItem.deleteMany({ where: { orderId: createdOrderId } });
      await prisma.order.deleteMany({ where: { id: createdOrderId } });
    }
    if (product1?.id) {
      await prisma.product.deleteMany({ where: { id: product1.id } });
    }
    if (product2?.id) {
      await prisma.product.deleteMany({ where: { id: product2.id } });
    }
  });

  it('POST /api/orders creates order with multiple items and verifies accurate subtotal batching', async () => {
    const payload = {
      customerName: 'Trần Văn Performance',
      phone: '0988776655',
      email: 'perf@glowseoul.vn',
      shippingAddress: '456 Lê Lợi, Quận 1, TP.HCM',
      note: 'Giao giờ hành chính',
      paymentMethod: 'COD',
      items: [
        {
          id: product1.id,
          name: product1.name,
          price: 1000, // deliberately wrong client price to verify server-side db lookup
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
        },
        {
          id: product2.id,
          name: product2.name,
          price: 1000, // deliberately wrong client price to verify server-side db lookup
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03',
        },
      ],
    };

    const req = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.orderId).toBeDefined();
    createdOrderId = data.orderId;

    // Expected subtotal = (350,000 * 2) + (250,000 * 1) = 700,000 + 250,000 = 950,000 VNĐ
    // Subtotal >= 500,000 VNĐ => Free shipping => Total = 950,000 VNĐ
    expect(data.order.totalAmount).toBe(950000);
    expect(data.order.items.length).toBe(2);

    const item1 = data.order.items.find((i: any) => i.productId === product1.id);
    expect(item1).toBeDefined();
    expect(item1.price).toBe(350000);
    expect(item1.quantity).toBe(2);

    const item2 = data.order.items.find((i: any) => i.productId === product2.id);
    expect(item2).toBeDefined();
    expect(item2.price).toBe(250000);
    expect(item2.quantity).toBe(1);
  });
});
