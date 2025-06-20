// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Nhân viên`,
    description: `Trang - Lọc theo tên NV`,
    
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}
