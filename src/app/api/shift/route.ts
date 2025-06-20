import { NextRequest, NextResponse } from 'next/server';
import Shift from '@/backend/models/Shift';

export async function GET(req: NextRequest) {
  try {
    const shifts = await new Shift().getAllShift();

    return NextResponse.json({
      message: 'Lấy danh sách ca làm việc thành công.',
      data: shifts,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi lấy danh sách ca làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}