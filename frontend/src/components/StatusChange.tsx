import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  SwapHoriz as StatusIcon,
  CheckCircle as ActiveIcon,
  Pending as PendingIcon,
  Block as BlockedIcon,
  Cancel as InactiveIcon,
  CheckCircleOutline as ApprovedIcon,
  Error as RejectedIcon,
} from '@mui/icons-material';
import { Status, type Status as StatusType } from '../types/card';
import { type UpdateStatusRequest } from '../types/client';
import { API_CONFIG } from '../constants/api';
import StatusChip from './StatusChip';

interface StatusChangeDropdownProps {
  currentStatus: StatusType;
  oib: string;
  onStatusChange?: (newStatus: StatusType) => void;
  disabled?: boolean;
  variant?: 'button' | 'chip';
}

const StatusChangeDropdown: React.FC<StatusChangeDropdownProps> = ({
  currentStatus,
  oib,
  onStatusChange,
  disabled = false,
  variant = 'button',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case Status.ACTIVE:
        return <ActiveIcon color="success" />;
      case Status.APPROVED:
        return <ApprovedIcon color="success" />;
      case Status.PENDING:
        return <PendingIcon color="warning" />;
      case Status.BLOCKED:
        return <BlockedIcon color="error" />;
      case Status.REJECTED:
        return <RejectedIcon color="error" />;
      case Status.INACTIVE:
        return <InactiveIcon color="disabled" />;
      default:
        return <StatusIcon />;
    }
  };

  const getStatusLabel = (status: StatusType): string => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const handleStatusChange = async (newStatus: StatusType) => {
    if (newStatus === currentStatus) {
      handleClose();
      return;
    }

    try {
      setLoading(true);

      const requestBody: UpdateStatusRequest = {
        oib,
        status: newStatus,
      };

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHANGE_STATUS}`,
        {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      // Call the callback to refresh data
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      console.log(`Status changed from ${currentStatus} to ${newStatus}`);
    } catch (error) {
      console.error('Error changing status:', error);
      // You might want to show a toast/snackbar here
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const availableStatuses = Object.values(Status).filter(
    (status) => status !== currentStatus
  );

  if (variant === 'chip') {
    return (
      <>
        <Button
          onClick={handleClick}
          disabled={disabled || loading}
          size="small"
          endIcon={
            loading ? <CircularProgress size={16} /> : <ExpandMoreIcon />
          }
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          <StatusChip status={currentStatus} size="small" variant="dashboard" />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: { minWidth: 200 },
          }}
        >
          <MenuItem disabled sx={{ opacity: 1 }}>
            <ListItemText
              primary="Change Status To:"
              primaryTypographyProps={{
                variant: 'caption',
                fontWeight: 'bold',
              }}
            />
          </MenuItem>
          <Divider />

          {availableStatuses.map((status) => (
            <MenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={loading}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {getStatusIcon(status)}
              </ListItemIcon>
              <ListItemText primary={getStatusLabel(status)} />
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={16} /> : <StatusIcon />}
        endIcon={<ExpandMoreIcon />}
        size="small"
      >
        Change Status
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 250 },
        }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemText
            primary={`Current: ${getStatusLabel(currentStatus)}`}
            secondary="Select new status:"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>
        <Divider />

        {availableStatuses.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={loading}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {getStatusIcon(status)}
            </ListItemIcon>
            <ListItemText
              primary={getStatusLabel(status)}
              secondary={getStatusDescription(status)}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Helper function for status descriptions
const getStatusDescription = (status: StatusType): string => {
  switch (status) {
    case Status.ACTIVE:
      return 'Ready for transactions';
    case Status.APPROVED:
      return 'Approved, ready to activate';
    case Status.PENDING:
      return 'Awaiting approval';
    case Status.BLOCKED:
      return 'Blocked for security';
    case Status.REJECTED:
      return 'Application denied';
    case Status.INACTIVE:
      return 'Not active';
    default:
      return '';
  }
};

export default StatusChangeDropdown;
