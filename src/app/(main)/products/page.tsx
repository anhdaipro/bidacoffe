// app/products/page.tsx
import React from 'react';
import Index from '@component/product/Index';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { fetchProducts } from '@/app/hook/server/apiProduct';
import { redirect } from 'next/navigation';
import { authenticateJWT } from '@/midleware';
import { NextResponse } from 'next/server';
const ProductListPage = async () => {
  const queryClient = new QueryClient()
  const page = 1;
  const limit = 20;
  const user = await authenticateJWT()
  if (user instanceof NextResponse){
    return redirect('/login'); // hoặc '/auth/login'
  }
  if (!user) {
    // ✅ Chuyển hướng sang trang đăng nhập
    return redirect('/login'); // hoặc '/auth/login'
  }
   
  const formData = {
    status: '',
    categoryId: '',
    name: '',
    dateFrom: '',
    dateTo: '',
    uidLogin: '',
  };
  const formQuery = JSON.stringify(formData)
  const queryKey = ['products', page, limit, formQuery];
  const queryFn = () => fetchProducts(page, limit, formData);
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
  return(
   <HydrationBoundary state={dehydrate(queryClient)}>
      <Index user={user.toJSON()} defaultFormData={formData} />
    </HydrationBoundary>
  )
};

export default ProductListPage;
