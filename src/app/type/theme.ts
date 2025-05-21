import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
export const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 36,
          
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 36,
        },
        input: {
          height: 36,
        },
      },
    },
    MuiPickersToolbar:{
      styleOverrides:{
        root:{
          height: 36,
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px', // chỉnh kích thước font của label
          transform: 'translate(14px, 8px) scale(1)', // chỉnh vị trí label bình thường
        },
        shrink: {
          transform: 'translate(14px, -9px) scale(0.75)', // khi label thu nhỏ
        },
      },
    },
    MuiPickersInputBase:{
      styleOverrides:{
        root:{
          height: 36
        }
      }
    }
  },
});

export const darkTheme = {
    colors: {
      primary: '#1976D2',          // Xanh dương đậm
      background: '#212121',        // Nền tối
      sidebar: '#263238',           // Sidebar xám xanh
      sidebarHover: '#37474f',      // Hover sidebar
      sidebarActive: '#455a64',     // Active sidebar
      header: '#1E88E5',            // Header xanh sáng
      contentBackground: '#303030', // Nội dung nền xám đậm
      text: '#FFFFFF',              // Text trắng
      subtext: '#B0BEC5',           // Text phụ
      border: '#424242',            // Viền nhẹ
      highlight: '#00E676',         // Màu nhấn (xanh lá)
    },
  };

  