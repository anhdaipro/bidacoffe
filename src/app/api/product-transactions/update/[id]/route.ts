import { NextRequest, NextResponse } from 'next/server';
import ProductTransaction from '@/backend/models/ProductTransaction';
import ProductTransactionDetail from '@/backend/models/ProductTransactionDetail';
import dayjs from 'dayjs';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const transaction = await ProductTransaction.sequelize?.transaction();
  try {
    const param = await params
    const body = await req.json();
    const { type, dateDelivery, totalAmount, details } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id

    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    const productTransaction = await ProductTransaction.findByPk(param.id);

    if (!productTransaction) {
      return NextResponse.json({ message: 'ProductTransaction not found' }, { status: 404 });
    }

    const date = dayjs(dateDelivery);
    const dateDeliveryBigint = date.unix();

    await productTransaction.update({
      type,
      totalAmount,
      dateDelivery: date,
      dateDeliveryBigint,
    });

    await ProductTransactionDetail.destroy({
      where: { transactionId: param.id },
      transaction,
    });

    const productTransactionDetails = details.map(({ productId, price, quantity }: ProductTransactionDetail) => ({
      transactionId: productTransaction.id,
      productId,
      quantity,
      price,
      totalPrice: quantity * price,
      type,
      dateDelivery: date,
      dateDeliveryBigint,
      uidLogin,
    }));

    await ProductTransactionDetail.bulkCreate(productTransactionDetails, { transaction });

    await transaction?.commit();

    return NextResponse.json({
      message: 'ProductTransaction and ProductTransactionDetails updated successfully',
      data: productTransaction,
    }, { status: 200 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error updating ProductTransaction', error: errorMessage }, { status: 500 });
  }
}