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
    marginBottom: 20,
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
    marginBottom: 20,
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
    marginBottom: 20,
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
    padding: 4,
    fontWeight: 'bold',
    textAlign: 'left',
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
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  productCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  descriptionCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    flex: 2,
    fontSize: 9,
  },
  serialCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  partNumberCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  unitModelCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  engineNumberCell: {
    padding: 4,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontSize: 9,
  },
  remarksCell: {
    padding: 4,
    textAlign: 'left',
    fontSize: 9,
  },

  // Footer Section
  deliveryDetail: {
    flex: 1,
    paddingHorizontal: 30,
  },
  deliveryDetailItem: {
    height: 30,
    flexDirection: 'row',
  },
  deliveryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 6,
  },
  deliveryValue: {
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
    marginBottom: 20,
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    height: 30,
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

const tableWidth = {
  no: 40,
  qty: 70,
  product: 150,
};

export const DeliveryNotePDF = ({ deliveryNote }: DeliveryNotePDFProps) => {
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
                {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
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

          <View style={styles.tableSection}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text
                  style={[styles.tableHeaderCell, { width: tableWidth.no }]}
                >
                  No.
                </Text>
                <Text
                  style={[styles.tableHeaderCell, { width: tableWidth.qty }]}
                >
                  Qty
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                  Produk
                </Text>
              </View>
              {deliveryNote.items.map((item, index) => (
                <View key={item.id || index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: tableWidth.no }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.tableCell, { width: tableWidth.qty }]}>
                    {item.quantity} Pcs
                  </Text>
                  <Text style={[styles.productCell, { flex: 1 }]}>
                    {item.product?.name ||
                      item.product?.partNumber ||
                      item.product?.code ||
                      'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.deliveryDetail}>
            <View style={styles.deliveryDetailItem}>
              <Text style={styles.deliveryLabel}>Via:</Text>
              <Text style={styles.deliveryValue}>
                {deliveryNote.deliveryMethod || 'Laut'}
              </Text>
            </View>
            <View style={styles.deliveryDetailItem}>
              <Text style={styles.deliveryLabel}>Expedisi:</Text>
              <Text style={styles.deliveryValue}></Text>
            </View>
          </View>

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
        </Page>
      </Document>
    </PDFViewer>
  );
};
