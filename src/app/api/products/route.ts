
import Product from '@/backend/models/Product';
import { authenticateJWT } from '@/midleware';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 20);
  const name = searchParams.get('name') || '';
  const status = searchParams.get('status') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  try {
    const product = new Product()
    const user = await authenticateJWT()
    if (user instanceof NextResponse) return user;
    product.rUidLogin = user
    const result = await product.getAllProducts({
      page,
      limit,
      name,
      status,
      categoryId,
      dateFrom,
      dateTo,
    });
    return NextResponse.json({message: 'Products retrieved successfully',
        ...result});
  } catch (error: any) {
    console.error('Lỗi trong API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}