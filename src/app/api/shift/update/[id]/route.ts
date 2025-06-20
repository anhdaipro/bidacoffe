import { NextRequest, NextResponse } from 'next/server';
import Shift from '@/backend/models/Shift';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const body = await req.json();
    const { name, description, startTime, endTime, status, numEmployee, salaryHour } = body;

    const shift = await Shift.findByPk(param.id);

    if (!shift) {
      return NextResponse.json({
        message: 'Không tìm thấy ca làm việc.',
      }, { status: 404 });
    }

    await shift.update({
      name,
      description,
      startTime,
      endTime,
      status,
      numEmployee,
      salaryHour,
    });

    await shift.deleteCache(); // Xóa cache sau khi update

    return NextResponse.json({
      message: 'Cập nhật ca làm việc thành công.',
      data: shift,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi cập nhật ca làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}