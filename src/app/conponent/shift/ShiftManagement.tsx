import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CalendarToday,
  ListAlt,
  People,
  Settings,
  Add,
  Refresh,
  FileDownload
} from '@mui/icons-material';
import SettingsPanel from './SettingsPanel';
import AssignmentPanel from './AssignmentPanel';
import ShiftList from './ShiftList';
import ScheduleCalendar from './ScheduleCalendar';
import { useControlStore } from '@/app/store/useStore';
import FormShift from './FormShift';
import { useGetEmployeeSchedule } from '@/app/query/useEmployee';
import { usegetAllShift } from '@/app/query/useShift';
import { useScheduleStore } from '@/app/store/scheduleStore';

const ShiftManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const updateStore = useControlStore(state => state.updateStore);
  const {data:employees, isLoading,error} = useGetEmployeeSchedule();
  const setEmployees = useScheduleStore(state => state.setEmployees);
  const setShifts = useScheduleStore(state => state.setShifts);
  const {data:shifts,isLoading:isLoadingShift,error:errorShif} = usegetAllShift();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(()=>{
    if(employees){
      setEmployees(employees);
    }
  },[employees])
  useEffect(()=>{
    if(shifts){
      setShifts(shifts);
    }
  },[shifts])
  const handleTabChange = (e:any, newValue:number) => {
    setTabValue(newValue);
  };
  const handleAddShift = () => {
    const shift = {
      id: 0,
      name: '',
      startTime: '',
      endTime: '',
      status: 0,
      numEmployee:0,
      description: '',
      salaryHour:0,
    };
    updateStore({
      isVisible: true,
      action: "add-shift",
      children: <FormShift shift={shift}/>, // Assuming ShiftList contains the form for adding a shift
      title: "Thêm ca làm việc"
    });
  }
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 3,background:'#fff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Quản Lý Ca Làm Việc
        </Typography>
        <Box>
          <Tooltip title="Tạo ca mới">
            <Button onClick={handleAddShift} variant="contained" startIcon={<Add />} sx={{ mr: 2 }}>
              Thêm Ca
            </Button>
          </Tooltip>
          <Tooltip title="Làm mới">
            <IconButton color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xuất Excel">
            <IconButton color="secondary">
              <FileDownload />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable"
            >
          <Tab label="Lịch làm việc" icon={<CalendarToday />} />
          <Tab label="Danh sách ca" icon={<ListAlt />} />
          <Tab label="Phân công" icon={<People />} />
          <Tab label="Cài đặt" icon={<Settings />} />
        </Tabs>
        </Box>
        <Box sx={{ pt: 3 }}>
          {tabValue === 0 && <ScheduleCalendar />}
          {tabValue === 1 && <ShiftList />}
          {tabValue === 2 && <AssignmentPanel />}
          {tabValue === 3 && <SettingsPanel />}
        </Box>
      </Paper>
    </Box>
  );
};

export default ShiftManagement;