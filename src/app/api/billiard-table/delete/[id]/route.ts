import { NextRequest, NextResponse } from 'next/server';
import BilliardTable from '@/backend/models/BilliardTable';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const table = await BilliardTable.findByPk(param.id);
    if (!table) {
      return NextResponse.json({ message: 'Không tìm thấy bàn billiard' }, { status: 404 });
    }
    await table.destroy();
    return NextResponse.json({ message: 'Xóa bàn billiard thành công' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi xóa bàn billiard' }, { status: 500 });
  }
}