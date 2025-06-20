import { Metadata } from 'next';
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined };
}): Promise<Metadata> {
  

  return {
    title: `Thống kê`,
    description: `Xem thống kê`,
  };
}
export default function RootLayout({children}:{children: React.ReactNode}){
  return (
   <>{children}</>
                     
  );
}