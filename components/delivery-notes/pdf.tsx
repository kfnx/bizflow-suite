/* eslint-disable jsx-a11y/alt-text */
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
import { DeliveryNoteDetail } from '@/hooks/use-delivery-notes';

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

  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  logoSection: {
    flex: 1,
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 10,
  },
  documentInfo: {
    flex: 2,
    alignItems: 'center',
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  documentNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Recipient Section
  recipientSection: {
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  recipientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  recipientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipientAddress: {
    fontSize: 10,
    marginBottom: 2,
  },
  recipientContact: {
    fontSize: 10,
    marginTop: 5,
  },

  // Items Table Section
  tableSection: {
    marginBottom: 30,
    paddingHorizontal: 30,
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
    width: 60,
    fontSize: 9,
  },
  partNumberCell: {
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 1.5,
    fontSize: 9,
  },
  unitModelCell: {
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 1.2,
    fontSize: 9,
  },
  engineNumberCell: {
    padding: 8,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 1.2,
    fontSize: 9,
  },
  remarksCell: {
    padding: 8,
    textAlign: 'left',
    width: 120,
    fontSize: 9,
  },

  // Footer Section
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footerValue: {
    fontSize: 10,
    marginBottom: 15,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signatureColumn: {
    flex: 1,
    alignItems: 'center',
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    height: 20,
    width: 150,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 9,
    textAlign: 'center',
  },
});

interface DeliveryNotePDFProps {
  deliveryNote: DeliveryNoteDetail;
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

// Helper function to determine product category from item data
const getProductCategory = (
  item: any,
): 'serialized' | 'non_serialized' | 'bulk' => {
  // Check if product has serial number (serialized)
  if (item.product?.serialNumber) {
    return 'serialized';
  }

  // Check if product has part number but no serial number (non-serialized)
  if (item.product?.partNumber && !item.product?.serialNumber) {
    return 'non_serialized';
  }

  // Default to bulk
  return 'bulk';
};

// Component for serialized products table (like the second image example)
const SerializedProductsTable = ({ items }: { items: any[] }) => (
  <View style={styles.tableSection}>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { width: 40 }]}>No.</Text>
        <Text style={[styles.tableHeaderCell, { width: 60 }]}>Qty</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Unit Model</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Serial No</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Engine No</Text>
        <Text style={[styles.tableHeaderCell, { width: 120 }]}>Keterangan</Text>
      </View>
      {items.map((item, index) => (
        <View key={item.id || index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 40 }]}>{index + 1}</Text>
          <Text style={[styles.tableCell, { width: 60 }]}>
            {item.quantity} Unit
          </Text>
          <Text style={[styles.unitModelCell, { borderRightWidth: 1 }]}>
            {item.product?.name || 'N/A'}
          </Text>
          <Text style={[styles.serialCell, { borderRightWidth: 1 }]}>
            {item.product?.serialNumber || 'N/A'}
          </Text>
          <Text style={[styles.engineNumberCell, { borderRightWidth: 1 }]}>
            {item.product?.engineNumber || 'N/A'}
          </Text>
          <Text style={styles.remarksCell}>
            {item.product?.additionalSpecs || ''}
          </Text>
        </View>
      ))}
      {/* Add empty rows for additional items */}
      {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, index) => (
        <View key={`empty-${index}`} style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 40 }]}>
            {items.length + index + 1}
          </Text>
          <Text style={[styles.tableCell, { width: 60 }]}></Text>
          <Text style={[styles.unitModelCell, { borderRightWidth: 1 }]}></Text>
          <Text style={[styles.serialCell, { borderRightWidth: 1 }]}></Text>
          <Text
            style={[styles.engineNumberCell, { borderRightWidth: 1 }]}
          ></Text>
          <Text style={styles.remarksCell}></Text>
        </View>
      ))}
    </View>
  </View>
);

