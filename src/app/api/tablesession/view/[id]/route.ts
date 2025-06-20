import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@backend/models/TableSession';
import TableOrderDetail from '@backend/models/TableOrder';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const tableSession = await TableSession.findByPk(param.id, {
      include: [{ model: TableOrderDetail, as: 'orders' }],
    });

    if (!tableSession) {
      return NextResponse.json({ message: 'Table session not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Table session retrieved successfully', data: tableSession }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error retrieving table session', error: errorMessage }, { status: 500 });
  }
}