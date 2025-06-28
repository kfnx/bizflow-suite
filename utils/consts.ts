export const CHART_COLORS = [
  'bg-away-base',
  'bg-sky-500',
  'bg-feature-base',
  'bg-information-base',
  'bg-warning-base',
  'bg-error-base',
  'bg-success-base',
  'bg-verified-base',
  'bg-highlighted-base',
  'bg-stable-base',
] as const;

export const LABEL_COLORS = {
  yellow: {
    bg: 'bg-away-base',
    text: 'text-away-base',
  },
  sky: {
    bg: 'bg-verified-base',
    text: 'text-verified-base',
  },
  purple: {
    bg: 'bg-feature-base',
    text: 'text-feature-base',
  },
  red: {
    bg: 'bg-error-base',
    text: 'text-error-base',
  },
  pink: {
    bg: 'bg-highlighted-base',
    text: 'text-highlighted-base',
  },
  teal: {
    bg: 'bg-stable-base',
    text: 'text-stable-base',
  },
  green: {
    bg: 'bg-success-base',
    text: 'text-success-base',
  },
  orange: {
    bg: 'bg-warning-base',
    text: 'text-warning-base',
  },
  blue: {
    bg: 'bg-information-base',
    text: 'text-information-base',
  },
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = {
  EXCAVATOR: 'excavator',
  BULLDOZER: 'bulldozer',
  WHEEL_LOADER: 'wheel_loader',
  DUMP_TRUCK: 'dump_truck',
  CRANE: 'crane',
  MOTOR_GRADER: 'motor_grader',
  COMPACTOR: 'compactor',
  FORKLIFT: 'forklift',
} as const;

export type ProductCategory =
  (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES];

// Utility function to format category for display
export const formatCategory = (category: string): string => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get all category options for select components
export const getCategoryOptions = () => {
  return Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => ({
    label: formatCategory(value),
    value: value,
  }));
};

// Product Conditions
export const PRODUCT_CONDITIONS = {
  NEW: 'new',
  USED: 'used',
  REFURBISHED: 'refurbished',
} as const;

export type ProductCondition =
  (typeof PRODUCT_CONDITIONS)[keyof typeof PRODUCT_CONDITIONS];

// Product Status
export const PRODUCT_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

// Get condition options for select components
export const getConditionOptions = () => {
  return Object.entries(PRODUCT_CONDITIONS).map(([key, value]) => ({
    label: formatCategory(value),
    value: value,
  }));
};

// Get status options for select components
export const getStatusOptions = () => {
  return Object.entries(PRODUCT_STATUS).map(([key, value]) => ({
    label: formatCategory(value),
    value: value,
  }));
};
