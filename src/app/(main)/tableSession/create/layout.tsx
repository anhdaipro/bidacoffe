// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Tạo mới phiên chơi`,
    description: `Trang - Lọc theo tên`,
  
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}