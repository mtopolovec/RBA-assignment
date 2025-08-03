import { type Client, Status } from '../types/client';

/**
 * Get Material-UI chip color based on client status
 */
export const getStatusColor = (
  status: Status
): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case Status.ACTIVE:
    case Status.APPROVED:
      return 'success';
    case Status.PENDING:
      return 'warning';
    case Status.REJECTED:
    case Status.BLOCKED:
      return 'error';
    case Status.INACTIVE:
    default:
      return 'default';
  }
};

/**
 * Get the next status in the cycle
 */
export const getNextStatus = (currentStatus: Status): Status => {
  const statusValues = [
    Status.INACTIVE,
    Status.ACTIVE,
    Status.PENDING,
    Status.APPROVED,
    Status.REJECTED,
    Status.BLOCKED,
  ];
  const currentIndex = statusValues.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % statusValues.length;
  return statusValues[nextIndex];
};

/**
 * Sort clients alphabetically by last name
 */
export const sortClientsByLastName = (clients: Client[]): Client[] => {
  return [...clients].sort((a, b) => a.lastName.localeCompare(b.lastName));
};

/**
 * Format OIB for display (add spaces for readability)
 */
export const formatOIB = (oib: string): string => {
  if (!oib || oib.length !== 11) return oib;
  return `${oib.slice(0, 3)} ${oib.slice(3, 6)} ${oib.slice(6, 9)} ${oib.slice(
    9
  )}`;
};

/**
 * Validate OIB format (Croatian Personal Identification Number)
 */
export const isValidOIB = (oib: string): boolean => {
  if (!oib || oib.length !== 11) return false;
  return /^\d{11}$/.test(oib);
};
