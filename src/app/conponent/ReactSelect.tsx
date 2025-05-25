import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';

type WarrantyOption = {
  label: string;
  value: string;
};

export default function WarrantySelector() {
  const [options, setOptions] = useState<WarrantyOption[]>([
    { label: 'Bảo hành quốc tế', value: 'international' },
    { label: 'Bảo hành nhà sản xuất', value: 'manufacturer' },
    { label: 'Bảo hành nhà cung cấp', value: 'provider' },
    { label: 'Không bảo hành', value: 'none' },
  ]);
  const [value, setValue] = useState<WarrantyOption | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOption, setNewOption] = useState('');

  const handleAddNew = () => {
    if (!newOption.trim()) return;
    const newOpt: WarrantyOption = {
      label: newOption.trim(),
      value: newOption.trim().toLowerCase().replace(/\s+/g, '-'),
    };
    setOptions((prev) => [...prev, newOpt]);
    setValue(newOpt);
    setNewOption('');
    setIsAddingNew(false);
  };

  return (
    <Autocomplete
      fullWidth
      value={value}
      onChange={(event, newValue) => {
        if (newValue?.value === '__add_new__') {
          setIsAddingNew(true);
        } else {
          setValue(newValue);
        }
      }}
      options={[
        ...options,
        { label: '➕ Thêm thuộc tính mới', value: '__add_new__' },
      ]}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      renderInput={(params) => (
        <TextField {...params} label="Chọn bảo hành" placeholder="Chọn hoặc thêm mới" />
      )}
      renderOption={(props, option) => {
        if (option.value === '__add_new__') {
          return (
            <MenuItem
              {...props}
              onMouseDown={(e) => {
                e.preventDefault(); // giữ dropdown mở
                setIsAddingNew(true);
              }}
              sx={{ fontWeight: 500, color: 'primary.main' }}
            >
              {option.label}
            </MenuItem>
          );
        }

        return (
          <li {...props}>
            {option.label}
          </li>
        );
      }}
      ListboxProps={{
        style: {
          paddingBottom: isAddingNew ? 56 : undefined, // space for input
        },
      }}
      PaperComponent={({ children, ...rest }) => (
        <Box {...rest}>
          {children}
          {isAddingNew && (
            <Box sx={{ p: 1, borderTop: '1px solid #eee' }}>
              <TextField
                size="small"
                fullWidth
                autoFocus
                placeholder="Nhập thuộc tính mới"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNew();
                  }
                  if (e.key === 'Escape') {
                    setIsAddingNew(false);
                    setNewOption('');
                  }
                }}
              />
            </Box>
          )}
        </Box>
      )}
    />
  );
}
