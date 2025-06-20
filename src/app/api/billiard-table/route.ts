import { NextRequest, NextResponse } from 'next/server';
import BilliardTable from '@backend/models/BilliardTable';

export async function GET(req: NextRequest) {
  try {
    const tables = await BilliardTable.findAll();
    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi lấy danh sách bàn billiard' }, { status: 500 });
  }
}