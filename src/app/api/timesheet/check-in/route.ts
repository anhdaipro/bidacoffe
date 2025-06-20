import { NextRequest, NextResponse } from 'next/server';
import TimeSheet from '@/backend/models/TimeSheet';
import Schedule from '@/backend/models/Schedule';
import Shift from '@/backend/models/Shift';
import dayjs from 'dayjs';
import { ScheduleStatus, TYPE_CHECKIN, TYPE_CHECKOUT } from '@form/schedule';
import { Op } from 'sequelize';
import { authenticateJWT } from '@/midleware';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, type, shiftId } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const employeeId = user.id;
    if (!employeeId) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const shift = await Shift.findByPk(shiftId);
    if (!shift) {
      return NextResponse.json({ message: 'Không có ca này' }, { status: 400 });
    }

    const today = dayjs();
    let responseData = null;
    let message = '';

    if (type === TYPE_CHECKIN) {
      const schedule = await Schedule.findOne({
        where: {
          employeeId,
          workDate: today.format('YYYY-MM-DD'),
          shiftId,
          status: ScheduleStatus.NEW,
        },
      });

      if (!schedule) {
        return NextResponse.json({ message: 'Không tìm thấy lịch làm việc cho nhân viên này ngày hôm nay.' }, { status: 400 });
      }

      const { startTime, workDate } = schedule;
      const startDatetime = dayjs(`${workDate} ${startTime}`);
      const todayDatetime = dayjs(`${today.format('YYYY-MM-DD')}`);

      if (startDatetime.diff(todayDatetime, 'minute') > 20) {
        return NextResponse.json({ message: 'Bạn không thể check-in trước 20 phút so với giờ làm việc.' }, { status: 400 });
      }

      const existingTimeSheet = await TimeSheet.findOne({
        where: { employeeId, shiftId, checkInTime: { [Op.ne]: null } },
      });

      if (existingTimeSheet) {
        return NextResponse.json({ message: 'Nhân viên đã check-in ngày hôm nay.' }, { status: 400 });
      }

      const newTimeSheet = await TimeSheet.create({
        employeeId,
        checkInTime: dayjs().format('YYYY-MM-DD HH:mm'),
        location,
        shiftId,
        scheduleId: schedule.id,
      });

      responseData = newTimeSheet;
      message = 'Check-in thành công.';
    } else if (type === TYPE_CHECKOUT) {
      const existingTimeSheet = await TimeSheet.findOne({
        where: { employeeId, shiftId, checkInTime: { [Op.ne]: null }, checkOutTime: null },
      });

      if (!existingTimeSheet) {
        return NextResponse.json({ message: 'Không tìm thấy bản ghi check-in chưa check-out.' }, { status: 400 });
      }

      existingTimeSheet.checkOutTime = dayjs().format('YYYY-MM-DD HH:mm');
      await existingTimeSheet.save();

      responseData = existingTimeSheet;
      message = 'Check-out thành công.';
    } else {
      return NextResponse.json({ message: 'Loại thao tác không hợp lệ.' }, { status: 400 });
    }

    return NextResponse.json({ message, data: responseData }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Lỗi khi check-in/check-out.', error: errorMessage }, { status: 500 });
  }
}