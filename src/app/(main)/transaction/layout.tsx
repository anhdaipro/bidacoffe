// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Giao dịch  sản phẩm`,
    description: `Trang - Lọc theo tên`,
    keywords: ['sản phẩm', 'tìm kiếm', 'lọc sản phẩm'],
  
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}
