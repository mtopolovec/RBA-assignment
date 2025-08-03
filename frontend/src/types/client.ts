export const Status = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface Client {
  firstName: string;
  lastName: string;
  oib: string;
  status: Status;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  oib: string;
  status: Status;
}

export interface GetClientByOibRequest {
  oib: string;
}

export interface UpdateClientRequest {
  firstName: string;
  lastName: string;
  oib: string;
  status: Status;
}

export interface UpdateStatusRequest {
  oib: string;
  status: Status;
}

export interface ApiErrorResponse {
  code?: string;
  id?: string;
  description: string;
}
