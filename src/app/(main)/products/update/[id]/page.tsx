"use client"
import FormProductPage from "@/component/product/FormProduct";
import { useProduct } from "@/app/query/useProducts";
import { useParams } from "next/navigation";
import '../../create/main.css';
import { Product } from "@/app/type/model/Product";
import { Box, Typography } from "@mui/material";
const UpdateProductPage:React.FC = () => {
    const params = useParams();
    const id  = params.id;
    const {data: product, isLoading} = useProduct(Number(id)) as {data:Product, isLoading:boolean};
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
    return (<FormProductPage product={product}/>)
   
  };
  
  export default UpdateProductPage;