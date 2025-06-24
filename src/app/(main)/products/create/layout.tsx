import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Tạo mới sản phẩm',
  description: '...',
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>
    {children}
   </>
                     
  );
}