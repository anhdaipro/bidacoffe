// app/products/page.tsx
import { Metadata } from 'next';
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined };
}): Promise<Metadata> {
  

  return {
    title: `Khách hàng`,
    description: `Tìm khách hàng`,
    
  };
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}