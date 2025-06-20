import { NextRequest, NextResponse } from 'next/server';
import ProductTransaction from '@/backend/models/ProductTransaction';
import ProductTransactionDetail from '@/backend/models/ProductTransactionDetail';
import dayjs from 'dayjs';
import { authenticateJWT } from '@/midleware';

export async function POST(req: NextRequest) {
  const transaction = await ProductTransaction.sequelize?.transaction();
  try {
    const body = await req.json();
    const { type, totalAmount, dateDelivery, details } = body;
    const user = await authenticateJWT(req)
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id

    if (!uidLogin) {
      return NextResponse.json({ message: 'Không thể lấy ID người dùng' }, { status: 400 });
    }

    if (details.length === 0) {
      return NextResponse.json({ message: 'Vui lòng nhập ít nhất 1 dòng chi tiết' }, { status: 400 });
    }

    const date = dayjs(dateDelivery);
    const dateDeliveryBigint = date.unix();

    const productTransaction = await ProductTransaction.create({
      type,
      totalAmount,
      dateDelivery: date,
      dateDeliveryBigint,
      uidLogin,
    });

    const productTransactionDetails = details.map(({ categoryId, productId, quantity, price }: ProductTransactionDetail) => ({
      transactionId: productTransaction.id,
      productId,
      type,
      categoryId,
      quantity,
      price,
      totalPrice: quantity * price,
      dateDelivery: date,
      dateDeliveryBigint,
      uidLogin,
    }));

    await ProductTransactionDetail.bulkCreate(productTransactionDetails, { transaction });

    await transaction?.commit();

    return NextResponse.json({
      message: 'ProductTransaction and ProductTransactionDetails created successfully',
      data: { productTransaction },
    }, { status: 201 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error creating ProductTransaction', error: errorMessage }, { status: 500 });
  }
}