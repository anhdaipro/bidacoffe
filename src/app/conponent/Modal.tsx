"use client" 
import React from 'react';
import styled from 'styled-components';
import { useControlStore } from '../store/useStore';
import { useDeleteTransaction } from '../query/useTransaction';
import { useDeleteProduct } from '../query/useProducts';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Mờ nền */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.confirm {
    background-color: #ff4d4d;
    color: white;
  }

  &.confirm:hover {
    background-color: #cc0000;
  }

  &.cancel {
    background-color: #ddd;
    color: #333;
  }

  &.cancel:hover {
    background-color: #bbb;
  }
`;

const Modal: React.FC = () => {
    const {isVisible, setVisible, action, children, title, id} = useControlStore();
    const { mutate: deleteTransaction } = useDeleteTransaction();
    const { mutate: deleteProduct } = useDeleteProduct();
    const handleConfirm = async () => {
        switch (action) {
            case 'delete-transaction':
                deleteTransaction(id,{
                  onSuccess :() =>{
                    
                  }
                })
                break;
            case 'delete-product':
                deleteProduct(id)
                break;
            default:
                break;
        }
        setVisible(false);
    }
    return (
    isVisible && <ModalOverlay>
      <ModalBox>
        <ModalTitle>{title}</ModalTitle>
        {children && <div>{children}</div>} {/* Hiển thị nội dung tùy chỉnh */}
        <ModalActions>
          <ModalButton className="confirm" onClick={handleConfirm}>
            Xác nhận
          </ModalButton>
          <ModalButton className="cancel" onClick={() =>setVisible(false)}>
            Hủy
          </ModalButton>
        </ModalActions>
      </ModalBox>
    </ModalOverlay>
  );
};

export default Modal;