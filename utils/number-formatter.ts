export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const compactNumFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
});

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumberWithDots = (value: string | number): string => {
  if (!value) return '';

  const cleanValue = value.toString().replace(/[^\d.]/g, '');
  const parts = cleanValue.split('.');

  // Format the integer part with dots as thousand separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return parts.join('.');
};

export const parseNumberFromDots = (value: string): string => {
  if (!value) return '';

  // Clean the input - remove any non-digit, non-dot, non-comma characters
  const cleanValue = value.toString().replace(/[^\d.,]/g, '');

  // Handle comma as decimal separator (European style)
  if (cleanValue.includes(',') && !cleanValue.includes('.')) {
    // Only comma - treat as decimal separator
    return cleanValue.replace(',', '.');
  }

  // Handle both dots and commas
  if (cleanValue.includes(',') && cleanValue.includes('.')) {
    // Both present - assume dots are thousand separators, comma is decimal
    return cleanValue.replace(/\./g, '').replace(',', '.');
  }

  // For Indonesian format, dots are always thousand separators
  // Simply remove all dots and return the value
  if (cleanValue.includes('.')) {
    return cleanValue.replace(/\./g, '');
  }

  // No special formatting, return as is
  return cleanValue;
};
