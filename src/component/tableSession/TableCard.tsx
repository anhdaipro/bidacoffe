'use client';
import React from 'react';
import { Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useTableStore } from '@/app/store/useTableStore';
import { STATUS_LABELS } from '@/form/billiardTable';
import { Table } from '@/app/type/model/Table';

interface Props {
  table: Table;
}

const TableCard: React.FC<Props> = ({ table }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const selectTable = useTableStore((state) => state.selectTable);

  // Determine background color based on table status
  const bgColor = (() => {
    switch (table.status) {
      case 2: // In use
        return theme.palette.error.main; // #f44336
      case 3: // Maintenance
        return theme.palette.grey[600]; // #9e9e9e
      default: // Available
        return theme.palette.grey[300]; // #e0e0e0
    }
  })();

  const handleSelect = () => {
    selectTable(table);
  };

  return (
    <Card
      onClick={handleSelect}
      sx={{
        minHeight: isMobile ? 120 : 150,
        borderRadius: 3,
        bgcolor: bgColor,
        color: theme.palette.getContrastText(bgColor),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: 3,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
      aria-label={`Table ${table.tableNumber}, status: ${STATUS_LABELS[table.status]}`}
    >
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{ fontWeight: 'bold' }}
        >
          {table.tableNumber}
        </Typography>
        <Typography
          variant={isMobile ? 'body2' : 'body1'}
          sx={{ mt: isMobile ? 0.5 : 1 }}
        >
          {STATUS_LABELS[table.status]}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TableCard;