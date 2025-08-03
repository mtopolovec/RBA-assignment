/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SwapHoriz as StatusIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

import {
  type Client,
  type UpdateStatusRequest,
  type CreateClientRequest,
} from '../types/client';
import { API_CONFIG } from '../constants/api';
import {
  getStatusColor,
  getNextStatus,
  sortClientsByLastName,
  formatOIB,
} from '../utils/clientUtils';
import CreateClientModal from './CreateClientModal';
import './dashboard.css';

const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTS}`,
        {
          method: 'GET',
          headers: API_CONFIG.HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch clients: ${response.status} ${response.statusText}`
        );
      }

      const data: Client[] = await response.json();
      setClients(sortClientsByLastName(data));
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateClient = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async (clientData: CreateClientRequest) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTS}`,
        {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.description || `Failed to create client: ${response.status}`
        );
      }

      await fetchClients();
      console.log('Client created successfully');
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message || 'Failed to create client');
      throw err; // Re-throw to let modal handle the error
    }
  };

  const handleUpdateClient = (client: Client) => {
    // TODO: Implement update client modal/form
    console.log('Update client:', client);
  };

  const handleDeleteClient = async (oib: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT_BY_OIB(oib)}`,
        {
          method: 'DELETE',
          headers: API_CONFIG.HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete client: ${response.status}`);
      }

      await fetchClients();
      console.log('Client deleted successfully');
    } catch (err: any) {
      console.error('Error deleting client:', err);
      setError(err.message || 'Failed to delete client');
    }
  };

  const handleChangeStatus = async (client: Client) => {
    try {
      const newStatus = getNextStatus(client.status);

      const requestBody: UpdateStatusRequest = {
        oib: client.oib,
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

      await fetchClients();
      console.log('Status updated successfully');
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box mt={5}>
          <Alert severity="error">{error}</Alert>
          <Button variant="outlined" onClick={fetchClients} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        {/* Header with Create Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Client Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClient}
            color="primary"
          >
            Create Client
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>OIB</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={client.oib}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{client.firstName}</TableCell>
                  <TableCell>{client.lastName}</TableCell>
                  <TableCell>{formatOIB(client.oib)}</TableCell>
                  <TableCell>
                    <Chip
                      label={client.status}
                      color={getStatusColor(client.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleUpdateClient(client)}
                        title="Edit Client"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleChangeStatus(client)}
                        title="Change Status"
                      >
                        <StatusIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClient(client.oib)}
                        title="Delete Client"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {clients.length === 0 && (
          <Box mt={3} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              No clients found.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateClient}
              sx={{ mt: 2 }}
            >
              Create Your First Client
            </Button>
          </Box>
        )}

        {/* Create Client Modal */}
        <CreateClientModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      </Box>
    </Container>
  );
};

export default Dashboard;
