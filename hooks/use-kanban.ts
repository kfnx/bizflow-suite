'use client';

import { useQuery } from '@tanstack/react-query';

import { usePendingImports } from './use-imports';
import { usePendingQuotations } from './use-pending-quotations';

export type QuotationItem = {
  id: string;
  quotationNumber: string;
  total: string;
  status: string;
  customerId: string;
  createdAt: string;
};

export type InvoiceItem = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  total: string;
  status: string;
  createdAt: string;
};

export type DeliveryNoteItem = {
  id: string;
  deliveryNumber: string;
  customerId: string;
  deliveryMethod: string;
  vehicleNumber: string | null;
  status: string;
  receivedBy: string | null;
  createdAt: string;
};

export type PendingQuotationItem = {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  customerName: string | null;
  total: string;
  status: string;
  createdAt: string;
};

export type PendingImportItem = {
  id: string;
  supplierName: string | null;
  supplierCode: string | null;
  warehouseName: string | null;
  importDate: string;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  exchangeRateRMBtoIDR: number;
  notes: string | null;
  createdAt: string;
};

export type KanbanData = {
  quotations: QuotationItem[];
  invoices: InvoiceItem[];
  deliveryNotes: DeliveryNoteItem[];
  pendingQuotations: PendingQuotationItem[];
  pendingImports: PendingImportItem[];
};

const fetchKanbanData = async (): Promise<{ data: KanbanData }> => {
  const url = `/api/kanban-board`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch kanban-board data');
  }
  return response.json();
};

export function useKanban() {
  return useQuery({
    queryKey: ['kanban'],
    queryFn: () => fetchKanbanData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
