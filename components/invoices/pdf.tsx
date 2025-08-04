/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { formatDate } from '@/utils/date-formatter';
import { InvoiceDetail } from '@/hooks/use-invoices';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    padding: 0,
    margin: 0,
    paddingBottom: 80,
  },
  headerImage: {
    width: '100%',
    height: 80,
  },
  content: {
    padding: 30,
  },

  // Title
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textTransform: 'uppercase',
  },

  // Main Content Section
  mainContent: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  // Left Column - Recipient Info
  leftColumn: {
    flex: 1,
    paddingRight: 20,
  },
  recipientSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  recipientName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressLine: {
    fontSize: 10,
    marginBottom: 2,
  },
  npwp: {
    fontSize: 10,
    marginTop: 8,
  },

  // Right Column - Invoice Details
  rightColumn: {
    flex: 1,
    paddingLeft: 20,
  },
  invoiceDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    fontSize: 10,
    flex: 1,
  },

  // Items Table
  tableSection: {
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableCell: {
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  descriptionCell: {
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 2,
    fontSize: 9,
  },
  serialCell: {
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 1.5,
    fontSize: 9,
  },
  quantityCell: {
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 50,
    fontSize: 9,
  },
  priceCell: {
    padding: 8,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 120,
    fontSize: 9,
  },
  totalCell: {
    padding: 8,
    textAlign: 'right',
    width: 120,
    fontSize: 9,
  },

  // Summary Section
  summarySection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
    width: 300,
  },
  summaryLabel: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryValue: {
    width: 150,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 10,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
    marginTop: 5,
  },

  // Thank You Section
  thankYouSection: {
    textAlign: 'center',
    marginBottom: 30,
  },
  thankYouText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // Bank Information Section
  bankSection: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  bankLeft: {
    flex: 1,
    paddingRight: 20,
  },
  bankTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  bankDetailRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bankLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 120,
  },
  bankValue: {
    fontSize: 10,
    flex: 1,
  },

  // Signature Section
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  signatureColumn: {
    flex: 1,
    alignItems: 'center',
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    height: 30,
    marginBottom: 10,
    width: 200,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  signaturePosition: {
    fontSize: 9,
    marginBottom: 3,
    textAlign: 'center',
  },
  signatureCompany: {
    fontSize: 9,
    textAlign: 'center',
  },

  // Disclaimer Section
  disclaimerSection: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  disclaimerText: {
    fontSize: 8,
    lineHeight: 1.2,
  },
});

