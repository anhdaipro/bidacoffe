import { NextRequest, NextResponse } from 'next/server';
import TableSession from '@backend/models/TableSession';
import BilliardTable from '@backend/models/BilliardTable';
import { STATUS_WAIT_PAID } from '@/form/billiardTable';
import dayjs from 'dayjs';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { tableId } = body;
    const param = await params
    const tableSession = await TableSession.findByPk(param.id);
    const table = await BilliardTable.findByPk(tableId);

    if (!tableSession || !table) {
      return NextResponse.json({ message: 'Bàn không tồn tại hoặc phiên chơi không tồn tại' }, { status: 404 });
    }

    tableSession.endTime = dayjs().toDate();
    const playedMinutes = tableSession.fnCalculatePlayedMinutes();
    tableSession.playedMinutes = playedMinutes;

    const hourlyRate = table.hourlyRate;
    const price = (playedMinutes / 60) * hourlyRate;
    const roundedPrice = Math.round(price / 1000) * 1000;

    tableSession.amountTable = roundedPrice;
    tableSession.status = STATUS_WAIT_PAID;
    await tableSession.save();

    table.status = STATUS_WAIT_PAID;
    await table.save();

    return NextResponse.json({ message: 'Kết thúc phiên thành công', data: tableSession }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error finishing table session', error: errorMessage }, { status: 500 });
  }
}