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

  // Only dots - need to determine if they're thousand separators or decimal
  const parts = cleanValue.split('.');
  if (parts.length <= 1) {
    // No dots - just return the value
    return cleanValue;
  }

  if (parts.length === 2) {
    // Only one dot - check if it's a decimal separator or thousand separator
    // If the part after the dot has more than 2 digits, it's likely a thousand separator
    // If it has 1-2 digits, it's likely a decimal separator
    const afterDot = parts[1];
    if (afterDot.length <= 2 && afterDot.length > 0) {
      // Likely decimal separator - keep it
      return cleanValue;
    } else {
      // Likely thousand separator - remove it
      return parts.join('');
    }
  }

  // Multiple dots - assume they're all thousand separators except possibly the last one
  // Check if the last part looks like a decimal (1-2 digits)
  const lastPart = parts[parts.length - 1];
  if (lastPart.length <= 2 && lastPart.length > 0) {
    // Last part looks like decimal - keep it as decimal separator
    const decimalPart = parts.pop();
    const integerPart = parts.join('');
    return `${integerPart}.${decimalPart}`;
  } else {
    // All dots are thousand separators
    return parts.join('');
  }
};
