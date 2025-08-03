import type { Status } from './card';

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
