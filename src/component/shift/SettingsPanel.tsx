import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert
} from '@mui/material';
import {
  NotificationsActive,
  Schedule,
  Palette,
  Settings,
  Save
} from '@mui/icons-material';

const SettingsPanel = () => {
  // State quản lý cài đặt
  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
    shiftChangeDeadline: 24,
    overtimeThreshold: 8
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e:any) => {
    const { name, value, checked, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Lưu cài đặt vào API/localStorage
    localStorage.setItem('shiftSettings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Settings sx={{ mr: 1 }} /> Cài Đặt Hệ Thống
      </Typography>

      {isSaved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Đã lưu cài đặt thành công!
        </Alert>
      )}

      {/* Nhóm cài đặt thông báo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsActive color="primary" sx={{ mr: 1 }} /> Thông Báo
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
          }
          label="Bật thông báo phân ca"
          sx={{ mb: 1 }}
        />
        
        <TextField
          label="Thời hạn đổi ca (giờ)"
          name="shiftChangeDeadline"
          type="number"
          value={settings.shiftChangeDeadline}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{ endAdornment: 'giờ' }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Nhóm cài đặt giao diện */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Palette color="primary" sx={{ mr: 1 }} /> Giao Diện
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Chủ đề</InputLabel>
          <Select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            label="Chủ đề"
          >
            <MenuItem value="light">Sáng</MenuItem>
            <MenuItem value="dark">Tối</MenuItem>
            <MenuItem value="system">Theo hệ thống</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Nhóm cài đặt quy tắc */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Schedule color="primary" sx={{ mr: 1 }} /> Quy Tắc Ca Làm
        </Typography>
        
        <TextField
          label="Ngưỡng tăng ca (giờ/ngày)"
          name="overtimeThreshold"
          type="number"
          value={settings.overtimeThreshold}
          onChange={handleChange}
          fullWidth
          InputProps={{ endAdornment: 'giờ' }}
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Lưu Cài Đặt
      </Button>
    </Paper>
  );
};

export default SettingsPanel;