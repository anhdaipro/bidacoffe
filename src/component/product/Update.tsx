'use client'
import { useProduct } from "@/app/query/useProducts";
import { User } from "@/app/store/useUserStore";
import { Product } from "@/app/type/model/Product";
import { Box, Typography } from "@mui/material";
import Form from "./FormProduct";
interface Props{
  id:number;
  user:User;
}
const Update:React.FC<Props> = ({id}) => {
    const {data: product, isLoading} = useProduct(id) as {data:Product, isLoading:boolean};
    if(isLoading) return (
        <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="primary">
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
    return (<Form product={product}/>)
   
  };
  export default Update