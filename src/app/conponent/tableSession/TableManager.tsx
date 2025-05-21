'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableCard from './TableCard';
import TablePopup from './TablePopup';
import { useBilliardTableActive } from '@/app/query/useBilliardTable';
import { useTableStore } from '@/app/store/useTableStore';
import { SessionProps } from '@/app/type/model/TableSession';
import { STATUS_LABELS } from '@/form/billiardTable';
import { useShallow } from 'zustand/shallow';

const TableManager = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<number | 'all'>('all');
  const { setTables, setTableSession, tables, selectedTable } = useTableStore(
    useShallow((state) => ({
      setTables: state.setTables,
      tables: state.tables,
      selectedTable: state.selectedTable,
      setTableSession: state.setTableSession,
    }))
  );
  const { data, isLoading } = useBilliardTableActive() as { data: SessionProps; isLoading: boolean };

  useEffect(() => {
    if (!isLoading) {
      setTables(data.tables);
      setTableSession(data.tableSessions);
    }
  }, [isLoading, data, setTables, setTableSession]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  // Filter tables based on search and status
  const filteredTables = tables.filter((table) => {
    const matchSearch = table.tableNumber.toString().includes(search);
    const matchFilter = filter === 'all' || table.status === filter;
    return matchSearch && matchFilter;
  });

  // Handle filter change
  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: number | 'all') => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header: Search and Filters */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        {/* Search Input */}
        

        {/* Filter Buttons */}
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="table status filter"
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          <ToggleButton
            value="all"
            aria-label="all"
            sx={{
              textTransform: 'none',
              bgcolor: 'grey.100',
              color: 'text.primary',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
          >
            Tất cả
          </ToggleButton>
          {Object.entries(STATUS_LABELS).map(([key, value]) => (
            <ToggleButton
              key={key}
              value={Number(key)}
              aria-label={value}
              sx={{
                textTransform: 'none',
                bgcolor: 'grey.100',
                color: 'text.primary',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
                '&:hover': {
                  bgcolor: 'grey.200',
                },
              }}
            >
              {value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

      </Box>

      {/* Table Grid */}
      <Grid container spacing={2} sx={{  }}>
        {filteredTables.map((table) => (
          <Grid size={{xs:12, sm:6, md:4, lg:3}} key={table.id}>
            <TableCard table={table} />
          </Grid>
        ))}
      </Grid>

      {/* Table Popup */}
      {selectedTable && <TablePopup />}
    </Box>
  );
};

export default TableManager;