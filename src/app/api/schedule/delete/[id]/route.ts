import { NextRequest, NextResponse } from 'next/server';
import Schedule from '@/backend/models/Schedule';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const schedule = await Schedule.findByPk(param.id);

    if (!schedule) {
      return NextResponse.json({ message: 'Không tìm thấy lịch làm việc.' }, { status: 404 });
    }

    await schedule.destroy();

    return NextResponse.json({ message: 'Xóa lịch làm việc thành công.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi xóa lịch làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}