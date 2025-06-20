import { NextRequest, NextResponse } from 'next/server';
import Schedule from '@backend/models/Schedule';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { ROLE_ADMIN } from '@/form/user';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;

    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người đăng nhập' }, { status: 400 });
    }

    const { id: userId, roleId } = user;
    const { records, workDate } = body;

    if (!dayjs().isBefore(dayjs(workDate), 'day') && roleId !== ROLE_ADMIN) {
      return NextResponse.json({ message: 'Ngày làm việc lớn hơn ngày hiện tại.' }, { status: 400 });
    }

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ message: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const aInsert = [];
    const aEmployeeId = new Set();

    for (const schedule of records) {
      if (!schedule.shiftId) continue;

      aEmployeeId.add(schedule.employeeId);
      aInsert.push({
        ...schedule,
        createdBy: userId,
        createdAtBigint: dayjs().unix(),
        workDate,
        workDateBigint: dayjs(workDate).unix(),
      });
    }

    await Schedule.destroy({
      where: {
        workDate,
        employeeId: { [Op.in]: Array.from(aEmployeeId) },
      },
    });

    const createdSchedules = await Schedule.bulkCreate(aInsert);

    return NextResponse.json({
      message: 'Tạo lịch làm việc thành công.',
      data: createdSchedules,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi tạo lịch làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}