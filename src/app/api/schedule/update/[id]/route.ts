import { NextRequest, NextResponse } from 'next/server';
import Schedule from '@/backend/models/Schedule';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const schedules = body.schedules;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json({ message: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const updatedSchedules = [];
    for (const schedule of schedules) {
      const existingSchedule = await Schedule.findByPk(schedule.id);
      if (existingSchedule) {
        await existingSchedule.update(schedule);
        updatedSchedules.push(existingSchedule);
      }
    }

    return NextResponse.json({
      message: 'Cập nhật lịch làm việc thành công.',
      data: updatedSchedules,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi cập nhật lịch làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}