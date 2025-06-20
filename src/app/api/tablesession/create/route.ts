import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@backend/models/TableSession';
import TableOrderDetail from '@backend/models/TableOrder';
import BilliardTable from '@backend/models/BilliardTable';
import { STATUS_AVAILABLE, STATUS_PAID } from '@/form/billiardTable';
import { authenticateJWT } from '@/midleware';

export async function POST(req: NextRequest) {
  const transaction = await TableSession.sequelize?.transaction();
  try {
    const body = await req.json();
    const { tableId, startTime, endTime, status, paymentMethod, orders, amountOrder } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id;

    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const table = await BilliardTable.findByPk(tableId);
    if (!table) {
      return NextResponse.json({ message: 'Bàn không thấy' }, { status: 404 });
    }

    const tableSession = new TableSession();
    Object.assign(tableSession, {
      tableId,
      startTime,
      endTime,
      isActive: true,
      createdAtBigint: Date.now(),
      playedMinutes: 0,
      status,
      paymentMethod,
      uidLogin,
    });

    if (tableSession.endTime) {
      const playedMinutes = tableSession.fnCalculatePlayedMinutes();
      tableSession.playedMinutes = playedMinutes;
      const hourlyRate = table.hourlyRate;
      const price = (playedMinutes / 60) * hourlyRate;
      const roundedPrice = Math.round(price / 1000) * 1000;
      tableSession.amountTable = roundedPrice;
      tableSession.totalAmount = amountOrder + roundedPrice;
    }

    tableSession.validateCreate();
    if (Object.keys(tableSession.errors).length > 0) {
      return NextResponse.json({ message: 'Lỗi valid', error: tableSession.errors }, { status: 400 });
    }

    await tableSession.save();
    table.status = status === STATUS_PAID ? STATUS_AVAILABLE : status;
    await table.save();

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
    await transaction?.commit();

    return NextResponse.json({ message: 'Table session created successfully', data: tableSession }, { status: 201 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error creating table session', error: errorMessage }, { status: 500 });
  }
}