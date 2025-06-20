// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Cập nhật phiên chơi`,
    description: `Trang - Lọc theo tên`,
  
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}