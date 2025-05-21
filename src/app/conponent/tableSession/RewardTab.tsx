import { useRewardTableSession } from '@/app/query/useTableSession';
import { useToastStore } from '@/app/store/toastStore';
import { useTableStore } from '@/app/store/useTableStore';
import { TableSession } from '@/app/type/model/TableSession';
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid'
import { useShallow } from 'zustand/shallow';
const Container = styled.div`
  padding: 16px;
`;

const Title = styled.h4`
  font-size: 20px;
  margin-bottom: 16px;
  color: #2c3e50;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #2980b9;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1f5e8d;
  }
`;

const InfoBox = styled.div`
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
`;

const ActionButton = styled(Button)`
  margin-top: 12px;
  background-color: #27ae60;

  &:hover {
    background-color: #1e8449;
  }
`;
const DiscountInput = styled.input`
  width: 100px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const DiscountRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

interface RewardTabProps{
  tableSessions:TableSession[];
  selectedSession?: TableSession;
}
const RewardTab:React.FC<RewardTabProps> = ({tableSessions,selectedSession}) => {
  if(!selectedSession){
    return <></>
  }
  const [phone, setPhone] = useState('');
  const customer = selectedSession.customer
  const [isNew, setIsNew] = useState(false);
  const addToast = useToastStore(state=>state.addToast)
  const [pointsToUse, setPointsToUse] = useState(0);
  const {mutate:rewardPoint} = useRewardTableSession()
  const {setTableSession, setTables, setTable,closePopup} = useTableStore(useShallow((state)=>(
    {
      setTableSession:state.setTableSession,
      setTables:state.setTables,
      setTable:state.selectTable,
      closePopup:state.closePopup
    }
  )))
  const handleFind = () => {
    const id =selectedSession.id
    rewardPoint({phone:phone,id:id},{
      onSuccess: (data) => {
        setIsNew(false);
        const tableSessionsUpdate = tableSessions.map(item=>{
          if(item.id == selectedSession.id){
            return {...item,customer:data}
          }
          return {...item}
        })
        setTableSession(tableSessionsUpdate)
        addToast({
          id: uuidv4(),
          message: 'Tích điểm thành công',
          type: 'success',
      })
      },
      onError: (error: any) => {
          console.log(error)
          addToast({
              id: uuidv4(),
              message: error.response.data.message,
              type: 'error',
          })
      },
    })
  };
  const handleUsePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 0) val = 0;
    if (customer && val > customer.point) val = customer.point;
    setPointsToUse(val);
  };

  const handleApplyPoints = () => {
    alert(`Đã sử dụng ${pointsToUse} điểm để giảm giá ${pointsToUse * 1000}đ`);
    // Xử lý logic giảm giá + cập nhật backend ở đây
  };
  return (
    <Container>
      <Title>🎁 Tích điểm thành viên</Title>
      {!customer && <InputRow>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại"
        />
        <Button onClick={handleFind}>Tích điểm</Button>
      </InputRow>
      }
      {customer && (
        <InfoBox>
          <p>Khách hàng: <strong>{customer.phone}</strong></p>
          <p>Điểm hiện tại: <strong>{customer.point}</strong></p>
          <ActionButton onClick={handleApplyPoints} disabled={customer.point < 10}>
            Áp dụng điểm giảm giá
          </ActionButton>
        </InfoBox>
      )}
    </Container>
  );
};

export default RewardTab;
