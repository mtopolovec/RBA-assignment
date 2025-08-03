/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Using React Router v6+

import {
  type Client,
  type CreateClientRequest,
  type UpdateClientRequest,
} from '../types/client';
import { API_CONFIG } from '../constants/api';
import { sortClientsByLastName, formatOIB } from '../utils/clientUtils';
import CreateClientModal from './CreateClientModal';
import UpdateClientModal from './UpdateClientModal';
import './dashboard.css';
import StatusChip from './StatusChip';

const Dashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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
    setSelectedClient(client);
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (clientData: UpdateClientRequest) => {
    if (!selectedClient) return;
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTS}`,
        {
          method: 'PUT',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.description || `Failed to update client: ${response.status}`
        );
      }

      await fetchClients();
      console.log('Client updated successfully');
    } catch (err: any) {
      console.error('Error updating client:', err);
      setError(err.message || 'Failed to update client');
      throw err; // Re-throw to let modal handle the error
    }
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

  // Navigate to client cards using CARDS_BY_OIB endpoint
  const handleClientClick = (oib: string) => {
    navigate(`/client/${oib}/cards`);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5} sx={{ width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={5} sx={{ width: '100%', px: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" onClick={fetchClients} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: 2 }}>
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

        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>OIB</TableCell>
                <TableCell>Card Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow
                  key={client.oib}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleClientClick(client.oib)} // Make entire row clickable
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{client.firstName}</TableCell>
                  <TableCell>{client.lastName}</TableCell>
                  <TableCell>{formatOIB(client.oib)}</TableCell>
                  <TableCell>
                    <StatusChip
                      status={client.status}
                      size="small"
                      showDot={true}
                      variant="dashboard"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      display="flex"
                      gap={1}
                      justifyContent="center"
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                    >
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleUpdateClient(client)}
                        title="Edit Client"
                      >
                        <EditIcon />
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

        {/* Add helpful text */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          💡 Click on any client row to view their cards
        </Typography>

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

        {/* Update Client Modal */}
        <UpdateClientModal
          open={updateModalOpen}
          client={selectedClient}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedClient(null);
          }}
          onSubmit={handleUpdateSubmit}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