interface InvoicePDFProps {
  invoice: InvoiceDetail;
}

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatNumber = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
  const subtotal =
    typeof invoice.subtotal === 'string'
      ? parseFloat(invoice.subtotal)
      : invoice.subtotal;
  const tax =
    typeof invoice.tax === 'string' ? parseFloat(invoice.tax) : invoice.tax;
  const total =
    typeof invoice.total === 'string'
      ? parseFloat(invoice.total)
      : invoice.total;

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size='A4' style={styles.page}>
          {/* Header - Fixed to repeat on every page */}
          <Image
            src='/images/document-header.jpg'
            style={styles.headerImage}
            fixed
          />

          <View style={styles.content}>
            {/* Title */}
            <Text style={styles.title}>COMMERCIAL INVOICE</Text>

            {/* Main Content */}
            <View style={styles.mainContent}>
              {/* Left Column - Recipient Info */}
              <View style={styles.leftColumn}>
                <View style={styles.recipientSection}>
                  <Text style={styles.sectionTitle}>TO:</Text>
                  <Text style={styles.recipientName}>
                    {invoice.customerName}
                  </Text>
                  <Text style={styles.addressLine}>
                    {/* Address would come from customer data */}
                    BFI TOWER SUNBURST CBD Lot 1.2 JL. KAPT. SOEBIJANTO
                  </Text>
                  <Text style={styles.addressLine}>
                    DJOJOHADIKUSUMO BSD CITY - TANGERANG SELATAN, 15322
                  </Text>
                  <Text style={styles.npwp}>NPWP: 0757149844211000</Text>
                </View>
              </View>

              {/* Right Column - Invoice Details */}
              <View style={styles.rightColumn}>
                <View style={styles.invoiceDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Invoice No.:</Text>
                    <Text style={styles.detailValue}>
                      {invoice.invoiceNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contract No.:</Text>
                    <Text style={styles.detailValue}>
                      {invoice.contractNumber || '001/PJB/STI-JKI/V/2025'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer PO NO.:</Text>
                    <Text style={styles.detailValue}>
                      {invoice.customerPoNumber || '20250625P000009'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(invoice.invoiceDate)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Term:</Text>
                    <Text style={styles.detailValue}>
                      {invoice.paymentTerms ||
                        '30% DP, 70% BP oleh leasing 30 hari proses'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Salesman:</Text>
                    <Text style={styles.detailValue}>
                      {invoice.createdByUser?.firstName || 'Rino'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Currency:</Text>
                    <Text style={styles.detailValue}>{invoice.currency}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Items Table */}
            <View style={styles.tableSection}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { width: 40 }]}>
                    No.
                  </Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
                    Serial No.
                  </Text>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                    Description
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 50 }]}>
                    Qty.
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>
                    Unit Price
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>
                    Amount
                  </Text>
                </View>

                {/* Table Rows */}
                {invoice.items.map((item, index) => (
                  <View key={item.productId} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: 40 }]}>
                      {index + 1}
                    </Text>
                    <Text style={styles.serialCell}>
                      {item.additionalSpecs || 'CHSRA10AVRB000615'}
                    </Text>
                    <View style={styles.descriptionCell}>
                      <Text>{item.name}</Text>
                      <Text style={{ fontSize: 8, color: '#666666' }}>
                        {item.category || 'SHANTUI-ROLLER-SR 10B6, 2025'}
                      </Text>
                    </View>
                    <Text style={styles.quantityCell}>{item.quantity}</Text>
                    <Text style={styles.priceCell}>
                      Rp {formatNumber(item.unitPrice)}
                    </Text>
                    <Text style={styles.totalCell}>
                      Rp {formatNumber(item.total)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>
                  Rp {formatNumber(subtotal)}
                </Text>
              </View>
              {invoice.isIncludePPN && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>VAT:</Text>
                  <Text style={styles.summaryValue}>
                    Rp {formatNumber(tax)}
                  </Text>
                </View>
              )}
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.summaryValue}>
                  Rp {formatNumber(total)}
                </Text>
              </View>
            </View>

            {/* Thank You Section */}
            <View style={styles.thankYouSection}>
              <Text style={styles.thankYouText}>
                THANK YOU FOR YOUR BUSINESS
              </Text>
            </View>

            {/* Bank Information and Signature */}
            <View style={styles.bankSection}>
              {/* Bank Information */}
              <View style={styles.bankLeft}>
                <Text style={styles.bankTitle}>Please Remit to Us.</Text>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>BANK NAME:</Text>
                  <Text style={styles.bankValue}>Bank Central Asia (BCA)</Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>BRANCH:</Text>
                  <Text style={styles.bankValue}>Pasar Baru</Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>ACCOUNT NAME:</Text>
                  <Text style={styles.bankValue}>PT SAN TRAKTOR INDONESIA</Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>ACCOUNT NUMBER:</Text>
                  <Text style={styles.bankValue}>0028195195</Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>SWIFT CODE:</Text>
                  <Text style={styles.bankValue}></Text>
                </View>
              </View>

              {/* Signature */}
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>
                  Tanda Tangan dan Materai
                </Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Tony Raflv Teh</Text>
                <Text style={styles.signaturePosition}>Direktur Utama</Text>
                <Text style={styles.signatureCompany}>
                  PT SAN TRAKTOR INDONESIA
                </Text>
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerSection}>
              <Text style={styles.disclaimerTitle}>ATTENTION</Text>
              <Text style={styles.disclaimerText}>
                When within 14 days from the date of the Invoice and Tax Invoice
                received no objections from the customer, the customer is deemed
                to have agreed to everything contained in this Invoice and Tax
                Invoice.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
