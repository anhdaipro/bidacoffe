import { NextRequest, NextResponse } from 'next/server';
import TimeSheet from '@backend/models/TimeSheet';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { authenticateJWT } from '@/midleware';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const employeeId = user.id;

    if (!employeeId) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const existingTimeSheet = await TimeSheet.findOne({
      where: {
        employeeId,
        checkInTime: { [Op.ne]: null },
        checkOutTime: null,
      },
    });

    if (!existingTimeSheet) {
      return NextResponse.json({ message: 'Không tìm thấy bản ghi check-in chưa check-out.' }, { status: 400 });
    }

    existingTimeSheet.checkOutTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await existingTimeSheet.save();

    return NextResponse.json({ message: 'Check-out thành công.', data: existingTimeSheet }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Lỗi khi check-out.', error: errorMessage }, { status: 500 });
  }
}