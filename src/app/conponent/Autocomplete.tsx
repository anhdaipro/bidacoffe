import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress ,Box} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

export interface AutocompleteItem {
  id: string | number;
  label: string;
  name:string;
}

interface Props{
  label?:string;
  itemchoice:AutocompleteItem|null,
  fetcher: (search: string) => Promise<AutocompleteItem[]>;   // hàm gọi API trả về data
  onSelect: (item: AutocompleteItem | null) => void;         // callback chọn item
  minSearchLength?: number;         // độ dài tối thiểu để gọi API
}
function useDebounce(value:string, delay:number) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
  
    React.useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
  
      return () => clearTimeout(handler);
    }, [value, delay]);
  
    return debouncedValue;
  }
function SearchAutocomplete<T extends AutocompleteItem>({
  label = 'Tìm kiếm',
  fetcher,
  onSelect,
  itemchoice,
  minSearchLength = 2,
}: Props) {
    const [inputValue, setInputValue] = useState('');
    const [item,setItem] = useState<AutocompleteItem|null>(itemchoice)
    const [isCheck, setIsCheck] = useState(false)
    const debouncedInput = useDebounce(inputValue, 500); // debounce 300ms
    const { data = [], isLoading } = useQuery({
        queryKey: ['items', debouncedInput],
        queryFn: () => fetcher(debouncedInput),
        enabled: debouncedInput.length >= minSearchLength && !isCheck,
    })

  return (
    <Autocomplete
        options={data}
        getOptionLabel={(option) => `${option.label}`}
        inputValue={inputValue}
        onInputChange={(_, value, reason) => {
            setInputValue(value); // Chỉ gọi API khi gõ
            setIsCheck(false)
          }}
        onChange={(_, value) => {
            onSelect(value)
            setInputValue(value?.label || '');
            setIsCheck(true)
            setItem(value)
        }}
        value={item}
        loading={isLoading}
        loadingText={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <CircularProgress size={24} />
            </Box>
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} label={label} />}
        
    />
  );
}

export default SearchAutocomplete;