import { NextRequest, NextResponse } from 'next/server';
import Payment from '@backend/models/Payment';

export async function GET(req: NextRequest) {
  try {
    const payments = await Payment.findAll();

    return NextResponse.json({ message: 'Payments retrieved successfully', data: payments }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return NextResponse.json({ message: 'Error retrieving payments', error: errorMessage }, { status: 500 });
  }
}