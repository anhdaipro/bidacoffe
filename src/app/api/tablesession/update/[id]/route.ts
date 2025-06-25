import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@/backend/models/TableSession';
import TableOrderDetail from '@/backend/models/TableOrder';
import BilliardTable from '@/backend/models/BilliardTable';
import LogUpdate, { TYPE_SESSION } from '@/backend/models/LogUpdate';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const transaction = await TableSession.sequelize?.transaction();
  try {
    const body = await req.json();
    const { playerName, phone, startTime, endTime, status, orders, tableId, amountOrder } = body;
    const param = await params
    const user = await authenticateJWT()
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id;

    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const tableSession = await TableSession.findByPk(param.id);
    if (!tableSession) {
      return NextResponse.json({ message: 'Table session not found' }, { status: 404 });
    }

    const table = await BilliardTable.findByPk(tableId);
    if (!table) {
      return NextResponse.json({ message: 'Bàn không thấy' }, { status: 404 });
    }

    const updates: any = { playerName, phone, startTime, endTime, status };
    const changes: any = {};
    for (const key in updates) {
      const oldValue = (tableSession as any)[key];
      if (oldValue !== updates[key]) {
        changes[key] = {
          old: oldValue,
          new: updates[key],
        };
      }
    }

    await TableOrderDetail.destroy({
      where: { sessionId: param.id },
    });

    Object.assign(tableSession, updates);

    if (tableSession.endTime) {
      const playedMinutes = tableSession.fnCalculatePlayedMinutes();
      tableSession.playedMinutes = playedMinutes;
      const hourlyRate = table.hourlyRate;
      const price = (playedMinutes / 60) * hourlyRate;
      const roundedPrice = Math.round(price / 1000) * 1000;
      tableSession.amountTable = roundedPrice;
      tableSession.totalAmount = amountOrder + roundedPrice;
    }

    await tableSession.save();

    const createdAt = new Date();
    const aDetail = orders.map(({ productId, quantity, price, categoryId }: TableOrderDetail) => ({
      sessionId: tableSession.id,
      productId,
      quantity,
      price,
      categoryId,
      createdAt,
      createdAtBigint: createdAt.getTime(),
      totalPrice: quantity * price,
      uidLogin,
    }));

    await TableOrderDetail.bulkCreate(aDetail, { transaction });

    if (Object.keys(changes).length > 0) {
      await LogUpdate.create({
        userId: uidLogin,
        belongId: param.id,
        type: TYPE_SESSION,
        roleId: user.roleId,
        changes,
      });
    }

    await transaction?.commit();

    return NextResponse.json({ message: 'Table session updated successfully', data: tableSession }, { status: 200 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error updating table session', error: errorMessage }, { status: 500 });
  }
}