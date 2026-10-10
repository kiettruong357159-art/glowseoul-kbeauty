import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, shippingAddress, note, paymentMethod, items, couponCode } = body;

    if (!customerName || !phone || !shippingAddress || !items || !items.length) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin nhận hàng và sản phẩm' },
        { status: 400 }
      );
    }

    // Batch product lookup to eliminate N+1 queries
    const itemIds: string[] = Array.from(new Set(items.map((item: any) => String(item.id)).filter(Boolean)));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: itemIds } },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Calculate subtotal from database prices for security
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.id);
      const price = dbProduct ? dbProduct.price : item.price;
      subtotal += price * item.quantity;

      orderItemsData.push({
        productId: item.id,
        name: dbProduct ? dbProduct.name : item.name,
        price,
        quantity: item.quantity,
        image: item.image,
      });
    }

    // Apply voucher discount if valid
    let discount = 0;
    if (couponCode) {
      const cleanCoupon = couponCode.toUpperCase().trim();
      const dbCoupon = await prisma.coupon.findUnique({ where: { code: cleanCoupon } });
      if (dbCoupon && dbCoupon.isActive && subtotal >= dbCoupon.minOrderAmount) {
        discount = Math.round(subtotal * (dbCoupon.discountPercent / 100));
        if (dbCoupon.maxDiscount && discount > dbCoupon.maxDiscount) {
          discount = dbCoupon.maxDiscount;
        }
      } else if (cleanCoupon === 'KBEAUTY10') {
        discount = Math.round(subtotal * 0.1);
      }
    }

    // Calculate shipping
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const totalAmount = subtotal - discount + shippingFee;

    // Generate readable order code e.g. ORD-7492
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomSuffix}`;

    // Execute atomic transaction for order creation and flash sale updates
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          id: orderId,
          customerName,
          phone,
          email: email || '',
          shippingAddress,
          note: note || '',
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
          orderStatus: 'confirmed',
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Cập nhật tăng số lượng đã bán (soldQuantity) cho các sản phẩm nằm trong Flash Sale đang active
      const now = new Date();
      const validFlashSaleUpdates = items.filter((item: any) => Boolean(item.id));
      if (validFlashSaleUpdates.length > 0) {
        await Promise.all(
          validFlashSaleUpdates.map((item: any) =>
            tx.flashSaleItem.updateMany({
              where: {
                productId: item.id,
                flashSale: {
                  isActive: true,
                  startTime: { lte: now },
                  endTime: { gt: now },
                },
              },
              data: {
                soldQuantity: {
                  increment: Number(item.quantity) || 1,
                },
              },
            })
          )
        );
      }

      return createdOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Không thể tạo đơn hàng, vui lòng thử lại' }, { status: 500 });
  }
}
