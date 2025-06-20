import { NextRequest, NextResponse } from 'next/server';
import Shift from '@/backend/models/Shift';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const shift = await Shift.findByPk(param.id);

    if (!shift) {
      return NextResponse.json({
        message: 'Không tìm thấy ca làm việc.',
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Lấy thông tin ca làm việc thành công.',
      data: shift,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi lấy thông tin ca làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}