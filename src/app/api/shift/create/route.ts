import { NextRequest, NextResponse } from 'next/server';
import Shift from '@/backend/models/Shift';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, startTime, endTime, status, numEmployee, salaryHour } = body;

    const newShift = await Shift.create({
      name,
      description,
      startTime,
      endTime,
      status,
      numEmployee,
      salaryHour,
    });

    await newShift.deleteCache(); // Xóa cache sau khi tạo mới

    return NextResponse.json({
      message: 'Tạo ca làm việc thành công.',
      data: newShift,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi tạo ca làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}