// Component for non-serialized/bulk products table (like the first image example)
const NonSerializedProductsTable = ({ items }: { items: any[] }) => (
  <View style={styles.tableSection}>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { width: 40 }]}>No.</Text>
        <Text style={[styles.tableHeaderCell, { width: 60 }]}>Qty</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
          Part No Shantui
        </Text>
        <Text style={[styles.tableHeaderCell, { width: 80 }]}>Replace</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Description</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Untuk Unit</Text>
      </View>
      {items.map((item, index) => (
        <View key={item.id || index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 40 }]}>{index + 1}</Text>
          <Text style={[styles.tableCell, { width: 60 }]}>
            {item.quantity} Pcs
          </Text>
          <Text style={[styles.partNumberCell, { borderRightWidth: 1 }]}>
            {item.product?.partNumber || item.product?.code || 'N/A'}
          </Text>
          <Text
            style={[styles.tableCell, { width: 80, borderRightWidth: 1 }]}
          ></Text>
          <Text style={[styles.descriptionCell, { borderRightWidth: 1 }]}>
            {item.product?.name || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {item.product?.modelNumber || 'N/A'}
          </Text>
        </View>
      ))}
      {/* Add empty rows for additional items */}
      {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, index) => (
        <View key={`empty-${index}`} style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 40 }]}>
            {items.length + index + 1}
          </Text>
          <Text style={[styles.tableCell, { width: 60 }]}></Text>
          <Text style={[styles.partNumberCell, { borderRightWidth: 1 }]}></Text>
          <Text
            style={[styles.tableCell, { width: 80, borderRightWidth: 1 }]}
          ></Text>
          <Text
            style={[styles.descriptionCell, { borderRightWidth: 1 }]}
          ></Text>
          <Text style={styles.tableCell}></Text>
        </View>
      ))}
    </View>
  </View>
);

export const DeliveryNotePDF = ({ deliveryNote }: DeliveryNotePDFProps) => {
  // Determine the table type based on the first item's product category
  const firstItem = deliveryNote.items[0];
  const productCategory = firstItem
    ? getProductCategory(firstItem)
    : 'non_serialized';

  // Group items by category
  const serializedItems = deliveryNote.items.filter(
    (item) => getProductCategory(item) === 'serialized',
  );
  const nonSerializedItems = deliveryNote.items.filter(
    (item) => getProductCategory(item) !== 'serialized',
  );

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size='A4' style={styles.page}>
          {/* Header Image */}
          <Image
            src='/images/document-header.jpg'
            style={styles.headerImage}
            fixed
          />

          {/* Document Header */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              <Text style={styles.documentTitle}>STI</Text>
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>SURAT JALAN NO:</Text>
              <Text style={styles.documentNumber}>
                {deliveryNote.deliveryNumber}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Tanggal:</Text>
              <Text style={styles.dateValue}>
                {formatDate(deliveryNote.deliveryDate)}
              </Text>
            </View>
          </View>

          {/* Recipient Information */}
          <View style={styles.recipientSection}>
            <Text style={styles.recipientTitle}>Kepada Yth:</Text>
            <Text style={styles.recipientName}>
              {deliveryNote.customer?.name || 'Unknown Customer'}
            </Text>
            <Text style={styles.recipientAddress}>
              {deliveryNote.customer?.address || 'Address not available'}
            </Text>
            {deliveryNote.customer?.city && (
              <Text style={styles.recipientAddress}>
                {deliveryNote.customer.city}
                {deliveryNote.customer.province &&
                  `, ${deliveryNote.customer.province}`}
                {deliveryNote.customer.country &&
                  `, ${deliveryNote.customer.country}`}
              </Text>
            )}
            {deliveryNote.customer?.contactPersons &&
              deliveryNote.customer.contactPersons.length > 0 && (
                <Text style={styles.recipientContact}>
                  U.P {deliveryNote.customer.contactPersons[0].prefix}{' '}
                  {deliveryNote.customer.contactPersons[0].name}
                  {deliveryNote.customer.contactPersons[0].phone &&
                    ` (${deliveryNote.customer.contactPersons[0].phone})`}
                </Text>
              )}
          </View>

          {/* Items Table - Dynamic based on product type */}
          {productCategory === 'serialized' ? (
            <SerializedProductsTable items={serializedItems} />
          ) : (
            <NonSerializedProductsTable items={nonSerializedItems} />
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Via:</Text>
              <Text style={styles.footerValue}>
                {deliveryNote.deliveryMethod || 'Laut'}
              </Text>

              <Text style={styles.footerLabel}>Expedisi:</Text>
              <Text style={styles.footerValue}></Text>
            </View>
            <View style={styles.footerRight}>
              <View style={styles.signatureSection}>
                <View style={styles.signatureRow}>
                  <View style={styles.signatureColumn}>
                    <Text style={styles.signatureTitle}>Expedisi,</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureName}></Text>
                  </View>
                  <View style={styles.signatureColumn}>
                    <Text style={styles.signatureTitle}>Diterima,</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureName}></Text>
                  </View>
                  <View style={styles.signatureColumn}>
                    <Text style={styles.signatureTitle}>Hormat kami,</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureName}></Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
