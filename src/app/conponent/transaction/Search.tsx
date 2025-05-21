import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    InputLabel,
    Select,
    FormControl,
  } from "@mui/material";
  import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import dayjs from "dayjs";
  import { useState } from "react";
  import { TRANSACTION_TYPE_LABELS } from "@/form/transaction";
  
  export interface FormSearch {
    status: string;
    type: string;
    codeNo: string;
    dateFrom: string;
    dateTo: string;
  }
  
  interface SearchProps {
    setFormSearch: (data: FormSearch) => void;
    form: FormSearch;
  }
  
  const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
    const [formData, setFormData] = useState<FormSearch>({
      status: form.status,
      type: form.type,
      codeNo: form.codeNo,
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
    });
  
    const setForm = (key: string, value: string) => {
      setFormData({ ...formData, [key]: value });
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
        <Grid container spacing={3}>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              label="Mã"
              variant="outlined"
              value={formData.codeNo}
              onChange={(e) => setForm("codeNo", e.target.value)}
            />
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <InputLabel>Loại</InputLabel>
              <Select
                value={formData.type}
                label="Loại"
                onChange={(e) => setForm("type", e.target.value)}
              >
                <MenuItem value="">Chọn loại</MenuItem>
                {Object.entries(TRANSACTION_TYPE_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
  
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <label style={{ marginBottom: 4 }}>Từ ngày</label>
              <DatePicker
                className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                value={formData.dateFrom ? dayjs(formData.dateFrom) : null}
                format='DD/MM/YYYY'
                onChange={(date) => {
                  if (date) {
                    const dateString = dayjs(date).format("YYYY-MM-DD");
                    setForm("dateFrom", dateString);
                  } else {
                    setForm("dateFrom", "");
                  }
                }}
                
              />
            </FormControl>
          </Grid>
  
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <label style={{ marginBottom: 4 }}>Đến ngày</label>
              <DatePicker
                className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                value={formData.dateTo ? dayjs(formData.dateTo) : null}
                format='DD/MM/YYYY'
                onChange={(date) => {
                  if (date) {
                    const dateString = dayjs(date).format("YYYY-MM-DD");
                    setForm("dateTo", dateString);
                  } else {
                    setForm("dateTo", "");
                  }
                }}
                
              />
            </FormControl>
          </Grid>
  
          <Grid size={{xs:12}}>
            <Box >
              <Button variant="contained" color="primary" onClick={searchData}>
                Tìm kiếm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
     </LocalizationProvider>
    );
  };
  
  export default Search;
  