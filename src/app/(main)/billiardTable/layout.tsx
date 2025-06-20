// app/products/page.tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Setup bàn`,
    description: `Trang`,
    
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}
