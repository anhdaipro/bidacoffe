import { NextRequest, NextResponse } from 'next/server';
import Payment from '@backend/models/Payment';
import BilliardTable from '@backend/models/BilliardTable';
import TableSession from '@backend/models/TableSession';
import dayjs from 'dayjs';
import { Op, fn, col } from 'sequelize';


export async function GET(req: NextRequest) {
  try {
    const today = dayjs();
    const todayStr = today.format('YYYY-MM-DD');
    const todayBigint = dayjs(todayStr).unix();
    const sevenDaysAgo = today.subtract(7, 'day');
    const sevenDaysAgoStr = sevenDaysAgo.format('YYYY-MM-DD');
    const sevenDaysAgoBigint = dayjs(sevenDaysAgoStr).unix();

    const dateCol = fn('DATE', col('paid_at'));

    // Đếm số hóa đơn hôm nay
    const countInvoice = await Payment.count({
      where: {
        paidAtBigint: {
          [Op.gte]: todayBigint,
        },
      },
    });

    // Lấy doanh thu 7 ngày gần nhất
    const result = await Payment.findAll({
      attributes: [
        [dateCol, 'date'],
        [fn('SUM', col('total_amount')), 'revenue'],
      ],
      where: {
        paidAtBigint: {
          [Op.gte]: sevenDaysAgoBigint,
        },
      },
      group: [dateCol],
      order: [[dateCol, 'ASC']],
    });

    // Lấy số lượng bàn và bàn đang chơi
    const mTable = new BilliardTable();
    const countTable = await mTable.countTable();
    const aTablePlaying = await new TableSession().getTablePlaying();

    const data: any = {};
    const weeData = [];

    for (let i = 0; i <= 7; i++) {
      const date = sevenDaysAgo.add(i, 'day');
      const dateFomat = date.format('DD/MM');
      const mPayment = result.find((item) => item.get('date') === date.format('YYYY-MM-DD'));
      const revenue = mPayment ? Number(mPayment.get('revenue')) : 0;

      const dayRevenue = {
        date: dateFomat,
        revenue,
      };

      if (i === 7) {
        data.todayRevenue = revenue;
        continue;
      }

      weeData.push(dayRevenue);
    }

    Object.assign(data, { weeData, countTable, aTablePlaying, countInvoice });
    data.weeData = weeData;

    return NextResponse.json({
      message: 'Lấy doanh thu thành công',
      ...data,
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Lỗi khi lấy doanh thu 7 ngày gần nhất.', error: errorMessage }, { status: 500 });
  }
}