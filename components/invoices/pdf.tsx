/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Document,
  PDFViewer,
} from '@react-pdf/renderer';

import { InvoiceDetail } from '@/hooks/use-invoices';

import { InvoicePDFContent, InvoicePDFData } from './invoice-pdf-content';

interface InvoicePDFProps {
  invoice: InvoiceDetail;
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
  // Transform InvoiceDetail to InvoicePDFData
  const pdfData: InvoicePDFData = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    customerId: invoice.customerId,
    contractNumber: invoice.contractNumber,
    customerPoNumber: invoice.customerPoNumber,
    salesmanUserId: invoice.salesmanUserId,
    currency: invoice.currency,
    status: invoice.status,
    paymentTerms: invoice.paymentTerms,
    isIncludePPN: invoice.isIncludePPN,
    notes: invoice.notes,
    customerName: invoice.customerName,
    items: invoice.items.map(item => ({
      productId: item.productId,
      name: item.name,
      category: item.category,
      serialNumber: item.serialNumber,
      partNumber: item.partNumber,
      additionalSpecs: item.additionalSpecs,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    createdByUser: invoice.createdByUser,
    salesmanUser: invoice.salesmanUser,
    branchName: invoice.branchName,
  };

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <InvoicePDFContent
          data={pdfData}
          mode='final'
        />
      </Document>
    </PDFViewer>
  );
};
