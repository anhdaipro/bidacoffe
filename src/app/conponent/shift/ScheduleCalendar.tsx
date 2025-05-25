import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isToday);

const ScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [shifts, setShifts] = useState([
    { id: 1, name: 'Ca sáng', startTime: '08:00', endTime: '12:00', employees: 5, status: 'active' },
    { id: 2, name: 'Ca chiều', startTime: '13:00', endTime: '17:00', employees: 4, status: 'active' },
    { id: 3, name: 'Ca tối', startTime: '18:00', endTime: '22:00', employees: 3, status: 'active' },
    { id: 4, name: 'Ca đêm', startTime: '22:00', endTime: '06:00', employees: 2, status: 'inactive' }
  ]);

  const startOfWeek = currentDate.startOf('week'); // Sunday as start

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button variant="outlined" onClick={() => setCurrentDate(prev => prev.subtract(7, 'day'))}>
          Tuần trước
        </Button>
        <Typography variant="h6" fontWeight="medium">
          {currentDate.format('MMMM YYYY')}
        </Typography>
        <Button variant="outlined" onClick={() => setCurrentDate(prev => prev.add(7, 'day'))}>
          Tuần sau
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Header - Ngày trong tuần */}
        <Grid size={{xs:12}}>
          <Grid container spacing={1}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
              <Grid key={index}>
                <Paper elevation={1} sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.light' }}>
                  <Typography variant="subtitle2" color="white">
                    {day}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {startOfWeek.add(index, 'day').format('D')}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Nội dung lịch */}
        <Grid size={{xs:12}}>
          <Grid container spacing={1}>
            {shifts.map((shift: any) => (
              <React.Fragment key={shift.id}>
                <Grid size={{xs:12, sm:1.5}} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium">
                    {shift.name}
                  </Typography>
                </Grid>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <Grid size={{xs:12, sm:1.5}} key={day}>
                    {/* Replace this with actual ShiftSlot component */}
                    <Paper sx={{ height: 60, p: 1 }}>
                      <Typography variant="caption">
                        {startOfWeek.add(day, 'day').format('D/M')}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleCalendar;
