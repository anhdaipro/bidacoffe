"use client"
import FormProductPage from "@/app/conponent/product/FormProduct";
import { useProduct } from "@/app/query/useProducts";
import { useParams } from "next/navigation";
import '../../create/main.css';
import { Product } from "@/app/type/model/Product";
const UpdateProductPage:React.FC = () => {
    
    const params = useParams();
    const id  = params.id;
    const {data: product, isLoading} = useProduct(Number(id)) as {data:Product, isLoading:boolean};
    if(isLoading) return (
        <div className="loading-container">
            <svg
            className="loading-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#007bff"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="75"
                className="loading-circle"
            />
            </svg>
            <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
    );
    return (<FormProductPage product={product}/>)
   
  };
  
  export default UpdateProductPage;