import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@backend/models/TableSession';
import BilliardTable from '@backend/models/BilliardTable';
import TableOrderDetail from '@backend/models/TableOrder';
import User from '@backend/models/User';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import { authenticateJWT } from '@/midleware';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id
    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }
    const where: any = {};
    if (searchParams.get('codeNo')) {
      where.codeNo = searchParams.get('codeNo');
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

    const { rows: tableSessions, count: total } = await TableSession.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: BilliardTable, as: 'table' },
        { model: TableOrderDetail, as: 'orders' },
        { model: User, as: 'rUidLogin', attributes: ['name'] },
        { model: User, as: 'customer', attributes: ['name', 'phone'] },
      ],
      distinct: true,
      order: [['id', 'DESC']],
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      message: 'Table sessions retrieved successfully',
      data: tableSessions,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error retrieving table sessions', error: errorMessage }, { status: 500 });
  }
}