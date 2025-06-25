

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { authenticateJWT } from "@/midleware";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import Update from "@/component/product/Update";
import { fetchProduct } from "@/app/hook/server/apiProduct";
interface PageProps {
  params:  Promise<{ id: string }>;
}
const UpdateProductPage:React.FC<PageProps> = async ({params}) => {
  const id = Number((await params).id)
  const queryClient = new QueryClient()
  const user = await authenticateJWT()
  if (user instanceof NextResponse){
    return redirect('/login'); // hoặc '/auth/login'
  }
  if (!user) {
    // ✅ Chuyển hướng sang trang đăng nhập
    return redirect('/login'); // hoặc '/auth/login'
  }
  const queryKey = ['product', id];
  const queryFn = () => fetchProduct(id);
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
  return(
   <HydrationBoundary state={dehydrate(queryClient)}>
      <Update user={user.toJSON()} id={id}/>
    </HydrationBoundary>
  )
}

export default UpdateProductPage;