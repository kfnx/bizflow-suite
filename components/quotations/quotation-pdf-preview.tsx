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

import { QuotationFormData } from '@/lib/validations/quotation';

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

  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },

  // Quotation Details Section
  detailsSection: {
    flexDirection: 'row',
    padding: '0 30px',
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 20,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  detailLabelSoft: {
    width: 180,
  },
  detailValue: {
    flex: 1,
  },

  // Items Table
  tableSection: {
    padding: '0 30px',
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
  },
  descriptionCell: {
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 2,
  },
  quantityCell: {
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 60,
  },
  priceCell: {
    padding: 8,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 120,
  },
  totalCell: {
    padding: 8,
    textAlign: 'right',
    width: 120,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productType: {
    fontSize: 8,
    color: '#666666',
    marginLeft: 10,
  },

  // Summary Section
  summarySection: {
    padding: '0 30px',
    marginBottom: 20,
    alignItems: 'flex-end',
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
  },
  summaryValue: {
    width: 150,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
    marginTop: 5,
  },

  // Terms Section
  termsSection: {
    padding: '0 30px',
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  termsList: {
    marginLeft: 20,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    marginRight: 8,
  },

  preparedBySection: {
    flexDirection: 'row',
    padding: '0 30px',
    marginBottom: 30,
  },
  preparedByText: {
    fontWeight: 'bold',
  },
  signaturesSection: {
    flexDirection: 'row',
    padding: '30px 30px 10px',
    marginBottom: 80,
    gap: 64,
  },
  signatureColumn: {
    flex: 1,
  },
  signatureTitle: {
    fontWeight: 'bold',
    marginBottom: 64,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    height: 30,
    marginBottom: 10,
  },
  signatureName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  signatureContact: {
    fontSize: 9,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: '20px 30px 30px',
    color: '#FFFFFF',
  },
  footerOrangeLine: {
    backgroundColor: '#FF9900',
    width: '100%',
    height: 6,
    marginBottom: 6,
  },
  footerCompany: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  footerAddress: {
    fontSize: 10,
  },
  footerContact: {
    fontSize: 10,
    textAlign: 'right',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },

  // Preview-specific styles
  emptyState: {
    padding: 40,
    textAlign: 'center',
    color: '#666666',
  },
});

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

export const QuotationPDFPreview = ({
  formData,
  customerData,
  branchData,
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

            {/* Title */}
            <Text style={styles.title}>QUOTATION</Text>

            {/* Quotation Details */}
            <View style={styles.detailsSection}>
              <View style={styles.leftColumn}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {customerData?.name || 'Customer not selected'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelSoft}>
                    {customerData?.address || '-'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelSoft}>
                    Attn: {customerData?.contactPersonPrefix || ''}{' '}
                    {customerData?.contactPerson || '-'}
                  </Text>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quotation Number:</Text>
                  <Text style={styles.detailValue}>
                    {formData.quotationNumber || 'Auto-generated'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDateForDisplay(formData.quotationDate)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Valid Until:</Text>
                  <Text style={styles.detailValue}>
                    {formatDateForDisplay(formData.validUntil)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Items Table */}
            <View style={styles.tableSection}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { width: 50 }]}>
                    No.
                  </Text>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                    Description
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 60 }]}>
                    Qty
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>
                    Unit Price (Rp.)
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>
                    Total Price (Rp.)
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
                        <Text style={[styles.tableCell, { width: 50 }]}>
                          {index + 1}
                        </Text>
                        <View style={styles.descriptionCell}>
                          <Text style={styles.productName}>
                            {item.name || 'Product name'}
                          </Text>
                          <Text style={styles.productType}>
                            {item.category || 'Category'}
                          </Text>
                          {item.additionalSpecs && (
                            <Text style={styles.productType}>
                              {item.additionalSpecs}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.quantityCell}>{item.quantity}</Text>
                        <Text style={styles.priceCell}>
                          {formatNumber(unitPrice)}
                        </Text>
                        <Text style={styles.totalCell}>
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
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub Total:</Text>
                <Text style={styles.summaryValue}>
                  Rp. {formatNumber(subtotal)}
                </Text>
              </View>
              {formData.isIncludePPN && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>PPN:</Text>
                  <Text style={styles.summaryValue}>
                    Rp. {formatNumber(tax)}
                  </Text>
                </View>
              )}
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryLabel}>TOTAL:</Text>
                <Text style={styles.summaryValue}>
                  Rp. {formatNumber(total)}
                </Text>
              </View>
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Terms and Conditions:</Text>
              {formData.termsAndConditions ? (
                <Text>{formData.termsAndConditions}</Text>
              ) : (
                <View style={styles.termsList}>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>Franco Jakarta</Text>
                  </View>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>
                      Pembayaran: 30% Down Payment; 70% Pelunasan, bagi 3 bulan
                    </Text>
                  </View>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>Free Jasa service 3x (250, 500 and 1000 jam).</Text>
                  </View>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>Free Filter 1x untuk service 250 jam.</Text>
                  </View>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>
                      Warranty 12 bulan atau 2000 HM (yang tercapai dahulu).
                    </Text>
                  </View>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>
                      Penawaran berlaku selama 14 hari dari tenggal penawaran
                    </Text>
                  </View>
                  <View style={styles.termItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>Ready stok selama belum terjual</Text>
                  </View>
                </View>
              )}
            </View>

            {formData.notes && (
              <View style={styles.termsSection}>
                <Text style={styles.termsTitle}>Notes:</Text>
                <Text>{formData.notes}</Text>
              </View>
            )}

            <View style={styles.preparedBySection}>
              <Text style={styles.preparedByText}>
                Prepared by: [Current User]
              </Text>
            </View>

            {/* Signatures */}
            <View style={styles.signaturesSection} wrap={false}>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>Approved by:</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>[To be approved]</Text>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>Customer Approval:</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>
                  {customerData?.name || '[Customer]'}
                </Text>
                <Text style={styles.signatureContact}>
                  {customerData?.contactPersonPrefix}{' '}
                  {customerData?.contactPerson}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <View style={styles.footerOrangeLine} />
              <View style={styles.footerContent}>
                <View style={styles.footerLeft}>
                  <Text style={styles.footerCompany}>
                    PT SAN TRAKTOR INDONESIA
                  </Text>
                  <Text style={styles.footerAddress}>
                    Jl. Pluit Karang Karya 1 Kav C8, Jakarta Utara
                  </Text>
                  <Text style={styles.footerAddress}>14450, Indonesia</Text>
                </View>
                <View style={styles.footerRight}>
                  <Text style={styles.footerContact}>info@santraktor.id</Text>
                  <Text style={styles.footerContact}>021-22663500</Text>
                </View>
              </View>
            </View>
          </Page>
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
