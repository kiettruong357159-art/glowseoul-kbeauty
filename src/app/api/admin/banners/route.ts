import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách banner' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const currentUser = await getCurrentUserFromCookie(cookieHeader);
    if (currentUser) {
      const isAllowed =
        currentUser.role === 'ADMIN' ||
        currentUser.permissions.includes('*') ||
        currentUser.permissions.includes('banners:*') ||
        currentUser.permissions.includes('banners:manage');
      if (!isAllowed) {
        return NextResponse.json(
          { error: 'Bạn không có quyền cập nhật banner' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { id, title, subtitle, badgeText, linkUrl, imageUrl, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã ID banner cần cập nhật' }, { status: 400 });
    }

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy banner' }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title.trim();
    if (subtitle !== undefined) dataToUpdate.subtitle = subtitle.trim();
    if (badgeText !== undefined) dataToUpdate.badgeText = badgeText.trim();
    if (linkUrl !== undefined) dataToUpdate.linkUrl = linkUrl.trim();
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl.trim();
    if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);

    const banner = await prisma.banner.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Không thể cập nhật banner' }, { status: 500 });
  }
}
