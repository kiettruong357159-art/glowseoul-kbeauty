import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const brand = searchParams.get('brand')?.trim() || '';

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { brand: { contains: q } },
        { category: { contains: q } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      brand,
      price,
      originalPrice,
      category,
      skinType,
      ingredients,
      description,
      usage,
      images,
      stock,
      isBestSeller,
      isNew,
    } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Tên sản phẩm không được để trống' }, { status: 400 });
    }
    if (!brand || typeof brand !== 'string' || !brand.trim()) {
      return NextResponse.json({ error: 'Thương hiệu không được để trống' }, { status: 400 });
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'Danh mục không được để trống' }, { status: 400 });
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json({ error: 'Giá sản phẩm phải là số dương lớn hơn 0' }, { status: 400 });
    }

    // Process images into JSON array string
    let processedImages = '[]';
    if (Array.isArray(images)) {
      processedImages = JSON.stringify(images);
    } else if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        processedImages = Array.isArray(parsed) ? images : JSON.stringify([images]);
      } catch {
        processedImages = JSON.stringify([images]);
      }
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        brand: brand.trim(),
        price: Math.round(numPrice),
        originalPrice: originalPrice ? Math.round(Number(originalPrice)) : null,
        category: category.trim(),
        skinType: skinType?.trim() || 'all',
        ingredients: ingredients?.trim() || 'Thành phần an toàn chuẩn Hàn',
        description: description?.trim() || name.trim(),
        usage: usage?.trim() || 'Sử dụng hàng ngày trong chu trình skincare.',
        images: processedImages,
        stock: typeof stock === 'number' && stock >= 0 ? stock : 50,
        isBestSeller: Boolean(isBestSeller),
        isNew: Boolean(isNew),
        rating: 4.8,
        reviewCount: 0,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Không thể tạo sản phẩm mới' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã ID sản phẩm cần cập nhật' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (updates.name !== undefined) dataToUpdate.name = updates.name.trim();
    if (updates.brand !== undefined) dataToUpdate.brand = updates.brand.trim();
    if (updates.price !== undefined) dataToUpdate.price = Math.round(Number(updates.price));
    if (updates.originalPrice !== undefined) {
      dataToUpdate.originalPrice = updates.originalPrice ? Math.round(Number(updates.originalPrice)) : null;
    }
    if (updates.category !== undefined) dataToUpdate.category = updates.category.trim();
    if (updates.skinType !== undefined) dataToUpdate.skinType = updates.skinType.trim();
    if (updates.ingredients !== undefined) dataToUpdate.ingredients = updates.ingredients.trim();
    if (updates.description !== undefined) dataToUpdate.description = updates.description.trim();
    if (updates.usage !== undefined) dataToUpdate.usage = updates.usage.trim();
    if (updates.stock !== undefined) dataToUpdate.stock = Math.max(0, Math.round(Number(updates.stock)));
    if (updates.isBestSeller !== undefined) dataToUpdate.isBestSeller = Boolean(updates.isBestSeller);
    if (updates.isNew !== undefined) dataToUpdate.isNew = Boolean(updates.isNew);

    if (updates.images !== undefined) {
      if (Array.isArray(updates.images)) {
        dataToUpdate.images = JSON.stringify(updates.images);
      } else if (typeof updates.images === 'string') {
        try {
          const parsed = JSON.parse(updates.images);
          dataToUpdate.images = Array.isArray(parsed) ? updates.images : JSON.stringify([updates.images]);
        } catch {
          dataToUpdate.images = JSON.stringify([updates.images]);
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật sản phẩm' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã ID sản phẩm cần xoá' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Không thể xoá sản phẩm' },
      { status: 500 }
    );
  }
}
