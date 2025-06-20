import { NextRequest, NextResponse } from 'next/server';
import Product from '@/backend/models/Product';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const json = await params
    const productId = json.id
    const product = await Product.findByPk(productId);

    if (!product) {
      return NextResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product retrieved successfully', data: product },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error retrieving product', error: errorMessage },
      { status: 500 }
    );
  }
}