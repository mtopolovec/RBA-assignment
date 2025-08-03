import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { type CreateClientRequest } from '../types/client';
import { isValidOIB } from '../utils/clientUtils';
import { Status } from '../types/card';

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (client: CreateClientRequest) => Promise<void>;
}

const CreateClientModal = ({
  open,
  onClose,
  onSubmit,
}: CreateClientModalProps) => {
  const [formData, setFormData] = useState<CreateClientRequest>({
    firstName: '',
    lastName: '',
    oib: '',
    status: Status.INACTIVE,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.oib.trim()) {
      newErrors.oib = 'OIB is required';
    } else if (!isValidOIB(formData.oib)) {
      newErrors.oib = 'OIB must be exactly 11 digits';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      oib: '',
      status: Status.INACTIVE,
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  const handleInputChange = (
    field: keyof CreateClientRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Client</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            required
          />

          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            required
          />

          <TextField
            label="OIB"
            value={formData.oib}
            onChange={(e) =>
              handleInputChange(
                'oib',
                e.target.value.replace(/\D/g, '').slice(0, 11)
              )
            }
            error={!!errors.oib}
            helperText={
              errors.oib ||
              'Enter 11-digit Croatian Personal Identification Number'
            }
            fullWidth
            required
            inputProps={{ maxLength: 11 }}
          />

          <FormControl fullWidth required error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) =>
                handleInputChange('status', e.target.value as Status)
              }
            >
              <MenuItem value={Status.INACTIVE}>Inactive</MenuItem>
              <MenuItem value={Status.ACTIVE}>Active</MenuItem>
              <MenuItem value={Status.PENDING}>Pending</MenuItem>
              <MenuItem value={Status.APPROVED}>Approved</MenuItem>
              <MenuItem value={Status.REJECTED}>Rejected</MenuItem>
              <MenuItem value={Status.BLOCKED}>Blocked</MenuItem>
            </Select>
            {errors.status && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.status}
              </Alert>
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Client'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClientModal;
