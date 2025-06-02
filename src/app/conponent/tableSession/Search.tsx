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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { STATUS_SESSION_LABELS } from "@/form/billiardTable";
import { PAYMENT_METHOD_LABELS } from "@/form/payment";
import { useBilliardTables } from "@/app/query/useBilliardTable";
import { Table } from "@/app/type/model/Table";
import { TableSessionFormSearch } from "@/app/type/model/TableSession";
import SearchAutocomplete, { AutocompleteItem } from "../Autocomplete";
import { apiSearchCustomer } from "@/app/api/apiUser";

interface SearchProps {
  setFormSearch: (data: TableSessionFormSearch) => void;
  form: TableSessionFormSearch;
}

const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
  const [formData, setFormData] = useState<TableSessionFormSearch>({ ...form });
  const [item,setItem] = useState<AutocompleteItem|null>(null)
  const selectItem = (item:AutocompleteItem|null) =>{
      handleChange('uidLogin', item ? item?.id.toString() : '')
      setItem(item)
    }
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
   
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 800,
        mx: 'auto',
        backgroundColor: "#f1f1f1",
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
            <InputLabel>Bàn số</InputLabel>
            <Select
              value={formData.tableId}
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
            <InputLabel>Trạng thái</InputLabel>
            <Select
              
              
              value={formData.status}
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
            <InputLabel >Phương thức thanh toán</InputLabel>
            <Select
              
              value={formData.paymentMethod}
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
      <Grid container spacing={2} alignItems="center" >
        <Grid size={{xs:12, sm:6, md:4}}>
          <SearchAutocomplete 
              itemchoice={item}
              label='Nhập tên người tạo'
              fetcher={apiSearchCustomer}
              onSelect={selectItem}
            />
        </Grid>
      </Grid>
      
      {/* Nút tìm kiếm tách riêng */}
        <Box sx={{  marginTop: 1 }}>
              <Button variant="contained" color="primary" onClick={searchData}>
                  Tìm kiếm
              </Button>
        </Box>
      </Box>
    
  );
};

export default Search;
