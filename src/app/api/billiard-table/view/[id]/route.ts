import { NextRequest, NextResponse } from 'next/server';
import BilliardTable from '@backend/models/BilliardTable';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const table = await BilliardTable.findByPk(param.id);

    if (!table) {
      return NextResponse.json({ message: 'Không tìm thấy bàn billiard' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product retrieved successfully', data: table }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi lấy thông tin bàn billiard' }, { status: 500 });
  }
}