import { NextRequest, NextResponse } from 'next/server';
import Payment from '@/backend/models/Payment';
import TableSession from '@/backend/models/TableSession';
import User from '@/backend/models/User';
import Reward from '@/backend/models/Reward';
import ProductTransaction from '@/backend/models/ProductTransaction';
import BilliardTable from '@/backend/models/BilliardTable';
import { STATUS_AVAILABLE, STATUS_PAID } from '@/form/billiardTable';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, cashAmount, onlineAmount, method, note, isUsePoint } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const employeeId = user.id;

    if (!employeeId) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const session = await TableSession.findByPk(sessionId);
    if (!session) {
      return NextResponse.json({ message: 'Phiên chơi không tồn tại' }, { status: 404 });
    }

    let totalAmount = session.amountOrder + session.amountTable;
    let discountAmount = 0;

    if (isUsePoint) {
      const customer = await User.findByPk(session.customerId);
      if (customer) {
        let point = customer.point;
        let usablePoints = Math.floor(point / 10);
        discountAmount = usablePoints * 1000;

        if (discountAmount > totalAmount) {
          usablePoints = Math.floor(totalAmount / 10000);
          discountAmount = usablePoints * 10000;
        }

        const pointsUsed = usablePoints * 10;
        await Reward.create({
          point: -pointsUsed,
          customerId: session.customerId,
          uidLogin: employeeId,
          phone: customer.phone,
          sessionId,
        });

        customer.point -= pointsUsed;
        totalAmount -= discountAmount;
        await customer.save();
      }
    }

    const paidAt = new Date();
    const paidAtBigint = paidAt.getTime();

    const payment = await Payment.create({
      sessionId,
      totalAmount,
      cashAmount,
      onlineAmount,
      method,
      employeeId,
      paidAt,
      paidAtBigint,
      note,
    });

    session.totalAmount = totalAmount;
    session.discountAmount = discountAmount;
    session.status = STATUS_PAID;
    await session.save();

    const mProductTransaction = new ProductTransaction();
    mProductTransaction.uidLogin = employeeId;
    await mProductTransaction.createFromSession(session);

    const table = await BilliardTable.findByPk(session.tableId);
    if (table) {
      table.status = STATUS_AVAILABLE;
      await table.save();
    }

    return NextResponse.json({ message: 'Payment created successfully', data: payment }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return NextResponse.json({ message: 'Error creating payment', error: errorMessage }, { status: 500 });
  }
}