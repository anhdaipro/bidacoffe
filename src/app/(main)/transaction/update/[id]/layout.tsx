// app/products/page.tsx
import { Metadata } from 'next';
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined };
}): Promise<Metadata> {
  

  return {
    title: `Cập nhật GD sản phẩm`,
    description: `Trang - Lọc theo tên`,
    keywords: ['sản phẩm', 'tìm kiếm', 'lọc sản phẩm'],
  };
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}