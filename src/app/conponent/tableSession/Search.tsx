import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { STATUS_SESSION_LABELS } from "@/form/billiardTable";
import { PAYMENT_METHOD_LABELS } from "@/form/payment";
import { useBilliardTables } from "@/app/query/useBilliardTable";
import { Table } from "@/app/type/model/Table";

export interface FormSearch {
  status: string;
  codeNo: string;
  dateFrom: string;
  dateTo: string;
  tableId: number;
  employeeId: number;
  paymentMethod: number;
}

interface SearchProps {
  setFormSearch: (data: FormSearch) => void;
  form: FormSearch;
}

const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
  const [formData, setFormData] = useState<FormSearch>({ ...form });

  const { data, isLoading } = useBilliardTables();
  const tables = isLoading ? [] : data || [];

  const handleChange = (
    key: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (key: "dateFrom" | "dateTo", value: Dayjs | null) => {
    if (value) {
      handleChange(key, value.format("YYYY-MM-DD"));
    } else {
      handleChange(key, "");
    }
  };

  const searchData = () => {
    setFormSearch(formData);
  };

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
      <Grid container spacing={2} alignItems="center" >
        <Grid size={{xs:12, sm:6, md:4}}>
          <TextField
            fullWidth
            label="Mã"
            placeholder="Nhập mã"
            value={formData.codeNo}
            onChange={(e) => handleChange("codeNo", e.target.value)}
            size="small"
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:4}}>
          <FormControl fullWidth size="small">
            <InputLabel id="table-select-label">Bàn số</InputLabel>
            <Select
              labelId="table-select-label"
              value={formData.tableId ?? ""}
              label="Bàn số"
              onChange={(e) =>
                handleChange("tableId", e.target.value)
              }
            >
              <MenuItem value="">Chọn bàn</MenuItem>
              {tables.map((table: Table) => (
                <MenuItem key={table.id} value={table.id}>
                  Bàn số {table.tableNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{xs:12, sm:6, md:4}}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-select-label">Trạng thái</InputLabel>
            <Select
              labelId="status-select-label"
              value={formData.status ?? ""}
              label="Trạng thái"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="">Chọn trạng thái</MenuItem>
              {Object.entries(STATUS_SESSION_LABELS).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{xs:12, sm:6, md:4}}>
          <FormControl fullWidth size="small">
            <InputLabel id="payment-select-label">Phương thức thanh toán</InputLabel>
            <Select
              labelId="payment-select-label"
              value={formData.paymentMethod ?? ""}
              label="Phương thức thanh toán"
              onChange={(e) =>
                handleChange(
                  "paymentMethod",
                  e.target.value
                )
              }
            >
              <MenuItem value="">Chọn phương thức</MenuItem>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{xs:12, sm:6, md:4}}>
          <DatePicker
            label="Từ"
            value={formData.dateFrom ? dayjs(formData.dateFrom) : null}
            format='DD/MM/YYYY'
            onChange={(date) => handleDateChange("dateFrom", date)}
            slotProps={{
              textField: { size: "small", fullWidth: true },
            }}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:4}}>
          <DatePicker
            label="Đến"
            value={formData.dateTo ? dayjs(formData.dateTo) : null}
            format='DD/MM/YYYY'
            onChange={(date) => handleDateChange("dateTo", date)}
            slotProps={{
              textField: { size: "small", fullWidth: true },
            }}
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
