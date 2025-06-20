// app/products/page.tsx
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Setup bàn`,
    description: `Trang`,
    
  };
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}
