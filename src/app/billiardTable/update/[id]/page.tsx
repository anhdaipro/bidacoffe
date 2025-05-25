"use client"
import Form from "@/app/conponent/billiardTable/Form";
import { useBilliardTable } from "@/app/query/useBilliardTable";
import { useParams } from "next/navigation";
const UpdateTablePage:React.FC = () => {
    const params = useParams();
    const id  = params.id;
    const {data: table, isLoading} = useBilliardTable(Number(id));
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
    return (<Form table={table}/>)
   
  };
  
  export default UpdateTablePage;