export interface QuotationItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreateQuotationRequest {
  quotationDate: string;
  validUntil: string;
  customerId: string;
  approverId: string;
  isIncludePPN?: boolean;
  currency?: string;
  notes?: string;
  termsAndConditions?: string;
  items: QuotationItem[];
}

export interface UpdateQuotationRequest {
  quotationDate?: string;
  validUntil?: string;
  customerId?: string;
  approverId?: string;
  isIncludePPN?: boolean;
  currency?: string;
  notes?: string;
  termsAndConditions?: string;
  items?: QuotationItem[];
}
