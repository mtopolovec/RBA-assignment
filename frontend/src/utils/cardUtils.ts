import { Status, type Status as StatusType } from '../types/card';

/**
 * Get Material-UI chip color based on card status
 */
export const getCardStatusColor = (
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
 * Get the next status in the cycle
 */
export const getNextCardStatus = (currentStatus: StatusType): StatusType => {
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
 * Format card number for display (mask middle digits)
 */
export const formatCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 8) return cardNumber;

  // For 16-digit cards: 1234 **** **** 5678
  if (cardNumber.length === 16) {
    const first4 = cardNumber.slice(0, 4);
    const last4 = cardNumber.slice(-4);
    return `${first4} **** **** ${last4}`;
  }

  // For other lengths: first4 + middle asterisks + last4
  const first4 = cardNumber.slice(0, 4);
  const last4 = cardNumber.slice(-4);
  const middleLength = cardNumber.length - 8;
  const middle = '*'.repeat(middleLength > 0 ? middleLength : 0);
  return `${first4}${middle}${last4}`;
};

/**
 * Check if a status allows transactions
 */
export const canProcessTransactions = (status: StatusType): boolean => {
  return status === Status.ACTIVE || status === Status.APPROVED;
};

/**
 * Check if a status is pending some action
 */
export const isPendingStatus = (status: StatusType): boolean => {
  return status === Status.PENDING;
};

/**
 * Check if a status indicates a problem
 */
export const isProblemStatus = (status: StatusType): boolean => {
  return status === Status.BLOCKED || status === Status.REJECTED;
};

/**
 * Get status description for tooltips/help text
 */
export const getStatusDescription = (status: StatusType): string => {
  switch (status) {
    case Status.ACTIVE:
      return 'Card is active and ready for transactions';
    case Status.APPROVED:
      return 'Card has been approved and can be activated';
    case Status.PENDING:
      return 'Card activation is pending approval';
    case Status.BLOCKED:
      return 'Card is blocked for security reasons';
    case Status.REJECTED:
      return 'Card application has been rejected';
    case Status.INACTIVE:
      return 'Card is inactive and cannot be used';
    default:
      return 'Unknown card status';
  }
};

/**
 * Convert status to display format (capitalize first letter, lowercase rest)
 */
export const formatStatusDisplay = (status: StatusType): string => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};
