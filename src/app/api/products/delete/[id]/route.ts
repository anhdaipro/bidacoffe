import { NextRequest, NextResponse } from 'next/server';
import Product from '@/backend/models/Product';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const productId = param.id;
    const user = await authenticateJWT()
    if (user instanceof NextResponse) return user;
    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    await product.destroy();
      // Xóa cache liên quan
    await product.deleteCache()
    return NextResponse.json(
      { message: 'Product deleted successfully', data: product },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error delete product', error: errorMessage },
      { status: 500 }
    );
  }
}