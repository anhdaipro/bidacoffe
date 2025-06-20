import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Thống kê`,
    description: `Xem thống kê`,
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}