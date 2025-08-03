import { INVOICE_STATUS } from '../enum';
import { branchIds } from './branches';
import { customerIds } from './customers';
import { productIds } from './products';
import { quotationIds } from './quotations';
import { userIds } from './users';

export const invoiceIds = {
  invoice1: '60000001-0000-4000-a000-000000000001',
  invoice2: '60000002-0000-4000-a000-000000000001',
  invoice3: '60000003-0000-4000-a000-000000000001',
  invoice4: '60000004-0000-4000-a000-000000000001',
  invoice5: '60000005-0000-4000-a000-000000000001',
  invoice6: '60000006-0000-4000-a000-000000000001',
};

export const invoices = [
  {
    id: invoiceIds.invoice1,
    invoiceNumber: 'INV/2025/04/001',
    quotationId: quotationIds.quotation3, // Accepted quotation
    invoiceDate: new Date('2025-04-30'),
    dueDate: new Date('2025-05-30'),
    customerId: customerIds.customer3,
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    contractNumber: null,
    customerPoNumber: 'PO-2025-001',
    subtotal: '35000000.00',
    tax: '3500000.00',
    total: '38500000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.PAID,
    paymentTerms: 'Bank Transfer',
    notes: 'Invoice for premium equipment package - payment received',
    salesmanUserId: userIds.staff_pekanbaru,
    isIncludePPN: true,
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: invoiceIds.invoice2,
    invoiceNumber: 'INV/2025/06/001',
    quotationId: quotationIds.quotation7, // Accepted quotation
    invoiceDate: new Date('2025-06-20'),
    dueDate: new Date('2025-07-20'),
    customerId: customerIds.customer2,
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    contractNumber: 'CONTRACT-2025-002',
    customerPoNumber: 'PO-2025-002',
    subtotal: '32000000.00',
    tax: '3200000.00',
    total: '35200000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.SENT,
    paymentTerms: 'Bank Transfer',
    notes: 'Invoice for JCB backhoe loader - pending payment',
    salesmanUserId: userIds.staff_pekanbaru,
    isIncludePPN: true,
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: invoiceIds.invoice3,
    invoiceNumber: 'INV/2025/07/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-07-15'),
    dueDate: new Date('2025-08-15'),
    customerId: customerIds.customer1,
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    contractNumber: 'CONTRACT-2025-003',
    customerPoNumber: 'PO-2025-003',
    subtotal: '18500000.00',
    tax: '1850000.00',
    total: '20350000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.DRAFT,
    paymentTerms: 'Bank Transfer',
    notes: 'Direct invoice for Shantui wheel loader',
    salesmanUserId: userIds.staff_pekanbaru,
    isIncludePPN: true,
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: invoiceIds.invoice4,
    invoiceNumber: 'INV/2025/08/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-08-10'),
    dueDate: new Date('2025-09-10'),
    customerId: customerIds.customer4,
    branchId: branchIds.balikpapan, // Created by Rini at Balikpapan branch
    contractNumber: 'CONTRACT-2025-004',
    customerPoNumber: 'PO-2025-004',
    subtotal: '22000000.00',
    tax: '0.00',
    total: '22000000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.SENT,
    paymentTerms: 'Cash',
    notes: 'Direct invoice for bulldozer - no PPN',
    salesmanUserId: userIds.user4,
    isIncludePPN: false,
    createdBy: userIds.user4, // Rini - Balikpapan branch
  },
  {
    id: invoiceIds.invoice5,
    invoiceNumber: 'INV/2025/09/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-09-05'),
    dueDate: new Date('2025-10-05'),
    customerId: customerIds.customer5,
    branchId: branchIds.kendari, // Created by Budi at Kendari branch
    contractNumber: 'CONTRACT-2025-005',
    customerPoNumber: 'PO-CAT-2025',
    subtotal: '42000000.00',
    tax: '4200000.00',
    total: '46200000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.PAID,
    paymentTerms: 'Bank Transfer',
    notes: 'Direct invoice for Caterpillar excavator - payment received',
    salesmanUserId: userIds.manager_kendari,
    isIncludePPN: true,
    createdBy: userIds.manager_kendari, // Budi - Kendari branch
  },
  {
    id: invoiceIds.invoice6,
    invoiceNumber: 'INV/2025/10/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-10-01'),
    dueDate: new Date('2025-11-01'),
    customerId: customerIds.customer3,
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    contractNumber: 'CONTRACT-2025-006',
    customerPoNumber: 'PO-2025-006',
    subtotal: '13500000.00',
    tax: '1350000.00',
    total: '14850000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.VOID,
    paymentTerms: 'Bank Transfer',
    notes: 'Voided invoice due to customer cancellation',
    salesmanUserId: userIds.staff_pekanbaru,
    isIncludePPN: true,
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
];

export const invoiceItems = [
  {
    id: 'ab000001-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice1,
    productId: productIds.product4,
    quantity: 1,
    unitPrice: '35000000.00',
    total: '35000000.00',
  },
  {
    id: 'ab000002-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice2,
    productId: productIds.product3,
    quantity: 1,
    unitPrice: '32000000.00',
    total: '32000000.00',
  },
  {
    id: 'ab000003-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice3,
    productId: productIds.product1,
    quantity: 1,
    unitPrice: '18500000.00',
    total: '18500000.00',
  },
  {
    id: 'ab000004-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice4,
    productId: productIds.product4,
    quantity: 1,
    unitPrice: '22000000.00',
    total: '22000000.00',
  },
  {
    id: 'ab000005-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice5,
    productId: productIds.product5,
    quantity: 1,
    unitPrice: '42000000.00',
    total: '42000000.00',
  },
  {
    id: 'ab000006-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice6,
    productId: productIds.product2,
    quantity: 1,
    unitPrice: '13500000.00',
    total: '13500000.00',
  },
];
