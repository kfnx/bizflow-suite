/* eslint-disable jsx-a11y/alt-text */
'use client';

import React from 'react';
import { Document, PDFViewer } from '@react-pdf/renderer';

import { QuotationFormData } from '@/lib/validations/quotation';

import { QuotationPDFContent, QuotationPDFData } from './quotation-pdf-content';

interface QuotationPDFPreviewProps {
  formData: QuotationFormData;
  customerData?: {
    name: string;
    address: string;
    contactPerson?: string;
    contactPersonPrefix?: string;
  };
  branchData?: {
    name: string;
  };
  userDataForPDF?: {
    createdByUserPrefix?: string;
    createdByUserFirstName?: string;
    createdByUserLastName?: string;
    createdByUserPhone?: string;
    approvedByUserPrefix?: string;
    approvedByUserFirstName?: string;
    approvedByUserLastName?: string;
    approvedByUserPhone?: string;
  };
}

export const QuotationPDFPreview = ({
  formData,
  customerData,
  branchData,
  userDataForPDF,
}: QuotationPDFPreviewProps) => {
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
    // Transform QuotationFormData to QuotationPDFData
    const pdfData: QuotationPDFData = {
      quotationNumber: formData.quotationNumber,
      quotationDate: formData.quotationDate,
      validUntil: formData.validUntil,
      isIncludePPN: formData.isIncludePPN,
      notes: formData.notes,
      termsAndConditions: formData.termsAndConditions,
      items: formData.items,
      // Include user data if available
      ...(userDataForPDF && {
        createdByUserPrefix: userDataForPDF.createdByUserPrefix,
        createdByUserFirstName: userDataForPDF.createdByUserFirstName,
        createdByUserLastName: userDataForPDF.createdByUserLastName,
        createdByUserPhone: userDataForPDF.createdByUserPhone,
        approvedByUserPrefix: userDataForPDF.approvedByUserPrefix,
        approvedByUserFirstName: userDataForPDF.approvedByUserFirstName,
        approvedByUserLastName: userDataForPDF.approvedByUserLastName,
        approvedByUserPhone: userDataForPDF.approvedByUserPhone,
      }),
    };

    return (
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <Document>
          <QuotationPDFContent
            data={pdfData}
            customerData={customerData}
            mode='preview'
          />
        </Document>
      </PDFViewer>
    );
  } catch (error) {
    console.error('PDF Preview Error:', error);
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
