import { NextRequest, NextResponse } from 'next/server';
import Product from '@/backend/models/Product';
import { ChangeLog } from '@/types/Model';
import { authenticateJWT } from '@/midleware';
import LogUpdate from '@/backend/models/LogUpdate';
import { TYPE_PRODUCT } from '@/backend/models/LogUpdate';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const productId = param.id;
    const body = await req.json();
    const {status} = body;
    const user = await authenticateJWT()
    if (user instanceof NextResponse) return user;
    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    await product.update({
        status
      });
      
    // Xóa cache liên quan
    // const product = new Product()
    await product.deleteCache()
    return NextResponse.json(
      { message: 'Update thành công', data: product },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error updating product', error: errorMessage },
      { status: 500 }
    );
  }
}