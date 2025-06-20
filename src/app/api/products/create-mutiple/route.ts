import { NextRequest, NextResponse } from 'next/server';
import Product from '@backend/models/Product';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { products } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: 'Không có sản phẩm nào để tạo' },
        { status: 400 }
      );
    }

    await Product.bulkCreate(products);

    // Xóa cache liên quan
    const product = new Product();
    await product.deleteCache();

    return NextResponse.json(
      { message: 'Tạo mới thành công' },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error creating products', error: errorMessage },
      { status: 500 }
    );
  }
}