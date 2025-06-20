import { NextRequest, NextResponse } from 'next/server';
import Payment from '@backend/models/Payment';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payment = await Payment.findByPk(params.id);

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Payment retrieved successfully', data: payment }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return NextResponse.json({ message: 'Error retrieving payment', error: errorMessage }, { status: 500 });
  }
}