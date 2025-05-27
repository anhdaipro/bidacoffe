"use client"
import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Select,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { CATEGORY_LABELS, STATUS_LABEL } from '@/form/product';
import SearchAutocomplete, { AutocompleteItem } from '../Autocomplete';
import { apiSearchCustomer } from '@/app/api/apiUser';
import { ProductFormSearch } from '@/app/type/model/Product';

interface SearchProps {
  setFormSearch: (data: ProductFormSearch) => void;
  form: ProductFormSearch;
}

const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
  // Convert string dates to Dayjs objects or null
  const [formData, setFormData] = useState<ProductFormSearch>({ ...form });
  const [item,setItem] = useState<AutocompleteItem|null>(null)
  // Handle input and select changes
  const handleChange = (
    key: keyof typeof formData,
    value: string | Dayjs | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const searchData = () => {
    // Convert Dayjs dates back to string format 'YYYY-MM-DD' or empty string
    setFormSearch({
      name: formData.name,
      categoryId: formData.categoryId,
      status: formData.status,
      dateFrom: formData.dateFrom ? dayjs(formData.dateFrom).format('YYYY-MM-DD') : '',
      dateTo: formData.dateTo ? dayjs(formData.dateTo).format('YYYY-MM-DD') : '',
      uidLogin:formData.uidLogin
    });
  };
  const selectItem = (item:AutocompleteItem|null) =>{
    handleChange('uidLogin', item ? item?.id.toString() : '')
    setItem(item)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 800,
        mx: 'auto',
        p: 2
      }}>
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm:6, md: 4}}>
          <TextField
            fullWidth
            label="Tên"
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập tên"
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md: 4}}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Loại</InputLabel>
            <Select
              labelId="category-label"
              label="Loại"
              value={formData.categoryId}
              onChange={(e: SelectChangeEvent) => handleChange('categoryId', e.target.value)}
            >
              <MenuItem value="">Chọn loại</MenuItem>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{xs:12, sm:6, md: 4}}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              label="Trạng thái"
              value={formData.status}
              onChange={(e: SelectChangeEvent) => handleChange('status', e.target.value)}
            >
              <MenuItem value="">Chọn trạng thái</MenuItem>
              {Object.entries(STATUS_LABEL).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{xs:12, sm:6, md: 4}}>
          <DatePicker
            label="Từ"
            value={formData.dateFrom ? dayjs(formData.dateFrom) : null}
            format='DD/MM/YYYY'
            onChange={(newValue) => handleChange('dateFrom', newValue)}
            slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
           
            
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md: 4}}>
          <DatePicker
            label="Đến"
            value={formData.dateTo ? dayjs(formData.dateTo) : null}
            onChange={(newValue) => handleChange('dateTo', newValue)}
            format='DD/MM/YYYY'
            slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
          />
        </Grid>
        <Grid size={{xs:12, sm:6, md: 4}}>
          <SearchAutocomplete 
          itemchoice={item}
          label='Nhập tên người tạo'
          fetcher={apiSearchCustomer}
          onSelect={(item:AutocompleteItem|null) => selectItem(item)}
          />
        </Grid>
      </Grid>
      {/* Nút tìm kiếm tách riêng */}
        <Box sx={{  marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={searchData}>
                Tìm kiếm
            </Button>
        </Box>
        </Box>
    </LocalizationProvider>
  );
};

export default Search;
