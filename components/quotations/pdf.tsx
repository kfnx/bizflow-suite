/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, PDFViewer } from '@react-pdf/renderer';

import { QuotationDetail } from '@/hooks/use-quotations';

import { QuotationPDFContent, QuotationPDFData } from './quotation-pdf-content';

interface QuotationPDFProps {
  quotation: QuotationDetail;
}

export const QuotationPDF = ({ quotation }: QuotationPDFProps) => {
  // Transform QuotationDetail to QuotationPDFData
  const pdfData: QuotationPDFData = {
    quotationNumber: quotation.quotationNumber,
    quotationDate: quotation.quotationDate,
    validUntil: quotation.validUntil,
    isIncludePPN: quotation.isIncludePPN,
    notes: quotation.notes || undefined,
    termsAndConditions: quotation.termsAndConditions,
    customerName: quotation.customerName,
    customerAddress: quotation.customerAddress,
    customerContactPerson: quotation.customerContactPerson,
    customerContactPersonPrefix: quotation.customerContactPersonPrefix,
    items: quotation.items,
    subtotal: quotation.subtotal,
    tax: quotation.tax,
    total: quotation.total,
    createdByUser: quotation.createdByUser,
    createdByUserPrefix: quotation.createdByUserPrefix,
    createdByUserFirstName: quotation.createdByUserFirstName,
    createdByUserLastName: quotation.createdByUserLastName,
    createdByUserPhone: quotation.createdByUserPhone,
    approvedByUserPrefix: quotation.approvedByUserPrefix,
    approvedByUserFirstName: quotation.approvedByUserFirstName,
    approvedByUserLastName: quotation.approvedByUserLastName,
    approvedByUserPhone: quotation.approvedByUserPhone,
  };

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <QuotationPDFContent data={pdfData} mode='final' />
      </Document>
    </PDFViewer>
  );
};
