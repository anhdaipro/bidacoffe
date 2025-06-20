import { NextRequest, NextResponse } from 'next/server';
import Product from '@backend/models/Product';

export async function GET(req: NextRequest) {
  try {
    // Gọi hàm `getInventory` từ model `Product`
    const data = await new Product().getInventory(false);

    return NextResponse.json({
      message: 'Tồn kho',
      data: data,
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return NextResponse.json({
      message: 'Lỗi khi tạo báo cáo tồn kho.',
      error: errorMessage,
    }, { status: 500 });
  }
}