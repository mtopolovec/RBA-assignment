import { type Client } from '../types/client';
import { Status, type Status as StatusType } from '../types/card';

/**
 * Get Material-UI chip color based on client card status
 */
export const getStatusColor = (
  status: StatusType
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
 * Get the next status in the cycle for card status changes
 */
export const getNextStatus = (currentStatus: StatusType): StatusType => {
  const statusValues: StatusType[] = [
    Status.INACTIVE,
    Status.PENDING,
    Status.APPROVED,
    Status.ACTIVE,
    Status.BLOCKED,
    Status.REJECTED,
  ];

  const currentIndex = statusValues.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % statusValues.length;
  return statusValues[nextIndex];
};

/**
 * Check if status is valid
 */
export const isValidCardStatus = (status: string): status is StatusType => {
  return Object.values(Status).includes(status as StatusType);
};

/**
 * Get status display name (formatted for UI)
 */
export const getStatusDisplayName = (status: StatusType): string => {
  return status.charAt(0) + status.slice(1).toLowerCase();
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

/**
 * Filter clients by card status
 */
export const filterClientsByStatus = (
  clients: Client[],
  targetStatus: StatusType
): Client[] => {
  return clients.filter((client) => client.status === targetStatus);
};

/**
 * Get card status statistics for dashboard
 */
export const getCardStatusStats = (clients: Client[]) => {
  const stats = {
    [Status.ACTIVE]: 0,
    [Status.APPROVED]: 0,
    [Status.PENDING]: 0,
    [Status.BLOCKED]: 0,
    [Status.REJECTED]: 0,
    [Status.INACTIVE]: 0,
    total: clients.length,
  };

  clients.forEach((client) => {
    // eslint-disable-next-line no-prototype-builtins
    if (stats.hasOwnProperty(client.status)) {
      stats[client.status as keyof typeof stats]++;
    }
  });

  return stats;
};

/**
 * Get status priority for sorting (higher number = higher priority)
 */
export const getStatusPriority = (status: StatusType): number => {
  switch (status) {
    case Status.REJECTED:
      return 6; // Highest priority - needs attention
    case Status.BLOCKED:
      return 5; // High priority - security issue
    case Status.PENDING:
      return 4; // Needs action
    case Status.APPROVED:
      return 3; // Ready to activate
    case Status.ACTIVE:
      return 2; // Normal operation
    case Status.INACTIVE:
      return 1; // Lowest priority
    default:
      return 0;
  }
};

/**
 * Sort clients by status priority (highest priority first)
 */
export const sortClientsByStatusPriority = (clients: Client[]): Client[] => {
  return [...clients].sort((a, b) => {
    const priorityA = getStatusPriority(a.status);
    const priorityB = getStatusPriority(b.status);
    return priorityB - priorityA; // Higher priority first
  });
};
