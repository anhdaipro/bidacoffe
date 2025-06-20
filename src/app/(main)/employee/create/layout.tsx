// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Tạo mới nhân viên`,
    description: `Trang - Tạo mới NV`,
    
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}