import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const wishlists = await prisma.wishlist.findMany({
      where: { userId: session.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const products = wishlists.map((w) => w.product);

    return NextResponse.json({
      wishlists,
      products,
      productIds: wishlists.map((w) => w.productId),
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách yêu thích' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Thiếu productId' }, { status: 400 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId,
        },
      },
    });

    if (existing) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        favorited: false,
        message: 'Đã xóa khỏi danh sách yêu thích',
        productId,
      });
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId: session.id,
          productId,
        },
      });
      return NextResponse.json({
        favorited: true,
        message: 'Đã thêm vào danh sách yêu thích',
        productId,
      });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật yêu thích' }, { status: 500 });
  }
}
