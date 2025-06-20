import { NextRequest, NextResponse } from 'next/server';
import BilliardTable from '@backend/models/BilliardTable';
import TableSession from '@backend/models/TableSession';
import TableOrderDetail from '@backend/models/TableOrder';
import User from '@backend/models/User';
import { Op } from 'sequelize';
import { LSESSIONACTIVE } from '@/form/billiardTable';

export async function GET(req: NextRequest) {
  try {
    const aTable = await BilliardTable.findAll();
    const aModelTableSession = await TableSession.findAll({
      where: { status: { [Op.in]: LSESSIONACTIVE } },
      include: [
        { model: TableOrderDetail, as: 'orders' },
        { model: User, as: 'customer', attributes: ['point', 'id', 'phone'] },
      ],
    });

    const aTableSession = await Promise.all(
      aModelTableSession.map(async (tableSession) => {
        const startTime = new Date(tableSession.startTime).getTime();
        const now = tableSession.endTime ? new Date(tableSession.endTime).getTime() : Date.now();
        const playedMinutes = Math.floor((now - startTime) / 60000);
        return {
          ...tableSession.toJSON(),
          playedMinutes: playedMinutes,
        };
      })
    );

    const aData = {
      tables: aTable,
      tableSessions: aTableSession,
    };

    return NextResponse.json({ data: aData, message: 'Lấy danh sách bàn billiard thành công' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi lấy danh sách bàn billiard đang hoạt động' }, { status: 500 });
  }
}