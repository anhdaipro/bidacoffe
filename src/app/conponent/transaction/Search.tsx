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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import { useState } from "react";
import { TRANSACTION_TYPE_LABELS } from "@/form/transaction";
import { TransactionFormSearch } from "@/app/type/model/Transaction";
import SearchAutocomplete, { AutocompleteItem } from "../Autocomplete";
import { apiSearchCustomer } from "@/app/api/apiUser";
  

  interface SearchProps {
    setFormSearch: (data: TransactionFormSearch) => void;
    form: TransactionFormSearch;
  }
  
  const Search: React.FC<SearchProps> = ({ setFormSearch, form }) => {
    const [formData, setFormData] = useState<TransactionFormSearch>({
      ...form
    });
    const [item,setItem] = useState<AutocompleteItem|null>(null)
    const selectItem = (item:AutocompleteItem|null) =>{
        handleChange('uidLogin', item ? item?.id.toString() : '')
        setItem(item)
      }
    const handleChange = (
      key: string,
      value: string | number
    ) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
    const setForm = (key: string, value: string) => {
      setFormData({ ...formData, [key]: value });
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
        <Grid container spacing={2}>
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
              <DatePicker
                className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                value={formData.dateFrom ? dayjs(formData.dateFrom) : null}
                format='DD/MM/YYYY'
                label="Từ"
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
              <DatePicker
                className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                value={formData.dateTo ? dayjs(formData.dateTo) : null}
                format='DD/MM/YYYY'
                label="Đến"
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
          <Grid size={{xs:12, md:6}}>
            <SearchAutocomplete 
              itemchoice={item}
              label='Nhập tên người tạo'
              fetcher={apiSearchCustomer}
              onSelect={selectItem}
            />
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
     
    );
  };
  
  export default Search;
  