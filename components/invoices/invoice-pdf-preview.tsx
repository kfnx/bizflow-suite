/* eslint-disable jsx-a11y/alt-text */
'use client';

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

import { InvoiceFormData } from '@/lib/validations/invoice';

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
    marginBottom: 20,
  },
  content: {
    padding: '10px 30px 10px',
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
  },
  recipientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressLine: {
    fontSize: 10,
    marginBottom: 3,
    lineHeight: 1.2,
  },
  npwp: {
    fontSize: 10,
    marginTop: 8,
    fontWeight: 'bold',
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
    width: 100,
    fontWeight: 'bold',
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
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    padding: 8,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    padding: 8,
  },
  tableCell: {
    textAlign: 'center',
    fontSize: 9,
  },
  descriptionCell: {
    textAlign: 'left',
    fontSize: 9,
    flex: 3,
  },
  quantityCell: {
    textAlign: 'center',
    fontSize: 9,
    flex: 1,
  },
  priceCell: {
    textAlign: 'right',
    fontSize: 9,
    flex: 1.5,
  },
  totalCell: {
    textAlign: 'right',
    fontSize: 9,
    flex: 1.5,
  },

  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  summaryContent: {
    width: 250,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#000000',
    paddingTop: 8,
    marginTop: 8,
  },

  // Signature Section
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 60,
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

  // Preview-specific styles
  emptyState: {
    padding: 20,
    textAlign: 'center',
    color: '#666666',
  },
});

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

const parseNumberFromDots = (value: string): number => {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
};

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
          <p className='text-text-sub-600'>No form data available for preview</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;

    formData.items.forEach((item) => {
      const unitPrice = parseNumberFromDots(item.unitPrice);
      subtotal += item.quantity * unitPrice;
    });

    const tax = formData.isIncludePPN ? subtotal * 0.11 : 0;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  try {
    return (
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <Document>
          <Page size='A4' style={styles.page}>
            {/* Header */}
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
                      {customerData?.name || 'Customer not selected'}
                    </Text>
                    <Text style={styles.addressLine}>
                      {customerData?.address || 'Customer address'}
                    </Text>
                    <Text style={styles.npwp}>
                      NPWP: {customerData?.npwp || '-'}
                    </Text>
                  </View>
                </View>

                {/* Right Column - Invoice Details */}
                <View style={styles.rightColumn}>
                  <View style={styles.invoiceDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Invoice No.:</Text>
                      <Text style={styles.detailValue}>
                        Auto-generated
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Contract No.:</Text>
                      <Text style={styles.detailValue}>
                        {formData.contractNumber || '-'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Customer PO NO.:</Text>
                      <Text style={styles.detailValue}>
                        {formData.customerPoNumber || '-'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatDateForDisplay(formData.invoiceDate)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Due Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatDateForDisplay(formData.dueDate)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Payment Term:</Text>
                      <Text style={styles.detailValue}>
                        {formData.paymentTerms || '-'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Salesman:</Text>
                      <Text style={styles.detailValue}>
                        [Current User]
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Currency:</Text>
                      <Text style={styles.detailValue}>
                        {formData.currency || 'IDR'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Items Table */}
              <View style={styles.tableSection}>
                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>No.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 3 }]}>
                      Description of Goods
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Qty</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
                      Unit Price ({formData.currency})
                    </Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
                      Total ({formData.currency})
                    </Text>
                  </View>

                  {/* Table Rows */}
                  {formData.items.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text>No items added yet</Text>
                    </View>
                  ) : (
                    formData.items.map((item, index) => {
                      const unitPrice = parseNumberFromDots(item.unitPrice);
                      const itemTotal = item.quantity * unitPrice;

                      return (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, { flex: 0.5 }]}>
                            {index + 1}
                          </Text>
                          <View style={[styles.descriptionCell, { flex: 3 }]}>
                            <Text>{item.name || 'Product name'}</Text>
                            {item.additionalSpecs && (
                              <Text style={{ fontSize: 8, color: '#666' }}>
                                {item.additionalSpecs}
                              </Text>
                            )}
                          </View>
                          <Text style={[styles.quantityCell, { flex: 1 }]}>
                            {item.quantity}
                          </Text>
                          <Text style={[styles.priceCell, { flex: 1.5 }]}>
                            {formatNumber(unitPrice)}
                          </Text>
                          <Text style={[styles.totalCell, { flex: 1.5 }]}>
                            {formatNumber(itemTotal)}
                          </Text>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>

              {/* Summary */}
              <View style={styles.summarySection}>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Sub Total:</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(subtotal)}
                    </Text>
                  </View>
                  {formData.isIncludePPN && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>PPN (11%):</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(tax)}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.summaryLabel}>TOTAL:</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(total)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Notes */}
              {formData.notes && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>Notes:</Text>
                  <Text style={{ fontSize: 10, lineHeight: 1.3 }}>
                    {formData.notes}
                  </Text>
                </View>
              )}

              {/* Signature Section */}
              <View style={styles.signatureSection}>
                <View style={styles.signatureColumn}>
                  <Text style={styles.signatureTitle}>
                    PT SAN TRAKTOR INDONESIA
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureName}>
                    [To be signed]
                  </Text>
                  <Text style={styles.signaturePosition}>Director</Text>
                </View>
                <View style={styles.signatureColumn}>
                  <Text style={styles.signatureTitle}>CUSTOMER</Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureName}>
                    {customerData?.name || '[Customer Name]'}
                  </Text>
                  <Text style={styles.signaturePosition}>Authorized Person</Text>
                </View>
              </View>

              {/* Disclaimer */}
              <View style={styles.disclaimerSection}>
                <Text style={styles.disclaimerTitle}>
                  TERMS AND CONDITIONS
                </Text>
                <Text style={styles.disclaimerText}>
                  1. Payment terms as specified above must be strictly adhered to.
                  {'\n'}
                  2. All bank charges are to be borne by the buyer.
                  {'\n'}
                  3. Goods sold are subject to our standard terms and conditions of sale.
                  {'\n'}
                  4. No claims will be entertained after goods have left our premises.
                </Text>
              </View>
            </View>
          </Page>
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