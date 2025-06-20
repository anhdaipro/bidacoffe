import { NextRequest, NextResponse } from 'next/server';
import Payment from '@backend/models/Payment';
import TableSession from '@backend/models/TableSession';
import { STATUS_PAID } from '@/form/billiardTable';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const body = await req.json();
    const { sessionId, amount, totalAmount, cashAmount, onlineAmount, discount, method, paidAt, note } = body;

    const payment = await Payment.findByPk(param.id);
    const session = await TableSession.findByPk(sessionId);

    if (!payment || !session) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    await payment.update({
      sessionId,
      amount,
      totalAmount,
      cashAmount,
      onlineAmount,
      discount,
      method,
      paidAt,
      note,
    });

    session.status = STATUS_PAID;
    await session.save();

    return NextResponse.json({ message: 'Payment updated successfully', data: payment }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return NextResponse.json({ message: 'Error updating payment', error: errorMessage }, { status: 500 });
  }
}