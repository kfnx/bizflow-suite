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

  // Remove all dots except the last one (decimal separator)
  const parts = value.split('.');
  if (parts.length <= 1) {
    // No dots - just return the value
    return value;
  }

  if (parts.length === 2) {
    // Only one dot - check if it's a decimal separator or thousand separator
    // If the part after the dot has more than 2 digits, it's likely a thousand separator
    // If it has 1-2 digits, it's likely a decimal separator
    const afterDot = parts[1];
    if (afterDot.length <= 2) {
      // Likely decimal separator - keep it
      return value;
    } else {
      // Likely thousand separator - remove it
      return parts.join('');
    }
  }

  // Multiple dots - last one is decimal separator, others are thousand separators
  const decimalPart = parts.pop();
  const integerPart = parts.join('');

  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
};
