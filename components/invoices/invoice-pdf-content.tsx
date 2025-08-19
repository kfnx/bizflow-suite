/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

// Union type for different data sources
export type InvoicePDFData = {
  // Core fields that exist in both types
  invoiceNumber?: string;
  invoiceDate: string | Date;
  dueDate: string | Date;
  customerId?: string;
  contractNumber?: string;
  customerPoNumber?: string;
  salesmanUserId?: string;
  currency: string;
  status?: string;
  paymentTerms?: string;
  isIncludePPN: boolean;
  notes?: string;

  // Customer data - can come from props or be embedded
  customerName?: string;
  customerAddress?: string;
  customerNpwp?: string;
  customerContactPerson?: string;
  customerContactPersonPrefix?: string;

  // Items
  items: Array<{
    id?: string;
    productId?: string;
    name: string;
    category?: string;
    additionalSpecs?: string;
    quantity: string | number;
    unitPrice: string | number;
    total?: string | number;
    serialNumber?: string;
    partNumber?: string;
  }>;

  // Financial data - might be calculated or provided
  subtotal?: string | number;
  tax?: string | number;
  total?: string | number;

  // User data for completed invoices
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  salesmanUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  // Branch data
  branchName?: string;
};

export interface InvoicePDFContentProps {
  data: InvoicePDFData;
  customerData?: {
    name: string;
    address: string;
    npwp?: string;
    contactPerson?: string;
    contactPersonPrefix?: string;
  };
  mode?: 'preview' | 'final';
}

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
    marginBottom: 10,
  },
  content: {
    padding: '10px 30px 10px',
  },

  // Title
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
  },

  // Main Content Section
  mainContent: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  // Left Column - Recipient Info
  leftColumn: {
    flex: 1,
    paddingRight: 20,
  },
  recipientSection: {
    marginBottom: 10,
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
    marginBottom: 10,
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
    marginBottom: 10,
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
    padding: 4,
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
  numberCell: {
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
    width: 35,
  },
  descriptionCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 2,
    fontSize: 9,
  },
  quantityCell: {
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 35,
    fontSize: 9,
  },
  priceCell: {
    padding: 4,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 120,
    fontSize: 9,
  },
  totalCell: {
    padding: 4,
    textAlign: 'right',
    width: 120,
    fontSize: 9,
  },

  // Summary Section
  summarySection: {
    alignItems: 'flex-end',
    marginBottom: 10,
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
    marginTop: 10,
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // Bank Information Section
  bankSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bankLeft: {
    flex: 2,
    paddingRight: 10,
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
    width: 180,
    padding: '0px 20px',
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
    marginTop: 15,
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
    padding: 40,
    textAlign: 'center',
    color: '#666666',
  },
});

const formatNumber = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDateForDisplay = (date: string | Date) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

const parseNumberFromDots = (value: string): number => {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
};

