import React, { useEffect, useMemo, useState } from 'react';
import { useTableStore } from '@/app/store/useTableStore';
import styled from 'styled-components';
import { STATUS_AVAILABLE, STATUS_PLAYING, STATUS_WAIT_PAID } from '@/form/billiardTable';

import { useToastStore } from '@/app/store/toastStore';
import { v4 as uuidv4 } from 'uuid'
import {useFinishTableSession, useStartTableSession } from '@/app/query/useTableSession';
import { TableSession } from '@/app/type/model/TableSession';
import { Table } from '@/app/type/model/Table';
const InfoText = styled.p`
  margin: 8px 0;
  font-size: 15px;
`;
const ButtonConfirm =  styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background-color: #e74c3c;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;
const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #0d47a1;
  }
  &:disabled {
    background: #90a4ae;
    cursor: not-allowed;
  }
`;
interface InfoTab{
  selectedSession?: TableSession;
  tableSessions:TableSession[];
  selectedTable:Table;
}
const InfoTab:React.FC<InfoTab> = ({selectedSession, tableSessions,selectedTable}) => {
  const startTime = useTableStore((s) => s.startTime);
  const tables = useTableStore(state=>state.tables)
  const now = new Date();
  const start = selectedSession ? new Date(selectedSession.startTime) : new Date();
  const diffMs = now.getTime() - start.getTime();
  const playedMinutes = Math.floor(diffMs / 60000); // = số phút thực tế đã chơi
  const hours = Math.floor(playedMinutes / 60);
  const mins = playedMinutes - hours*60;
  const [elapsedTime, setElapsedTime] = useState(`${hours} giờ ${mins} phút`);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const addToast = useToastStore(state=>state.addToast)
  const setTableSession = useTableStore(state=>state.setTableSession)
  const setTable = useTableStore(state=>state.selectTable)
  const setTables = useTableStore(state=>state.setTables)
  const {mutate: createTableSession} = useStartTableSession()
  const {mutate:finishTableSession} = useFinishTableSession();
  const totalAmount = 0;
  if(!selectedTable){
    return <div></div>
  }
  console.log('selectedSession',selectedSession)
  useEffect(() => {
    if (!selectedSession) return;
    timeoutRef.current = setInterval(() => {
      const now = new Date();
      const start = new Date(selectedSession.startTime);
      const diffMs = now.getTime() - start.getTime();
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      setElapsedTime(`${hours} giờ ${mins} phút`);
      console.log('elapsedTime', mins);
    }, 60*1000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
    // return () => clearInterval(interval);
  }, [selectedSession]);
  
  const handleTableSession = () =>{
    createTableSession({tableId:selectedTable.id},{
      onSuccess: (data) => {
        addToast({
          id: uuidv4(),
          message: 'Tạo mới phiên thành công',
          type: 'success',
        })
        setTableSession([...tableSessions,data])
        const tablesUpdate = tables.map(item=>{
            return {...item, status:item.id == selectedTable.id ? STATUS_PLAYING : item.status}
        })
        setTables(tablesUpdate)
        setTable({...selectedTable, status: STATUS_PLAYING})
        // console.log(data)
        // queryClient.setQueryData(['BilliardTableActive'], (old: SessionProps) => 
        // {
        //   const tablesUpdate = old.tables.map(item=>{
        //     return {...item, status:item.id == selectedTable.id ? STATUS_PLAYING : item.status}
        //   })
        //   const res = {tables:tablesUpdate , tableSessions: [...old.tableSessions, data]}
        //   return res
        // }
        // );
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
  }
  const finishSession = () =>{
    const id = selectedSession ? selectedSession.id : 0
    const payload = {
      tableId:selectedTable.id,
    }
    finishTableSession({id,payload},{
      onSuccess: (data) => {
        addToast({
          id: uuidv4(),
          message: 'Kết thúc phiên thành công',
          type: 'success',
        })
        const tableSessionsUpdate = tableSessions.map(item=>{
          if(item.id == data.id){
            return {...item,...data}
          }
          return {...item}
        })
        setTableSession(tableSessionsUpdate)
        const tablesUpdate = tables.map(item=>{
            return {...item, status:item.id == selectedTable.id ? STATUS_WAIT_PAID : item.status}
        })
        setTables(tablesUpdate)
        setTable({...selectedTable, status: STATUS_WAIT_PAID})
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
  }
  return (
    <div>
      {selectedTable.status != STATUS_AVAILABLE?
      <>
      <div>
        <InfoText>Bắt đầu lúc: {startTime ? new Date(startTime).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'}</InfoText>
        <InfoText>Đã chơi: {elapsedTime}</InfoText>
      </div>
      </>
      :
      <div>Bàn trống</div>}
      <ButtonGroup>
        {selectedTable.status == STATUS_PLAYING ? (
          <>
            <Button onClick={finishSession}>Kết thúc phiên</Button>
            <Button>Chuyển bàn</Button>
          </>
        ) : 
        selectedTable.status == STATUS_WAIT_PAID ?
        <></> :
        (
          <Button onClick={handleTableSession}>Bắt đầu chơi</Button>
        )}
      </ButtonGroup>
    </div>
    
  );
};

export default InfoTab;
