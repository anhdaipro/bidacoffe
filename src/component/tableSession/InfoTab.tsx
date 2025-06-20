import React, { useEffect, useMemo, useState } from 'react';
import { useTableStore } from '@/app/store/useTableStore';

import { STATUS_AVAILABLE, STATUS_PLAYING, STATUS_WAIT_PAID } from '@/form/billiardTable';

import { useToastStore } from '@/app/store/toastStore';
import { v4 as uuidv4 } from 'uuid'
import {useFinishTableSession, useStartTableSession } from '@/app/query/useTableSession';
import { TableSession } from '@/app/type/model/TableSession';
import { Table } from '@/app/type/model/Table';
import { Box, Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
interface InfoTab{
  selectedSession?: TableSession;
  tableSessions:TableSession[];
  selectedTable:Table;
}
const InfoTab:React.FC<InfoTab> = ({selectedSession, tableSessions,selectedTable}) => {
  const tables = useTableStore(state=>state.tables)
  const now = dayjs().tz("Asia/Ho_Chi_Minh");
  const start = selectedSession ? dayjs(selectedSession.startTime) : now;
  const diffMs = now.valueOf() - start.valueOf();
  const playedMinutes = Math.floor(diffMs / 60000); // = số phút thực tế đã chơi
  const hours = Math.floor(playedMinutes / 60);
  const mins = playedMinutes - hours*60;
  const [elapsedTime, setElapsedTime] = useState(`${hours} giờ ${mins} phút`);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const addToast = useToastStore(state=>state.addToast)
  const setTableSession = useTableStore(state=>state.setTableSession)
  const setTable = useTableStore(state=>state.selectTable)
  const setTables = useTableStore(state=>state.setTables)
  const {mutate: createTableSession,isPending:isPendingCreate} = useStartTableSession()
  const {mutate:finishTableSession,isPending:isPendingUpdate} = useFinishTableSession();
  const totalAmount = 0;
  if(!selectedTable){
    return <div></div>
  }
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
        addToast({
          id: uuidv4(),
          message: error.response.data.message,
          type: 'error',
        })
      },
    })
  }
  return (
    <Box>
    {selectedTable.status !== STATUS_AVAILABLE ? (
      <>
        <Box mb={1}>
          <Typography variant="body2" mb={1}>
            Bắt đầu lúc:{start ? dayjs(start).format('DD/MM/YYYY HH:mm') : ''}
          </Typography>
          <Typography variant="body2">Đã chơi: {elapsedTime}</Typography>
        </Box>
      </>
    ) : (
      <Typography>Bàn trống</Typography>
    )}

    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      mt={2}
      flexWrap="wrap"
    >
      {selectedTable.status === STATUS_PLAYING ? (
        <>
          <Button
            variant="contained"
            disabled={isPendingUpdate}
            color="error"
            onClick={finishSession}
            sx={{ flexGrow: 1, borderRadius: 2, fontWeight: 'bold' }}
          >
            Kết thúc phiên
          </Button>
         
        </>
      ) : selectedTable.status === STATUS_WAIT_PAID ? (
        <></>
      ) : (
        <Button
        disabled={isPendingCreate}
          variant="contained"
          color="primary"
          onClick={handleTableSession}
          sx={{ flexGrow: 1, borderRadius: 2, fontWeight: 'bold' }}
        >
          Bắt đầu chơi
        </Button>
      )}
    </Stack>
  </Box>
    
  );
};

export default InfoTab;
