import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Cập nhật sản phẩm',
  description: '...',
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>
    {children}
   </>
                     
  );
}