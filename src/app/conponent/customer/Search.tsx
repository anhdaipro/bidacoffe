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
import { FormSearch } from "./Index";

interface SearchProps {
  setFormSearch: (data: FormSearch) => void;
  form: FormSearch;
}

const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
  const [formData, setFormData] = useState<FormSearch>({
    status: "",
    phone: "",
    dateFrom: "",
    dateTo: "",
  });

  const setForm = (key: keyof FormSearch, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const searchData = () => {
    setFormSearch(formData);
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Grid container spacing={3}>
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
                <em>Chọn</em>
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
