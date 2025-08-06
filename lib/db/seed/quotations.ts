import { QUOTATION_STATUS } from '../enum';
import { branchIds } from './branches';
import { customerIds } from './customers';
import { productIds } from './products';
import { userIds } from './users';

export const quotationIds = {
  quotation1: '50000001-0000-4000-a000-000000000001',
  quotation2: '50000002-0000-4000-a000-000000000001',
  quotation3: '50000003-0000-4000-a000-000000000001',
  quotation4: '50000004-0000-4000-a000-000000000001',
  quotation5: '50000005-0000-4000-a000-000000000001',
  quotation6: '50000006-0000-4000-a000-000000000001',
  quotation7: '50000007-0000-4000-a000-000000000001',
  quotation8: '50000008-0000-4000-a000-000000000001',
  quotation9: '50000009-0000-4000-a000-000000000001',
};

export const quotations = [
  {
    id: quotationIds.quotation1,
    quotationNumber: 'QT/2025/04/001',
    quotationDate: new Date('2025-04-29'),
    validUntil: new Date('2025-07-29'),
    customerId: customerIds.customer1,
    approvedBy: userIds.manager_kendari, // Manager
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    isIncludePPN: true,
    subtotal: '15000000.00',
    tax: '1500000.00',
    total: '16500000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.DRAFT,
    notes: 'Standard quotation for heavy equipment',
    termsAndConditions: `- Franco Jakarta
- Pembayaran: 30% Down Payment; 70% Pelunasan, bagi 3 bulan
- Free Jasa service 3x (250, 500 and 1000 jam)
- Free Filter 1x untuk service 250 jam
- Warranty 12 bulan atau 2000 HM (yang tercapai dahulu)
- Penawaran berlaku selama 14 hari dari tenggal penawaran
- Ready stok selama belum terjual`,
  },
  {
    id: quotationIds.quotation2,
    quotationNumber: 'QT/2025/04/002',
    quotationDate: new Date('2025-04-29'),
    validUntil: new Date('2025-07-29'),
    customerId: customerIds.customer2,
    approvedBy: userIds.user4, // Director
    createdBy: userIds.manager_kendari, // Budi - Kendari branch
    branchId: branchIds.kendari, // Created by Budi at Kendari branch
    isIncludePPN: false,
    subtotal: '25000000.00',
    tax: '0.00',
    total: '25000000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.SENT,
    notes: 'Special pricing for bulk order',
    termsAndConditions: `- Franco Bekasi
- Pembayaran: 30% Down Payment; 70% Pelunasan, bagi 3 bulan
- Free Jasa service 3x (250, 500 and 1000 jam)
- Free Filter 1x untuk service 250 jam`,
  },
  {
    id: quotationIds.quotation3,
    quotationNumber: 'QT/2025/05/001',
    quotationDate: new Date('2025-05-29'),
    validUntil: new Date('2025-07-29'),
    customerId: customerIds.customer3,
    approvedBy: userIds.manager_kendari, // Manager
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    isIncludePPN: true,
    subtotal: '35000000.00',
    tax: '3500000.00',
    total: '38500000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.ACCEPTED,
    notes: 'Premium equipment package',
    termsAndConditions: `- Franco Jakarta
- Pembayaran: 30% Down Payment; 70% Pelunasan, bagi 3 bulan
- Free Jasa service 3x (250, 500 and 1000 jam)
- Free Filter 1x untuk service 250 jam
- Warranty 12 bulan atau 2000 HM (yang tercapai dahulu)
- Penawaran berlaku selama 14 hari dari tenggal penawaran
- Ready stok selama belum terjual
- Franco Singapore
- Pembayaran: 30% Down Payment; 70% Pelunasan, bagi 3 bulan
- Free Jasa service 3x (250, 500 and 1000 jam)
- Free Filter 1x untuk service 250 jam
- Warranty 12 bulan atau 2000 HM (yang tercapai dahulu)
- Penawaran berlaku selama 14 hari dari tenggal penawaran
- Ready stok selama belum terjual`,
  },
  {
    id: quotationIds.quotation4,
    quotationNumber: 'QT/2025/06/001',
    quotationDate: new Date('2025-01-30'),
    validUntil: new Date('2025-02-28'),
    customerId: customerIds.customer4,
    approvedBy: userIds.user4, // Director
    createdBy: userIds.user4, // Rizky - HO Jakarta
    branchId: branchIds.ho_jakarta, // Created by Rizky at HO Jakarta
    isIncludePPN: true,
    subtotal: '18000000.00',
    tax: '1800000.00',
    total: '19800000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.REJECTED,
    notes: 'Budget constraints',
    termsAndConditions: null,
  },
  {
    id: quotationIds.quotation5,
    quotationNumber: 'QT/2025/06/002',
    quotationDate: new Date('2025-06-15'),
    validUntil: new Date('2025-07-15'),
    customerId: customerIds.customer5,
    approvedBy: userIds.manager_kendari, // Manager
    createdBy: userIds.user4, // Rini - Balikpapan branch
    branchId: branchIds.balikpapan, // Created by Rini at Balikpapan branch
    isIncludePPN: true,
    subtotal: '42000000.00',
    tax: '4200000.00',
    total: '46200000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.DRAFT,
    notes: 'Caterpillar excavator for mining operations',
    termsAndConditions: null,
  },
  {
    id: quotationIds.quotation6,
    quotationNumber: 'QT/2025/06/003',
    quotationDate: new Date('2025-06-20'),
    validUntil: new Date('2025-07-20'),
    customerId: customerIds.customer1,
    approvedBy: userIds.user4, // Director
    createdBy: userIds.manager_kendari, // Budi - Kendari branch
    branchId: branchIds.kendari, // Created by Budi at Kendari branch
    isIncludePPN: false,
    subtotal: '28000000.00',
    tax: '0.00',
    total: '28000000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.SENT,
    notes: 'Komatsu excavator for infrastructure project',
    termsAndConditions: null,
  },
  {
    id: quotationIds.quotation7,
    quotationNumber: 'QT/2025/09/001',
    quotationDate: new Date('2025-09-10'),
    validUntil: new Date('2025-12-10'),
    customerId: customerIds.customer2,
    approvedBy: userIds.manager_kendari, // Manager
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    isIncludePPN: true,
    subtotal: '32000000.00',
    tax: '3200000.00',
    total: '35200000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.ACCEPTED,
    notes: 'JCB backhoe loader for construction site',
    termsAndConditions: null,
  },
  {
    id: quotationIds.quotation8,
    quotationNumber: 'QT/2025/10/001',
    quotationDate: new Date('2025-10-15'),
    validUntil: new Date('2025-11-15'),
    customerId: customerIds.customer3,
    approvedBy: userIds.manager_kendari, // Manager
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    isIncludePPN: true,
    subtotal: '45000000.00',
    tax: '4500000.00',
    total: '49500000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.SENT,
    notes: 'Hitachi excavator for large construction project',
    termsAndConditions: null,
  },
  {
    id: quotationIds.quotation9,
    quotationNumber: 'QT/2025/10/002',
    quotationDate: new Date('2025-10-20'),
    validUntil: new Date('2025-11-20'),
    customerId: customerIds.customer4,
    approvedBy: userIds.user4, // Director
    createdBy: userIds.manager_kendari, // Budi - Kendari branch
    branchId: branchIds.kendari, // Created by Budi at Kendari branch
    isIncludePPN: false,
    subtotal: '22000000.00',
    tax: '0.00',
    total: '22000000.00',
    currency: 'IDR',
    status: QUOTATION_STATUS.SENT,
    notes: 'Volvo wheel loader for logistics center',
    termsAndConditions: null,
  },
];

