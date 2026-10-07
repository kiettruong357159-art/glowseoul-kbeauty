import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, r.rating));
      counts[star] = (counts[star] || 0) + 1;
      totalScore += star;
    });

    const average = reviews.length > 0 ? Number((totalScore / reviews.length).toFixed(1)) : 5.0;

    return NextResponse.json({
      reviews,
      stats: {
        total: reviews.length,
        average,
        rating: average,
        counts,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Không thể tải đánh giá sản phẩm' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await request.json();
    const { rating, comment, title, authorName, skinType } = body;

    if (!rating || !comment || !authorName) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ số sao đánh giá, tên của bạn và nhận xét' },
        { status: 400 }
      );
    }

    const user = await getCurrentUserFromCookie();

    const starRating = Math.min(5, Math.max(1, parseInt(rating, 10)));

    const newReview = await prisma.review.create({
      data: {
        productId,
        rating: starRating,
        title: title?.trim() || null,
        comment: comment.trim(),
        authorName: authorName.trim(),
        authorEmail: user?.email || null,
        skinType: skinType || 'all',
        isVerifiedPurchase: true,
        userId: user?.id || null,
      },
    });

    // Recompute product average rating & review count
    const allProductReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalStars = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((totalStars / allProductReviews.length).toFixed(1));

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avg,
        reviewCount: allProductReviews.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã gửi đánh giá sản phẩm!',
      review: newReview,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Không thể gửi đánh giá, vui lòng thử lại' }, { status: 500 });
  }
}
