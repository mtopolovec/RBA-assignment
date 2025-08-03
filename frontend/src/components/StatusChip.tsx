import React from 'react';
import { Chip, Box } from '@mui/material';
import { type Status as StatusType } from '../types/card';
import './statusChip.css';

interface StatusChipProps {
  status: StatusType;
  size?: 'small' | 'medium';
  showDot?: boolean;
  variant?: 'dashboard' | 'card';
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'medium',
  showDot = false,
  variant = 'dashboard',
}) => {
  const getStatusClass = (status: StatusType): string => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case 'active':
        return 'status-active';
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'blocked':
        return 'status-blocked';
      case 'rejected':
        return 'status-rejected';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  const formatDisplayStatus = (status: StatusType): string => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case 'active':
        return 'ACTIVE';
      case 'approved':
        return 'APPROVED';
      case 'pending':
        return 'PENDING';
      case 'blocked':
        return 'BLOCKED';
      case 'rejected':
        return 'REJECTED';
      case 'inactive':
        return 'INACTIVE';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <Box display="flex" alignItems="center">
      {showDot && (
        <span className={`status-dot ${getStatusClass(status)}`}></span>
      )}
      <Chip
        className={`status-chip ${getStatusClass(status)} variant-${variant}`}
        label={formatDisplayStatus(status)}
        size={size}
      />
    </Box>
  );
};

export default StatusChip;
