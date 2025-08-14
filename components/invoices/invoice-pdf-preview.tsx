/* eslint-disable jsx-a11y/alt-text */
'use client';

import React from 'react';
import { Document, PDFViewer } from '@react-pdf/renderer';

import { InvoiceFormData } from '@/lib/validations/invoice';

import { InvoicePDFContent, InvoicePDFData } from './invoice-pdf-content';

interface InvoicePDFPreviewProps {
  formData: InvoiceFormData;
  customerData?: {
    name: string;
    address: string;
    npwp?: string;
    contactPerson?: string;
    contactPersonPrefix?: string;
  };
  branchData?: {
    name: string;
  };
}


export const InvoicePDFPreview = ({
  formData,
  customerData,
  branchData,
}: InvoicePDFPreviewProps) => {
  // Handle cases where formData might be empty or invalid
  if (!formData) {
    return (
      <div className='flex h-full items-center justify-center p-8 text-center'>
        <div>
          <p className='text-text-sub-600'>
            No form data available for preview
          </p>
        </div>
      </div>
    );
  }

  try {
    // Transform InvoiceFormData to InvoicePDFData
    const pdfData: InvoicePDFData = {
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      customerId: formData.customerId,
      contractNumber: formData.contractNumber,
      customerPoNumber: formData.customerPoNumber,
      salesmanUserId: formData.salesmanUserId,
      currency: formData.currency,
      status: formData.status,
      paymentTerms: formData.paymentTerms,
      isIncludePPN: formData.isIncludePPN,
      notes: formData.notes,
      items: formData.items,
    };

    return (
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <Document>
          <InvoicePDFContent
            data={pdfData}
            customerData={customerData}
            mode='preview'
          />
        </Document>
      </PDFViewer>
    );
  } catch (error) {
    console.error('Invoice PDF Preview Error:', error);
    return (
      <div className='flex h-full items-center justify-center p-8 text-center'>
        <div>
          <p className='mb-2 text-text-sub-600'>Error loading PDF preview</p>
          <p className='text-text-sub-400 text-sm'>
            Please check the console for details
          </p>
        </div>
      </div>
    );
  }
};
