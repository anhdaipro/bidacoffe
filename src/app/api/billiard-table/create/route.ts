import { NextRequest, NextResponse } from 'next/server';
import BilliardTable from '@/backend/models/BilliardTable';

export async function POST(req: NextRequest) {
  try {
    const { tableNumber, status, type, hourlyRate } = await req.json();

    const existingTable = await BilliardTable.findOne({ where: { tableNumber } });
    if (existingTable) {
      return NextResponse.json({ message: 'Bàn billiard đã tồn tại' }, { status: 400 });
    }

    const newTable = await BilliardTable.create({
      tableNumber,
      status,
      type,
      hourlyRate,
    });

    return NextResponse.json({ data: newTable, message: 'Tạo bàn billiard thành công' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi tạo bàn billiard' }, { status: 500 });
  }
}