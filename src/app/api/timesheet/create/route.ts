import { NextRequest, NextResponse } from 'next/server';
import TimeSheet from '@backend/models/TimeSheet';
import { verifyQrToken } from '@backend/utils/verifyQrToken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qrData } = body;

    const employeeId = verifyQrToken(qrData);
    if (!employeeId) {
      return NextResponse.json({ message: 'Mã QR không hợp lệ' }, { status: 400 });
    }

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const timeSheetExist = await TimeSheet.findOne({
      where: {
        employeeId,
        checkInTime: { gte: todayStart, lte: todayEnd },
      },
    });

    let type = 'IN';

    if (timeSheetExist) {
      type = 'OUT';
      await timeSheetExist.update({ checkOutTime: now });
    } else {
      await TimeSheet.create({ employeeId, checkInTime: now });
    }

    return NextResponse.json({ message: `Chấm công ${type === 'IN' ? 'vào' : 'ra'} lúc ${now.toLocaleTimeString()}` }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi chấm công.', error: errorMessage }, { status: 500 });
  }
}