export const quotationItems = [
  {
    id: 'c0000001-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation1,
    productId: productIds.product1,
    quantity: 1,
    unitPrice: '15000000.00',
    total: '15000000.00',
    notes: 'Wheel loader with standard configuration',
  },
  {
    id: 'c0000002-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation2,
    productId: productIds.product2,
    quantity: 1,
    unitPrice: '25000000.00',
    total: '25000000.00',
    notes: 'Wheel loader with premium features',
  },
  {
    id: 'c0000003-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation3,
    productId: productIds.product4,
    quantity: 1,
    unitPrice: '35000000.00',
    total: '35000000.00',
    notes: 'Bulldozer with advanced controls',
  },
  {
    id: 'c0000004-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation4,
    productId: productIds.product5,
    quantity: 1,
    unitPrice: '18000000.00',
    total: '18000000.00',
    notes: 'Excavator for construction project',
  },
  {
    id: 'c0000005-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation5,
    productId: productIds.product1,
    quantity: 1,
    unitPrice: '42000000.00',
    total: '42000000.00',
    notes: 'Wheel loader for mining operations',
  },
  {
    id: 'c0000006-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation6,
    productId: productIds.product2,
    quantity: 1,
    unitPrice: '28000000.00',
    total: '28000000.00',
    notes: 'Wheel loader for infrastructure project',
  },
  {
    id: 'c0000007-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation7,
    productId: productIds.product3,
    quantity: 1,
    unitPrice: '32000000.00',
    total: '32000000.00',
    notes: 'Wheel loader for construction site',
  },
  {
    id: 'c0000008-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation8,
    productId: productIds.product4,
    quantity: 1,
    unitPrice: '45000000.00',
    total: '45000000.00',
    notes: 'Bulldozer for large construction project',
  },
  {
    id: 'c0000009-0000-4000-a000-000000000001',
    quotationId: quotationIds.quotation9,
    productId: productIds.product5,
    quantity: 1,
    unitPrice: '22000000.00',
    total: '22000000.00',
    notes: 'Excavator for logistics center',
  },
];
