"use client"
import Form from "@/component/customer/Form"
import { useGetUser } from "@/app/query/useUser";
import { useParams } from "next/navigation";
const Update = () =>{
    const params = useParams();
    const id  = params.id;
    const {data: customer, isLoading} = useGetUser(Number(id));
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
    return (
        <Form customer={customer} />
    )
}
export default Update