import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { CATEGORY_LABELS, STATUS_LABEL } from "@/form/product";
import SearchAutocomplete, { AutocompleteItem } from "../Autocomplete";
import { apiSearchCustomer } from "@/app/api/apiUser";
import { CustomerFormSearch } from "@/app/type/model/Customer";

interface SearchProps {
  setFormSearch: (data: CustomerFormSearch) => void;
  form: CustomerFormSearch;
}

const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
  const [formData, setFormData] = useState<CustomerFormSearch>({
    status: "",
    phone: "",
    dateFrom: "",
    dateTo: "",
    uidLogin:""
  });
  const [item,setItem] = useState<AutocompleteItem|null>(null)
  const setForm = (key: keyof CustomerFormSearch, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const searchData = () => {
    setFormSearch(formData);
  };
  const handleChange = (
    key: keyof typeof formData,
    value: string | Dayjs | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const selectItem = (item:AutocompleteItem|null) =>{
    handleChange('uidLogin', item ? item?.id.toString() : '')
    setItem(item)
  }
  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 800,
        mx: "auto",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Grid container spacing={2}>
        {/* Trạng thái */}
        <Grid size={{xs:12, sm:6}}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              label="Trạng thái"
              value={formData.status}
              onChange={(e) => setForm("status", e.target.value)}
            >
              <MenuItem value="">
                <em>Chọn trạng thái</em>
              </MenuItem>
              {Object.entries(STATUS_LABEL).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Số điện thoại */}
        <Grid size={{xs:12, sm:6}}>
          <TextField
            fullWidth
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={(e) => setForm("phone", e.target.value)}
          />
        </Grid>

        {/* Từ (DatePicker) */}
        <Grid size={{xs:12, sm:6}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Từ"
              value={formData.dateFrom ? dayjs(formData.dateFrom) : null}
              onChange={(newValue: Dayjs | null) => {
                if (newValue) {
                  setForm("dateFrom", newValue.format("YYYY-MM-DD"));
                } else {
                  setForm("dateFrom", "");
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: "dd/MM/yyyy",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Đến (DatePicker) */}
        <Grid size={{xs:12, sm:6}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Đến"
              value={formData.dateTo ? dayjs(formData.dateTo) : null}
              onChange={(newValue: Dayjs | null) => {
                if (newValue) {
                  setForm("dateTo", newValue.format("YYYY-MM-DD"));
                } else {
                  setForm("dateTo", "");
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: "dd/MM/yyyy",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <SearchAutocomplete 
          itemchoice={item}
          label='Nhập tên người tạo'
          fetcher={apiSearchCustomer}
          onSelect={(item:AutocompleteItem|null) => selectItem(item)}
          />
        </Grid>
        {/* Button tìm kiếm */}
        <Grid size={{xs:12}} >
          <Button variant="contained" onClick={searchData}>
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Search;
