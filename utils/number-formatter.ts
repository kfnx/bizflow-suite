export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const compactNumFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
});

export const formatCurrency = (
  amount: number | string,
  currency: string = 'IDR',
) => {
  // Handle string inputs - convert to number
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return amount;
  }

  let locale = 'id-ID';

  switch (currency) {
    case 'USD':
      locale = 'en-US';
      break;
    case 'RMB':
      locale = 'zh-CN';
      break;
    case 'IDR':
      locale = 'id-ID';
      break;
    default:
      // For unknown currencies, use default locale
      locale = 'id-ID';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export const formatNumberWithDots = (value: string | number): string => {
  if (!value) return '';

  const cleanValue = value.toString().replace(/[^\d.]/g, '');
  const parts = cleanValue.split('.');

  // Format the integer part with dots as thousand separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // For Indonesian format: dots for thousands, comma for decimal
  if (parts.length > 1) {
    return parts[0] + ',' + parts[1];
  }

  return parts[0];
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
