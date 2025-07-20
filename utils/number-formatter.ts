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
  if (parts.length <= 2) {
    // If there's only one dot or none, treat it as decimal separator
    return value.replace(/\./g, '');
  }
  
  // Multiple dots - last one is decimal separator, others are thousand separators
  const decimalPart = parts.pop();
  const integerPart = parts.join('');
  
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
};
