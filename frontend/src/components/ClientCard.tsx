/* eslint-disable @typescript-eslint/no-explicit-any */
import './clientCard.css';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { type Card as CardType } from '../types/card';
import { type Client } from '../types/client';
import { API_CONFIG } from '../constants/api';
import { formatCardNumber } from '../utils/cardUtils';
import StatusChip from './StatusChip';
import StatusChangeDropdown from './StatusChange';

const ClientCard = () => {
  const { oib } = useParams<{ oib: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardType | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loadingClient, setLoadingClient] = useState<boolean>(true);
  const [loadingCard, setLoadingCard] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Fetch client details first
  const fetchClient = async () => {
    if (!oib) return;

    try {
      setLoadingClient(true);
      setError(null);

      console.log('Fetching client details...');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT_BY_OIB(oib)}`,
        {
          method: 'GET',
          headers: API_CONFIG.HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch client: ${response.status}`);
      }

      const clientData: Client = await response.json();
      setClient(clientData);
      console.log('Client loaded successfully:', clientData);

      // Step 2: After client loads, fetch the card
      await fetchCard();
    } catch (err: any) {
      console.error('Error fetching client:', err);
      setError(err.message || 'Failed to fetch client');
    } finally {
      setLoadingClient(false);
    }
  };

  // Step 2: Fetch card details after client is loaded
  const fetchCard = async () => {
    if (!oib) return;

    try {
      setLoadingCard(true);
      setError(null);

      console.log('Fetching card details...');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARDS_BY_OIB(oib)}`,
        {
          method: 'GET',
          headers: API_CONFIG.HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch card: ${response.status}`);
      }

      const data = await response.json();
      console.log('Card loaded successfully:', data);

      // Handle both array and single object responses
      let cardData: CardType | null = null;

      if (Array.isArray(data)) {
        cardData = data.length > 0 ? data[0] : null;
      } else if (data && typeof data === 'object' && data.cardNumber) {
        cardData = data as CardType;
      }

      setCard(cardData);

      if (!cardData) {
        console.warn('No card found for OIB:', oib);
      }
    } catch (err: any) {
      console.error('Error fetching card:', err);
      setError(err.message || 'Failed to fetch card');
    } finally {
      setLoadingCard(false);
    }
  };

  // Start the flow when component mounts
  useEffect(() => {
    if (oib) {
      fetchClient(); // This will trigger fetchCard() after client loads
    }
  }, [oib]);

  // Show loading while client is being fetched
  if (loadingClient) {
    return (
      <Box display="flex" justifyContent="center" mt={5} sx={{ width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box mt={5} sx={{ width: '100%', px: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" onClick={fetchClient} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Box mt={5}>
        {/* Header with Back Button - Matching Dashboard Layout */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={() => navigate('/')}
              color="primary"
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" className="page-title">
              Card for {client?.firstName} {client?.lastName}
            </Typography>
          </Box>
          {/* Optional: Add breadcrumbs */}
          <Breadcrumbs sx={{ fontSize: '0.875rem' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{ textDecoration: 'none', color: 'primary.main' }}
            >
              Dashboard
            </Link>
            <Typography variant="body2" color="text.primary">
              Card Details
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Show loading for card data */}
        {loadingCard && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress size={30} />
          </Box>
        )}

        {/* Show card details when loaded */}
        {!loadingCard && (
          <>
            {card ? (
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {/* Credit Card Design */}
                <Box className="credit-card-container">
                  <Box
                    className={`credit-card status-${card.status.toLowerCase()}`}
                  >
                    {/* Card Header */}
                    <Box className="card-header">
                      <Typography className="bank-name" variant="h6">
                        RBA BANK
                      </Typography>
                      <CreditCardIcon className="card-icon" />
                    </Box>

                    {/* Card Number */}
                    <Box className="card-number-container">
                      <Typography className="card-number" variant="h5">
                        {formatCardNumber(card.cardNumber)}
                      </Typography>
                    </Box>

                    {/* Card Footer */}
                    <Box className="card-footer">
                      <Box className="cardholder-info">
                        <Typography className="card-label" variant="body2">
                          CARDHOLDER
                        </Typography>
                        <Typography className="cardholder-name" variant="body1">
                          {client?.firstName?.toUpperCase()}{' '}
                          {client?.lastName?.toUpperCase()}
                        </Typography>
                      </Box>
                      <Box className="oib-info">
                        <Typography className="card-label" variant="body2">
                          OIB
                        </Typography>
                        <Typography className="oib-number" variant="body1">
                          {card.oib}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Card Status and Controls - Using Paper like Dashboard */}
                <Paper
                  className={`status-controls-paper status-${card.status.toLowerCase()}`}
                  sx={{ p: 3, mb: 3 }}
                >
                  <Stack spacing={3}>
                    <Typography variant="h6" gutterBottom>
                      Card Status & Controls
                    </Typography>

                    {/* Current Status Display */}
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Current Status
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <StatusChip
                          status={card.status}
                          size="medium"
                          variant="card"
                        />
                      </Box>
                    </Box>

                    {/* Status Change Dropdown */}
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Change Status
                      </Typography>
                      <StatusChangeDropdown
                        currentStatus={card.status}
                        oib={card.oib}
                        onStatusChange={() => {
                          // Refresh card data after status change
                          fetchCard();
                        }}
                        variant="button"
                      />
                    </Box>
                  </Stack>
                </Paper>

                {/* Card Information Summary - Using Paper like Dashboard */}
                <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body2" color="text.secondary">
                    💳 <strong>Card Number:</strong>{' '}
                    {formatCardNumber(card.cardNumber)} | 🆔{' '}
                    <strong>OIB:</strong> {card.oib} | 📊{' '}
                    <strong>Status:</strong> {card.status}
                  </Typography>
                </Paper>

                {/* Helpful text - Matching Dashboard style */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  💡 Use the button above to change the card status
                </Typography>
              </Box>
            ) : (
              <Box mt={3} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                  No card found for this client.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  sx={{ mt: 2 }}
                  startIcon={<ArrowBackIcon />}
                >
                  Back to Dashboard
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ClientCard;
