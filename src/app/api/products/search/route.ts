
import Product from '@/backend/models/Product';
import { NextResponse } from 'next/server';
export async function GET(req: Request) {
    try{
        const mProduct = new Product();
        const products = await mProduct.getAllProduct();
        return NextResponse.json(products,{status:200});
    } catch (error: any) {
        console.error('Lỗi trong API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}