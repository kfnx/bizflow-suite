/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { formatDate } from '@/utils/date-formatter';
import { QuotationDetail } from '@/hooks/use-quotations';

// Register fonts (you may need to add actual font files)
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    padding: 0,
    margin: 0,
  },
  headerImage: {
    width: '100%',
    height: 80,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companySubtitle: {
    fontSize: 10,
    marginTop: 2,
  },

  // Title
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

  // Signatures Section
  signaturesSection: {
    flexDirection: 'row',
    padding: '0 30px',
    marginBottom: 20,
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
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
  },
  footerCompany: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footerAddress: {
    color: '#666666',
  },
});

interface QuotationPDFProps {
  quotation: QuotationDetail;
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

export const QuotationPDF = ({ quotation }: QuotationPDFProps) => {
  const subtotal =
    typeof quotation.subtotal === 'string'
      ? parseFloat(quotation.subtotal)
      : quotation.subtotal;
  const tax =
    typeof quotation.tax === 'string'
      ? parseFloat(quotation.tax)
      : quotation.tax;
  const total =
    typeof quotation.total === 'string'
      ? parseFloat(quotation.total)
      : quotation.total;

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

          {/* Title */}
          <Text style={styles.title}>QUOTATION</Text>

          {/* Quotation Details */}
          <View style={styles.detailsSection}>
            <View style={styles.leftColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{quotation.customerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabelSoft}>
                  {quotation.customerAddress}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabelSoft}>
                  Attn: {quotation.customerContactPersonPrefix}{' '}
                  {quotation.customerContactPerson}
                </Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quotation Number:</Text>
                <Text style={styles.detailValue}>
                  {quotation.quotationNumber}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(quotation.quotationDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Valid Until:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(quotation.validUntil)}
                </Text>
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableSection}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: 50 }]}>No.</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                  Description
                </Text>
                <Text style={[styles.tableHeaderCell, { width: 60 }]}>Qty</Text>
                <Text style={[styles.tableHeaderCell, { width: 120 }]}>
                  Unit Price (Rp.)
                </Text>
                <Text style={[styles.tableHeaderCell, { width: 120 }]}>
                  Total Price (Rp.)
                </Text>
              </View>

              {/* Table Rows */}
              {quotation.items.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: 50 }]}>
                    {index + 1}
                  </Text>
                  <View style={styles.descriptionCell}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productType}>Excavator</Text>
                  </View>
                  <Text style={styles.quantityCell}>{item.quantity}</Text>
                  <Text style={styles.priceCell}>
                    {formatNumber(item.unitPrice)}
                  </Text>
                  <Text style={styles.totalCell}>
                    {formatNumber(item.total)}
                  </Text>
                </View>
              ))}
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
            {quotation.isIncludePPN && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>PPN:</Text>
                <Text style={styles.summaryValue}>Rp. {formatNumber(tax)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryLabel}>TOTAL:</Text>
              <Text style={styles.summaryValue}>Rp. {formatNumber(total)}</Text>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms and Conditions:</Text>
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
          </View>
          <View style={styles.signaturesSection}>
            <Text style={styles.signatureTitle}>
              Prepared by: {quotation.createdByUser}{' '}
              {quotation.createdByUserPrefix} {quotation.createdByUserFirstName}{' '}
              {quotation.createdByUserLastName} ({quotation.createdByUserPhone})
            </Text>
          </View>
          {/* Signatures */}
          <View style={styles.signaturesSection}>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>Approved by:</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>Tony Rafly</Text>
              <Text style={styles.signatureContact}>+6221-2266-3500</Text>
            </View>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>Customer Approval:</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{quotation.customerName}</Text>
              <Text style={styles.signatureContact}>
                {quotation.customerContactPersonPrefix}{' '}
                {quotation.customerContactPerson}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerCompany}>PT. SAN TRAKTOR INDONESIA</Text>
            <Text style={styles.footerAddress}>
              Jl. Pluit Karang Karya 1 Kav C8, Jakarta Utara 14450, Indonesia
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
