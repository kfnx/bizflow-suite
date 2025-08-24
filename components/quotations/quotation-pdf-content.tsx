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
export type QuotationPDFData = {
  // Core fields that exist in both types
  quotationNumber?: string;
  quotationDate: string | Date;
  validUntil: string | Date;
  isIncludePPN: boolean;
  notes?: string;
  termsAndConditions?: string;

  // Customer data - can come from props or be embedded
  customerName?: string;
  customerAddress?: string;
  customerContactPerson?: string;
  customerContactPersonPrefix?: string;

  // Items
  items: Array<{
    id?: string;
    name: string;
    category?: string;
    additionalSpecs?: string;
    quantity: string | number;
    unitPrice: string | number;
    total?: string | number;
  }>;

  // Financial data - might be calculated or provided
  subtotal?: string | number;
  tax?: string | number;
  total?: string | number;

  // User data for completed quotations
  createdByUser?: string;
  createdByUserPrefix?: string;
  createdByUserFirstName?: string;
  createdByUserLastName?: string;
  createdByUserPhone?: string;
  approvedByUserPrefix?: string;
  approvedByUserFirstName?: string;
  approvedByUserLastName?: string;
  approvedByUserPhone?: string;
};

export interface QuotationPDFContentProps {
  data: QuotationPDFData;
  customerData?: {
    name: string;
    address: string;
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '0 30px 10px',
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    minWidth: 100,
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
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableCell: {
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  descriptionCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 2,
  },
  quantityCell: {
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  priceCell: {
    padding: 4,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    width: 120,
  },
  totalCell: {
    padding: 4,
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
    marginBottom: 5,
  },

  // Summary Section
  summarySection: {
    padding: '0 30px',
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
    marginBottom: 15,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
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
    marginBottom: 15,
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
    height: 25,
    marginBottom: 5,
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

const tableWidth = {
  number: 35,
  quantity: 35,
};

const formatNumber = (amount: string | number) => {
  const num =
    typeof amount === 'string'
      ? parseFloat(amount.replace(/\./g, '').replace(',', '.'))
      : amount;
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

const formatDateForDisplay = (date: string | Date) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

export const QuotationPDFContent = ({
  data,
  customerData,
  mode = 'final',
}: QuotationPDFContentProps) => {
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
          ? parseFloat(item.unitPrice.replace(/\./g, '').replace(',', '.'))
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
    customerData?.address || data.customerAddress || '-';
  const displayContactPerson =
    customerData?.contactPerson || data.customerContactPerson || '-';
  const displayContactPersonPrefix =
    customerData?.contactPersonPrefix || data.customerContactPersonPrefix || '';

  return (
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
            <Text style={styles.detailLabel}>{displayCustomerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabelSoft}>{displayCustomerAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabelSoft}>
              Attn: {displayContactPersonPrefix} {displayContactPerson}
            </Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quotation Number</Text>
            <Text style={styles.detailValue}>
              :{' '}
              {data.quotationNumber ||
                (mode === 'preview' ? 'Auto-generated' : '-')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              : {formatDateForDisplay(data.quotationDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid Until</Text>
            <Text style={styles.detailValue}>
              : {formatDateForDisplay(data.validUntil)}
            </Text>
          </View>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.tableSection}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text
              style={[styles.tableHeaderCell, { width: tableWidth.number }]}
            >
              No.
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Description
            </Text>
            <Text
              style={[styles.tableHeaderCell, { width: tableWidth.quantity }]}
            >
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
          {data.items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text>No items added yet</Text>
            </View>
          ) : (
            data.items.map((item, index) => {
              const unitPrice =
                typeof item.unitPrice === 'string'
                  ? parseFloat(
                      item.unitPrice.replace(/\./g, '').replace(',', '.'),
                    )
                  : item.unitPrice;
              const quantity =
                typeof item.quantity === 'string'
                  ? parseFloat(item.quantity)
                  : item.quantity;
              const itemTotal = quantity * (unitPrice || 0);

              return (
                <View key={item.id || index} style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, { width: tableWidth.number }]}
                  >
                    {index + 1}
                  </Text>
                  <View style={styles.descriptionCell}>
                    <Text style={styles.productName}>
                      {item.name || 'Product name'}
                    </Text>
                    {item.additionalSpecs && (
                      <Text style={styles.productType}>
                        {item.additionalSpecs}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.quantityCell,
                      { width: tableWidth.quantity },
                    ]}
                  >
                    {quantity}
                  </Text>
                  <Text style={styles.priceCell}>
                    {formatNumber(unitPrice || 0)}
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
          <Text style={styles.summaryValue}>Rp. {formatNumber(subtotal)}</Text>
        </View>
        {data.isIncludePPN && (
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
        {data.termsAndConditions && <Text>{data.termsAndConditions}</Text>}
      </View>

      {/* Notes */}
      {data.notes && (
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Notes:</Text>
          <Text>{data.notes}</Text>
        </View>
      )}

      {/* Prepared By */}
      <View style={styles.preparedBySection}>
        <Text style={styles.preparedByText}>
          {data.createdByUserFirstName || data.createdByUserLastName
            ? `Prepared by: ${data.createdByUserPrefix || ''} ${data.createdByUserFirstName || ''} ${data.createdByUserLastName || ''} ${data.createdByUserPhone ? `(${data.createdByUserPhone})` : ''}`.trim()
            : 'Prepared by: [Current User]'}
        </Text>
      </View>

      {/* Signatures */}
      <View style={styles.signaturesSection} wrap={false}>
        <View style={styles.signatureColumn}>
          <Text style={styles.signatureTitle}>Approved by:</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>
            {data.approvedByUserFirstName
              ? `${data.approvedByUserPrefix || ''} ${data.approvedByUserFirstName} ${data.approvedByUserLastName || ''}`.trim()
              : '[To be approved]'}
          </Text>
          {data.approvedByUserPhone && (
            <Text style={styles.signatureContact}>
              {data.approvedByUserPhone}
            </Text>
          )}
        </View>
        <View style={styles.signatureColumn}>
          <Text style={styles.signatureTitle}>Customer Approval:</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{displayCustomerName}</Text>
          <Text style={styles.signatureContact}>
            {displayContactPersonPrefix} {displayContactPerson}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <View style={styles.footerOrangeLine} />
        <View style={styles.footerContent}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerCompany}>PT SAN TRAKTOR INDONESIA</Text>
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
  );
};
