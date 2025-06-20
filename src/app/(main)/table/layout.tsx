// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Quản lí bàn`,
    description: `Quản lí bàn và xem phiên chơi`,
    
  
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}
