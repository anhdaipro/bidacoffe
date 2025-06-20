
import { authenticateJWT } from '@/midleware';
import Product from '@backend/models/Product';

import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from 'sequelize';

 // Quan trọng nếu dùng Sequelize

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, categoryId, status, image, public_image } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id
    const product = new Product({
      name,
      price,
      categoryId,
      status,
      ...(public_image && { public_image }),
      ...(image && { image }),
      uidLogin,
    });

    product.validateCreate(); // Nếu bạn có hàm này trong model

    await product.save();

    await product.deleteCache(); // Nếu có hàm xóa cache

    return NextResponse.json(
      {
        message: 'Tạo sản phẩm thành công',
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Lỗi khi tạo sản phẩm:', error);
    return NextResponse.json(
      { message: 'Lỗi không xác định', error: error.message || 'Unknown' },
      { status: 500 }
    );
  }
}
