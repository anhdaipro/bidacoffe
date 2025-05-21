// app/products/page.tsx
'use client';
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import {useProducts, useUpdateStatusProduct } from '../../query/useProducts';
import { useControlStore } from '../../store/useStore';
import { STATUS_ACTIVE, STATUS_INACTIVE, STATUS_LABELS } from '@/form/user';
import { formatDate, formatNumber } from '../../helper';
import { FlexBox } from '../../type/styles';
import { useAuthStore } from '../../store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import { usegetAllUsers } from '@/app/query/useUser';
import Search from './Search';
interface Customer{
    id: number;
    name:string;
    status:number;
    phone:string;
    point:number;
    canUpdate:boolean;
    canDelete:boolean;
    createdAt: string;
}
export interface FormSearch{
  status:string;
  phone:string;
  dateFrom:string;
  dateTo:string;
}
const Index = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Số sản phẩm trên mỗi trang
    const [formData, setFormData] = useState<FormSearch>({status:'',phone: '',dateFrom: '', dateTo:''});
    const { data, isLoading } = usegetAllUsers(currentPage, itemsPerPage,formData);
    const updateStore  = useControlStore(state=>state.updateStore);
    const user = useAuthStore(state=>state.user)
    const {mutate: updateStatus, error} = useUpdateStatusProduct();
    
    if (isLoading || !user) {
        return (
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
    }
console.log(data)
  const aCustomer = data.data;
  const totalPages = data.pagination.totalPages;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
    // Lấy dữ liệu sản phẩm từ API (giả sử API trả về dữ liệu sản phẩm)
    const handleUpdate = (id:number,statusCurrent:number) =>{
        const status = statusCurrent == STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE
        updateStatus({id,status}, {
        })
    }
    const setFormSearch = (data:FormSearch)=>{
        setFormData(prev => ({ ...prev, ...data }));
        console.log(formData)
    }
    console.log(formData)
    return (
        <div className="product-container">
            <Search setFormSearch={setFormSearch} form={formData}/>
            {user?.roleId == ROLE_ADMIN && <FlexBox justify='flex-end' padding='24px'>
                <Link href="/customer/create" className="create-btn">Tạo mới</Link>
            </FlexBox>}
            
            <h1 className="product-title">Danh sách khách hàng</h1>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Kh</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Điểm tích lũy</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {aCustomer.map((customer:Customer,index:number) => (
                    <tr key={customer.id}>
                        <td>{index+1}</td>
                        <td>{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td>{STATUS_LABELS[customer.status]}</td>
                        <td>{customer.point}</td>
                        <td>{formatDate(customer.createdAt)}</td>
                        <td>
                            <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                            {user.roleId == ROLE_ADMIN && <Link href={`/customer/update/${customer.id}`} className="edit-btn">Chỉnh sửa</Link>}
                            {/* {user.roleId == ROLE_ADMIN && <button
                            onClick={() => handleDelete(product.id)}
                            className="delete-btn"
                            >
                            Xóa
                            </button>} */}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Phân trang */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                    {i + 1}
                </button>
                ))}
            </div>
        </div>
    );
};

export default Index;
