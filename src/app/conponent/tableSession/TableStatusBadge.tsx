import React from 'react';
import styled from 'styled-components';

const Badge = styled.div<{color: string}>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: ${({ color }) => color};
  color: white;
  font-size: 12px;
`;

interface Props {
  status: number;
}

const TableStatusBadge: React.FC<Props> = ({ status }) => {
  let label = '';
  let color = '';

  if (status === 1) {
    label = 'Available';
    color = '#4caf50';
  } else if (status === 2) {
    label = 'In Use';
    color = '#f44336';
  } else if (status === 3) {
    label = 'Maintenance';
    color = '#ff9800';
  }

  return <Badge color={color}>{label}</Badge>;
};

export default TableStatusBadge;
