"use client"
import { formatNumber } from '@/app/helper';
import { useCreateBilliardTable,useUpdateBilliardTable } from '@/app/query/useBilliardTable';
import { useAuthStore } from '@/app/store/useUserStore';
import { FlexBox, Title } from '@/app/type/styles';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import { STATUS_LABELS } from '@/form/user';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useRouter } from "next/navigation";
import { useCreateCustomer, useUpdateCustomer } from '@/app/query/useUser';
import { FormCustomer } from '../../type/model/Customer';
import { useToastStore } from '../../store/toastStore';
import { v4 as uuidv4 } from 'uuid'
export const FormContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const InputGroup = styled.div`
  margin-bottom: 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &.error {
    border-color: #ff4d4d;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

export const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
`;
export const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &.error {
    border-color: #ff4d4d;
  }
`;
export const StyledLink = styled.a`
  text-decoration: none; /* Loại bỏ gạch chân */
  color: #007bff; /* Màu xanh cho liên kết */
  font-size: 14px; /* Kích thước chữ */
  font-weight: bold; /* Chữ đậm */
  padding: 8px 12px; /* Khoảng cách bên trong */
  border: 1px solid #007bff; /* Viền xanh */
  border-radius: 5px; /* Bo góc */
  transition: background-color 0.3s ease, color 0.3s ease; /* Hiệu ứng hover */

  &:hover {
    background-color: #007bff; /* Nền xanh khi hover */
    color: white; /* Chữ trắng khi hover */
  }
`;

interface Props{
  customer: FormCustomer;
}
const CustomerForm: React.FC<Props> = ({ customer }) => {
  const user = useAuthStore(state=>state.user)
  const router = useRouter();
    const addToast = useToastStore(state=>state.addToast)
  useEffect(()=>{
    if(user && user.roleId != ROLE_ADMIN){
      router.push('/customer')
    }
  },[user])  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormCustomer>({
    defaultValues: {
     ...customer
    },
  });
  const { mutate: addCustomer } = useCreateCustomer();
  const { mutate: updateCustomer } = useUpdateCustomer();
  const handleFormSubmit = (data: FormCustomer) => {
    const payload = {
      ...data
    };
    if (customer.id) {
      const id = customer.id;
      updateCustomer({ id, payload }, {
        onSuccess: () => {
            addToast({
                id: uuidv4(),
                message: 'Cập nhật thành công',
                type: 'success',
                
              })
            window.location.href = '/customer';
        },
        onError: (error: any) => {
          console.error('Error updating billiard table:', error);
        },
      });
    } else {
        addCustomer(payload, {
        onSuccess: () => {
            addToast({
                id: uuidv4(),
                message: 'Thêm mới thành công',
                type: 'success',
                
              })
            window.location.href = '/customer';
        },
        onError: (error: any) => {
          console.error('Error creating billiard table:', error);
        },
      });
    }
    
  };
  
  const title = customer.id ? 'Cập nhật' : 'Tạo mới';
  return (
    <FormContainer>
      <FlexBox justify='flex-end' padding='24px'>
      <StyledLink href='/customer'>Danh sách</StyledLink>
      </FlexBox>
      <Title align='center'>{title} khách hàng</Title>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Input Group for Table Number */}
        <InputGroup>
          <Label htmlFor="name">Tên</Label>
          <Input
            id="name"
            {...register('name', {  })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </InputGroup>

        {/* Input Group for Status */}
        <InputGroup>
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            id="status"
            {...register('status', { required: 'Trạng thái là bắt buộc' })}
          >
            <option value="">Chọn trạng thái</option>
            {Object.entries(STATUS_LABELS).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
          {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
        </InputGroup>

        {/* Input Group for Type */}
        <InputGroup>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            {...register('phone', {required: 'SĐT không để trống'  })}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </InputGroup>

        {/* Input Group for Hourly Rate */}
       
        <SubmitButton type="submit">{title}</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default CustomerForm;