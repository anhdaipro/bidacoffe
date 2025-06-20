import { NextRequest, NextResponse } from 'next/server';
import TimeSheet from '@/backend/models/TimeSheet';
import User from '@/backend/models/User';
import { Op } from 'sequelize';
import dayjs from 'dayjs';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const where: any = {};
    if (searchParams.get('employeeId')) {
      where.employeeId = searchParams.get('employeeId');
    }
    if (searchParams.get('roleId')) {
      const aEmployeeId = await new User().getUserByRole(Number(searchParams.get('roleId')));
      where.employeeId = { [Op.in]: aEmployeeId };
    }
    if (searchParams.get('status')) {
      where.status = searchParams.get('status');
    }
    if (searchParams.get('dateFrom') || searchParams.get('dateTo')) {
      where.createdAt = {
        ...(searchParams.get('dateFrom') && { [Op.gte]: searchParams.get('dateFrom') }),
        ...(searchParams.get('dateTo') && { [Op.lte]: dayjs(searchParams.get('dateTo') as string).add(1) }),
      };
    }

    const { rows: timeSheets, count: total } = await TimeSheet.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: User, as: 'rEmployee', attributes: ['roleId', 'name', 'phone'] }],
      distinct: true,
      order: [['id', 'DESC']],
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      message: 'Danh sách bản ghi chấm công',
      data: timeSheets,
      pagination: { total, totalPages, currentPage: page, limit },
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Lỗi khi lấy danh sách bản ghi chấm công.', error: errorMessage }, { status: 500 });
  }
}