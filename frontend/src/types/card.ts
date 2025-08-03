export interface Card {
  cardNumber: string;
  oib: string;
  status: Status;
}

export const Status = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface ChangeCardStatusRequest {
  oib: string;
  status: Status;
}
