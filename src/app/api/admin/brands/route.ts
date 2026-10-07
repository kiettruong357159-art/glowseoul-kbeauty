import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách thương hiệu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, tag, origin, logo } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Tên thương hiệu không được để trống' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return NextResponse.json({ error: 'Đường dẫn (slug) không được để trống' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const existingSlug = await prisma.brand.findUnique({
      where: { slug: cleanSlug },
    });
    if (existingSlug) {
      return NextResponse.json({ error: 'Đường dẫn thương hiệu đã tồn tại' }, { status: 409 });
    }

    const existingName = await prisma.brand.findUnique({
      where: { name: name.trim() },
    });
    if (existingName) {
      return NextResponse.json({ error: 'Tên thương hiệu đã tồn tại' }, { status: 409 });
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        tag: tag?.trim() || null,
        origin: origin?.trim() || 'Hàn Quốc',
        logo: logo?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Không thể tạo thương hiệu mới' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã ID thương hiệu' }, { status: 400 });
    }

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy thương hiệu' }, { status: 404 });
    }

    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Không thể xoá thương hiệu' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, tag, origin, logo } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Thiếu mã ID thương hiệu' }, { status: 400 });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Tên thương hiệu không được để trống' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return NextResponse.json({ error: 'Đường dẫn (slug) không được để trống' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    // Check duplicate slug on other brands
    const existingSlug = await prisma.brand.findFirst({
      where: {
        slug: cleanSlug,
        NOT: { id },
      },
    });
    if (existingSlug) {
      return NextResponse.json({ error: 'Đường dẫn thương hiệu đã tồn tại' }, { status: 409 });
    }

    // Check duplicate name on other brands
    const existingName = await prisma.brand.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    });
    if (existingName) {
      return NextResponse.json({ error: 'Tên thương hiệu đã tồn tại' }, { status: 409 });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: cleanSlug,
        tag: tag?.trim() || null,
        origin: origin?.trim() || 'Hàn Quốc',
        logo: logo?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Không thể cập nhật thương hiệu' }, { status: 500 });
  }
}

