export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    CLIENTS: '/api/v1/clients',
    CLIENT_BY_OIB: (oib: string) => `/api/v1/clients/${oib}`,
    CARDS: '/api/v1/cards',
    NEW_CARD_REQUEST: '/api/v1/card-request',
    CHANGE_STATUS: '/api/v1/card-status',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
