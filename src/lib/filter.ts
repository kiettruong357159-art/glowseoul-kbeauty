export interface FilterParams {
  category?: string;
  skinType?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  sort?: string;
  isBestSeller?: string;
  isNew?: string;
}

export function buildProductFilterQuery(params: FilterParams) {
  const where: any = {};

  if (params.category) {
    where.category = params.category;
  }

  if (params.skinType) {
    where.skinType = params.skinType;
  }

  if (params.brand) {
    where.brand = params.brand;
  }

  if (params.isBestSeller === 'true') {
    where.isBestSeller = true;
  }

  if (params.isNew === 'true') {
    where.isNew = true;
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseInt(params.minPrice, 10);
    if (params.maxPrice) where.price.lte = parseInt(params.maxPrice, 10);
  }

  if (params.q && params.q.trim()) {
    const searchTerm = params.q.trim();
    where.OR = [
      { name: { contains: searchTerm } },
      { ingredients: { contains: searchTerm } },
      { brand: { contains: searchTerm } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (params.sort === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (params.sort === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (params.sort === 'rating_desc') {
    orderBy = { rating: 'desc' };
  }

  return { where, orderBy };
}
