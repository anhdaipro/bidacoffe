import { NextRequest, NextResponse } from 'next/server';
import Schedule from '@backend/models/Schedule';
import User from '@backend/models/User';
import Shift from '@backend/models/Shift';
import { Op } from 'sequelize';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const roleId = searchParams.get('roleId');

    const where: any = {};
    if (roleId) {
      const aEmployeeId = await new User().getUserByRole(Number(roleId));
      where.employeeId = { [Op.in]: aEmployeeId };
    }

    if (dateFrom || dateTo) {
      where.workDate = {
        ...(dateFrom && { [Op.gte]: dateFrom }),
        ...(dateTo && { [Op.lte]: dateTo }),
      };
    }

    const schedules = await Schedule.findAll({
      where,
      include: [
        { model: User, as: 'rEmployee' },
        { model: Shift, as: 'rShift' },
      ],
    });

    return NextResponse.json({
      message: 'Lấy danh sách lịch làm việc thành công.',
      data: schedules,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: 'Lỗi khi lấy danh sách lịch làm việc.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}