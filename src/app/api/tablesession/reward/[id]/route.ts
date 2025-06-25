import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@/backend/models/TableSession';
import User from '@/backend/models/User';
import Reward from '@/backend/models/Reward';
import { authenticateJWT } from '@/midleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const transaction = await TableSession.sequelize?.transaction();
  try {
    const param = await params
    const body = await req.json();
    const { phone } = body;
    const employee = await authenticateJWT()
    if (employee instanceof NextResponse) return employee;
    const uidLogin = employee.id;

    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    let user = await User.findOne({ where: { phone } });
    if (!user) {
      user = await new User().createCustomer(phone);
    }

    const tableSession = await TableSession.findByPk(param.id);
    if (!tableSession) {
      return NextResponse.json({ message: 'Phiên chơi không tồn tại' }, { status: 404 });
    }

    const playedMinutes = tableSession.playedMinutes;
    let point = Math.floor(playedMinutes / 10);
    point += Math.floor(tableSession.amountOrder / 10000);

    tableSession.phone = phone;
    tableSession.customerId = user.id;
    await tableSession.save();

    await Reward.create({
      sessionId: param.id,
      customerId: user.id,
      uidLogin,
      point,
      phone,
    });

    user.point += point;
    await user.save();

    return NextResponse.json({
      message: 'Tích điểm thành công',
      data: user,
    }, { status: 200 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      message: 'Error creating reward for table session',
      error: errorMessage,
    }, { status: 500 });
  }
}