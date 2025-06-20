import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@/backend/models/TableSession';
import BilliardTable from '@/backend/models/BilliardTable';
import { STATUS_PLAYING } from '@/form/billiardTable';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableId } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id;

    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const startTime = new Date();
    const table = await BilliardTable.findByPk(tableId);
    if (!table) {
      return NextResponse.json({ message: 'Bàn không thấy' }, { status: 404 });
    }

    const tableSession = await TableSession.create({
      tableId,
      startTime,
      isActive: true,
      createdAtBigint: Date.now(),
      playedMinutes: 0,
      status: STATUS_PLAYING,
      uidLogin,
    });

    table.status = STATUS_PLAYING;
    await table.save();

    return NextResponse.json({ message: 'Table session created successfully', data: tableSession }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error creating table session', error: errorMessage }, { status: 500 });
  }
}