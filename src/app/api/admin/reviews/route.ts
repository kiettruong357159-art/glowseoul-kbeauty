import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const currentUser = await getCurrentUserFromCookie(cookieHeader);

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF')) {
      return NextResponse.json(
        { error: 'Chỉ Quản trị viên hoặc Nhân viên mới có quyền xem quản lý đánh giá' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase().trim() || '';
    const ratingParam = searchParams.get('rating');

    const where: any = {};
    if (ratingParam) {
      where.rating = parseInt(ratingParam, 10);
    }
    if (q) {
      where.OR = [
        { authorName: { contains: q } },
        { comment: { contains: q } },
        { product: { name: { contains: q } } },
      ];
    }

    const [rawReviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              brand: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);

    const reviews = rawReviews.map((r) => {
      let image = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
      try {
        const parsed = JSON.parse(r.product.images);
        if (parsed[0]) image = parsed[0];
      } catch {}
      return {
        ...r,
        product: {
          id: r.product.id,
          name: r.product.name,
          brand: r.product.brand,
          image,
        },
      };
    });

    return NextResponse.json({ reviews, total });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách đánh giá' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const currentUser = await getCurrentUserFromCookie(cookieHeader);

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF')) {
      return NextResponse.json(
        { error: 'Chỉ Quản trị viên hoặc Nhân viên mới có quyền xóa đánh giá' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã ID đánh giá' }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy đánh giá' }, { status: 404 });
    }

    const productId = existing.productId;

    await prisma.review.delete({
      where: { id },
    });

    // Recompute product rating & reviewCount
    const remainingReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const newReviewCount = remainingReviews.length;
    const newRating = newReviewCount > 0
      ? Number((remainingReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount).toFixed(1))
      : 5.0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount: newReviewCount,
        rating: newRating,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa đánh giá thành công',
      deletedId: id,
      newRating,
      newReviewCount,
    });
  } catch (error) {
    console.error('Error deleting admin review:', error);
    return NextResponse.json({ error: 'Lỗi xóa đánh giá' }, { status: 500 });
  }
}
