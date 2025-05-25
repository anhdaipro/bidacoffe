import React, { useState } from 'react';
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
  Tooltip
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

const ShiftManagement = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (e:any, newValue:number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Quản Lý Ca Làm Việc
        </Typography>
        <Box>
          <Tooltip title="Tạo ca mới">
            <Button variant="contained" startIcon={<Add />} sx={{ mr: 2 }}>
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
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab label="Lịch làm việc" icon={<CalendarToday />} />
          <Tab label="Danh sách ca" icon={<ListAlt />} />
          <Tab label="Phân công" icon={<People />} />
          <Tab label="Cài đặt" icon={<Settings />} />
        </Tabs>

        <Box sx={{ pt: 3 }}>
          {tabValue === 0 && <ScheduleCalendar />}
          {tabValue === 1 && <ShiftList />}
          {tabValue === 2 && <AssignmentPanel />}
          {tabValue === 3 && <SettingsPanel />}
        </Box>
      </Paper>
    </Container>
  );
};

export default ShiftManagement;