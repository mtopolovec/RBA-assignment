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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchOib, setSearchOib] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filter clients based on search
  const filterClients = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(
      (client) => client.oib.includes(searchTerm.replace(/\s/g, '')) // Remove spaces for search
    );
    setFilteredClients(filtered);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchOib(value);
    filterClients(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchOib('');
    setFilteredClients(clients);
  };

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
      const sortedClients = sortClientsByLastName(data);
      setClients(sortedClients);
      setFilteredClients(sortedClients); // Initialize filtered clients
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
      // Clear search after creating new client
      handleClearSearch();
      console.log('Client created successfully');
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message || 'Failed to create client');
      throw err;
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
      throw err;
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
      // Clear search after deleting if current search has no results
      if (filteredClients.length === 1 && filteredClients[0].oib === oib) {
        handleClearSearch();
      }
      console.log('Client deleted successfully');
    } catch (err: any) {
      console.error('Error deleting client:', err);
      setError(err.message || 'Failed to delete client');
    }
  };

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
        {/* Header with Search and Create Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          gap={2}
        >
          <Typography variant="h4" component="h1" className="page-title">
            Client Dashboard
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            {/* Search by OIB - Only show if there are clients */}
            {clients.length > 0 && (
              <TextField
                size="small"
                placeholder="Search by OIB..."
                value={searchOib}
                onChange={handleSearchChange}
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchOib && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        title="Clear search"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {/* Create Client Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClient}
              color="primary"
            >
              Create Client
            </Button>
          </Box>
        </Box>

        {/* Search Results Info */}
        {searchOib && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredClients.length === 0 ? (
                <>No clients found matching OIB "{searchOib}"</>
              ) : (
                <>
                  Showing {filteredClients.length} of {clients.length} clients
                </>
              )}
            </Typography>
          </Box>
        )}

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
              {filteredClients.map((client, index) => (
                <TableRow
                  key={client.oib}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleClientClick(client.oib)}
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
                      onClick={(e) => e.stopPropagation()}
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

        {/* Help text */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          💡 Click on any client row to view their cards
        </Typography>

        {/* No clients found */}
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

        {/* No search results */}
        {filteredClients.length === 0 && clients.length > 0 && searchOib && (
          <Box mt={3} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              No clients found matching your search.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearSearch}
              sx={{ mt: 2 }}
            >
              Clear Search
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
