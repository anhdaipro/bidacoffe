import { NextRequest, NextResponse } from 'next/server';
import ProductTransaction from '@/backend/models/ProductTransaction';
import ProductTransactionDetail from '@/backend/models/ProductTransactionDetail';


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const productTransaction = await ProductTransaction.findByPk(param.id, {
      include: [{ model: ProductTransactionDetail, as: 'details' }],
    });

    if (!productTransaction) {
      return NextResponse.json({ message: 'ProductTransaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'ProductTransaction retrieved successfully',
      data: productTransaction,
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error retrieving ProductTransaction', error: errorMessage }, { status: 500 });
  }
}