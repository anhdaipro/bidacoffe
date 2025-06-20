import { NextRequest, NextResponse } from 'next/server';
import Product from '@backend/models/Product';
import { ChangeLog } from '@/types/Model';
import { authenticateJWT } from '@/midleware';
import LogUpdate from '@backend/models/LogUpdate';
import { TYPE_PRODUCT } from '@backend/models/LogUpdate';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const productId = param.id;
    const body = await req.json();
    const { name, price, categoryId, status, image, public_image } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id
    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    product.modelOld = product;
    // 2. So sánh thay đổi
    const updates = body;
    const changes:ChangeLog = {};
    const json = product.toJSON()
    for (const key in updates) {
      if (json[key] != updates[key]) {
        changes[key] = {
          old: json[key],
          new: updates[key],
        };
      }
    }
    Object.assign(product, { name, price, categoryId, status });
    if(image){
      
      product.image = image
      product.public_image = public_image;
      product.deleteImage()
    }
    await product.save();
    if (Object.keys(changes).length > 0) {
      await LogUpdate.create({
        userId: uidLogin,
        belongId:product.id,
        type:TYPE_PRODUCT,
        roleId: user.roleId,
        changes,
      });
    }
    // Xóa cache liên quan
    await product.deleteCache()

    return NextResponse.json(
      { message: 'Product updated successfully', data: product },
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