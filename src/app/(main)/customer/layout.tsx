// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Khách hàng`,
    description: `Tìm khách hàng`,
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}