import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@/backend/models/TableSession';
import TableOrderDetail from '@/backend/models/TableOrder';
import { authenticateJWT } from '@/midleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const transaction = await TableSession.sequelize?.transaction();
  try {
    const body = await req.json();
    const { orders } = body;
    const user = await authenticateJWT()
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id;
    const param = await params
    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const tableSession = await TableSession.findByPk(param.id);
    if (!tableSession) {
      return NextResponse.json({ message: 'Phiên không tồn tại' }, { status: 400 });
    }

    // Xóa các `TableOrderDetail` cũ
    await TableOrderDetail.destroy({
      where: { sessionId: param.id },
      transaction,
    });

    const createdAt = new Date();
    let tableOrderDetails: any[] = [];
    let amountOrder = 0;

    orders.forEach(({ productId, quantity, price, categoryId }: TableOrderDetail) => {
      const totalPrice = quantity * price;
      tableOrderDetails.push({
        sessionId: Number(param.id),
        productId,
        quantity,
        price,
        categoryId,
        createdAt,
        createdAtBigint: createdAt.getTime(),
        totalPrice,
        uidLogin,
      });
      amountOrder += totalPrice;
    });

    await TableOrderDetail.bulkCreate(tableOrderDetails, { transaction });

    tableSession.amountOrder = amountOrder;
    await tableSession.save();

    await transaction?.commit();

    return NextResponse.json({
      message: 'Order product added to table session successfully',
      data: tableOrderDetails,
    }, { status: 200 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      message: 'Error adding order product to table session',
      error: errorMessage,
    }, { status: 500 });
  }
}