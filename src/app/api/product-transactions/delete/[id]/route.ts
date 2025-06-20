import { NextRequest, NextResponse } from 'next/server';
import ProductTransaction from '@/backend/models/ProductTransaction';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const transaction = await ProductTransaction.sequelize?.transaction();
  try {
    const param = await params
    const productTransaction = await ProductTransaction.findByPk(param.id);

    if (!productTransaction) {
      return NextResponse.json({ message: 'ProductTransaction not found' }, { status: 404 });
    }
    await productTransaction.destroy({ transaction });

    await transaction?.commit();

    return NextResponse.json({
      message: 'ProductTransaction and related ProductTransactionDetails deleted successfully',
    }, { status: 200 });
  } catch (error) {
    await transaction?.rollback();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error deleting ProductTransaction', error: errorMessage }, { status: 500 });
  }
}