export const InvoicePDFContent = ({
  data,
  customerData,
  mode = 'final',
}: InvoicePDFContentProps) => {
  // Calculate totals if not provided
  const calculateTotals = () => {
    if (
      data.subtotal !== undefined &&
      data.tax !== undefined &&
      data.total !== undefined
    ) {
      return {
        subtotal:
          typeof data.subtotal === 'string'
            ? parseFloat(data.subtotal)
            : data.subtotal,
        tax: typeof data.tax === 'string' ? parseFloat(data.tax) : data.tax,
        total:
          typeof data.total === 'string' ? parseFloat(data.total) : data.total,
      };
    }

    // Calculate from items
    let subtotal = 0;
    data.items.forEach((item) => {
      const unitPrice =
        typeof item.unitPrice === 'string'
          ? parseNumberFromDots(item.unitPrice)
          : item.unitPrice;
      const quantity =
        typeof item.quantity === 'string'
          ? parseFloat(item.quantity)
          : item.quantity;
      subtotal += quantity * (unitPrice || 0);
    });

    const tax = data.isIncludePPN ? subtotal * 0.11 : 0;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  // Determine customer info
  const displayCustomerName =
    customerData?.name ||
    data.customerName ||
    (mode === 'preview' ? 'Customer not selected' : '[Customer]');
  const displayCustomerAddress =
    customerData?.address ||
    data.customerAddress ||
    (mode === 'preview'
      ? 'BFI TOWER SUNBURST CBD Lot 1.2 JL. KAPT. SOEBIJANTO\nDJOJOHADIKUSUMO BSD CITY - TANGERANG SELATAN, 15322'
      : '');
  const displayCustomerNpwp =
    customerData?.npwp || data.customerNpwp || '0757149844211000';

  // Determine salesman info
  const displaySalesman = data.salesmanUser
    ? `${data.salesmanUser.firstName} ${data.salesmanUser.lastName}`
    : data.createdByUser
      ? `${data.createdByUser.firstName} ${data.createdByUser.lastName}`
      : mode === 'preview'
        ? '[Current User]'
        : 'Rino';

  return (
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
              <Text style={styles.recipientName}>{displayCustomerName}</Text>
              <Text style={styles.addressLine}>
                {displayCustomerAddress.split('\n')[0]}
              </Text>
              <Text style={styles.addressLine}>
                {displayCustomerAddress.split('\n')[1]}
              </Text>
              <Text style={styles.npwp}>NPWP: {displayCustomerNpwp}</Text>
            </View>
          </View>

          {/* Right Column - Invoice Details */}
          <View style={styles.rightColumn}>
            <View style={styles.invoiceDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice No.</Text>
                <Text style={styles.detailValue}>
                  :{' '}
                  {data.invoiceNumber ||
                    (mode === 'preview' ? 'Auto-generated' : '-')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contract No.</Text>
                <Text style={styles.detailValue}>
                  : {data.contractNumber || '001/PJB/STI-JKI/V/2025'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer PO NO.</Text>
                <Text style={styles.detailValue}>
                  : {data.customerPoNumber || '20250625P000009'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  : {formatDateForDisplay(data.invoiceDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Term</Text>
                <Text style={styles.detailValue}>
                  :{' '}
                  {data.paymentTerms ||
                    '30% DP, 70% BP oleh leasing 30 hari proses'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Salesman</Text>
                <Text style={styles.detailValue}>: {displaySalesman}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Currency</Text>
                <Text style={styles.detailValue}>: {data.currency}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.tableSection}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: styles.numberCell.width },
                ]}
              >
                No.
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                Description
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: styles.quantityCell.width },
                ]}
              >
                Qty.
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: styles.priceCell.width },
                ]}
              >
                Unit Price
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: styles.totalCell.width },
                ]}
              >
                Amount
              </Text>
            </View>

            {/* Table Rows */}
            {data.items.length === 0 ? (
              <View style={styles.emptyState}>
                <Text>No items added yet</Text>
              </View>
            ) : (
              data.items.map((item, index) => {
                const unitPrice =
                  typeof item.unitPrice === 'string'
                    ? parseNumberFromDots(item.unitPrice)
                    : item.unitPrice;
                const quantity =
                  typeof item.quantity === 'string'
                    ? parseFloat(item.quantity)
                    : item.quantity;
                const itemTotal = quantity * (unitPrice || 0);

                return (
                  <View key={item.productId || index} style={styles.tableRow}>
                    <Text style={styles.numberCell}>{index + 1}</Text>
                    <View style={styles.descriptionCell}>
                      <Text>{item.name}</Text>
                      <Text style={{ fontSize: 8, color: '#666666' }}>
                        {item.additionalSpecs}
                      </Text>
                    </View>
                    <Text style={styles.quantityCell}>{quantity}</Text>
                    <Text style={styles.priceCell}>
                      Rp {formatNumber(unitPrice || 0)}
                    </Text>
                    <Text style={styles.totalCell}>
                      Rp {formatNumber(itemTotal)}
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
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>Rp {formatNumber(subtotal)}</Text>
          </View>
          {data.isIncludePPN && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT:</Text>
              <Text style={styles.summaryValue}>Rp {formatNumber(tax)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>Rp {formatNumber(total)}</Text>
          </View>
        </View>

        {/* Thank You Section */}
        <View style={styles.thankYouSection}>
          <Text style={styles.thankYouText}>THANK YOU FOR YOUR BUSINESS</Text>
        </View>

        {/* Bank Information and Signature */}
        <View style={styles.bankSection} wrap={false}>
          {/* Bank Information */}
          <View style={styles.bankLeft}>
            <Text style={styles.bankTitle}>Please Remit to Us.</Text>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankLabel}>BANK NAME</Text>
              <Text style={styles.bankValue}>: Bank Central Asia (BCA)</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankLabel}>BRANCH</Text>
              <Text style={styles.bankValue}>: Pasar Baru</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankLabel}>ACCOUNT NAME</Text>
              <Text style={styles.bankValue}>: PT SAN TRAKTOR INDONESIA</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankLabel}>ACCOUNT NUMBER</Text>
              <Text style={styles.bankValue}>: 0028195195</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankLabel}>SWIFT CODE</Text>
              <Text style={styles.bankValue}>: BCAIDJA</Text>
            </View>
          </View>

          {/* Signature */}
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureTitle}>Tanda Tangan dan Materai</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Tony Raflv Teh</Text>
            <Text style={styles.signaturePosition}>Direktur Utama</Text>
            <Text style={styles.signatureCompany}>
              PT SAN TRAKTOR INDONESIA
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerSection} wrap={false}>
          <Text style={styles.disclaimerTitle}>ATTENTION</Text>
          <Text style={styles.disclaimerText}>
            When within 14 days from the date of the Invoice and Tax Invoice
            received no objections from the customer, the customer is deemed to
            have agreed to everything contained in this Invoice and Tax Invoice.
          </Text>
        </View>
      </View>
    </Page>
  );
};
