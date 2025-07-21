import { INVOICE_STATUS } from '../enum';
import {
  customerIds,
  invoiceIds,
  productIds,
  quotationIds,
  userIds,
} from './seed-constants';

export const invoices = [
  {
    id: invoiceIds.invoice1,
    invoiceNumber: 'INV/2025/04/001',
    quotationId: quotationIds.quotation3, // Accepted quotation
    invoiceDate: new Date('2025-04-30'),
    dueDate: new Date('2025-05-30'),
    customerId: customerIds.customer3,
    branchId: 'pekanbaru', // Created by Asep at Pekanbaru branch
    subtotal: '35000000.00',
    tax: '3500000.00',
    total: '38500000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.PAID,
    paymentMethod: 'Bank Transfer',
    notes: 'Invoice for premium equipment package - payment received',
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: invoiceIds.invoice2,
    invoiceNumber: 'INV/2025/06/001',
    quotationId: quotationIds.quotation7, // Accepted quotation
    invoiceDate: new Date('2025-06-20'),
    dueDate: new Date('2025-07-20'),
    customerId: customerIds.customer2,
    branchId: 'pekanbaru', // Created by Asep at Pekanbaru branch
    subtotal: '32000000.00',
    tax: '3200000.00',
    total: '35200000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.SENT,
    paymentMethod: 'Bank Transfer',
    notes: 'Invoice for JCB backhoe loader - pending payment',
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: invoiceIds.invoice3,
    invoiceNumber: 'INV/2025/07/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-07-15'),
    dueDate: new Date('2025-08-15'),
    customerId: customerIds.customer1,
    branchId: 'pekanbaru', // Created by Asep at Pekanbaru branch
    subtotal: '18500000.00',
    tax: '1850000.00',
    total: '20350000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.DRAFT,
    paymentMethod: 'Bank Transfer',
    notes: 'Direct invoice for Shantui wheel loader',
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: invoiceIds.invoice4,
    invoiceNumber: 'INV/2025/08/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-08-10'),
    dueDate: new Date('2025-09-10'),
    customerId: customerIds.customer4,
    branchId: 'balikpapan', // Created by Rini at Balikpapan branch
    subtotal: '22000000.00',
    tax: '0.00',
    total: '22000000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.SENT,
    paymentMethod: 'Cash',
    notes: 'Direct invoice for bulldozer - no PPN',
    createdBy: userIds.user4, // Rini - Balikpapan branch
  },
  {
    id: invoiceIds.invoice5,
    invoiceNumber: 'INV/2025/09/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-09-05'),
    dueDate: new Date('2025-10-05'),
    customerId: customerIds.customer5,
    branchId: 'kendari', // Created by Budi at Kendari branch
    subtotal: '42000000.00',
    tax: '4200000.00',
    total: '46200000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.PAID,
    paymentMethod: 'Bank Transfer',
    notes: 'Direct invoice for Caterpillar excavator - payment received',
    createdBy: userIds.manager_kendari, // Budi - Kendari branch
  },
  {
    id: invoiceIds.invoice6,
    invoiceNumber: 'INV/2025/10/001',
    quotationId: null, // Direct invoice without quotation
    invoiceDate: new Date('2025-10-01'),
    dueDate: new Date('2025-11-01'),
    customerId: customerIds.customer3,
    branchId: 'pekanbaru', // Created by Asep at Pekanbaru branch
    subtotal: '13500000.00',
    tax: '1350000.00',
    total: '14850000.00',
    currency: 'IDR',
    status: INVOICE_STATUS.VOID,
    paymentMethod: 'Bank Transfer',
    notes: 'Voided invoice due to customer cancellation',
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
];

export const invoiceItems = [
  {
    id: 'b0000001-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice1,
    productId: productIds.product4,
    quantity: 1,
    unitPrice: '35000000.00',
    total: '35000000.00',
    paymentTerms: 'NET 30',
    termsAndConditions: 'Standard payment terms apply',
    notes: 'Bulldozer with advanced controls - fully paid',
  },
  {
    id: 'b0000002-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice2,
    productId: productIds.product3,
    quantity: 1,
    unitPrice: '32000000.00',
    total: '32000000.00',
    paymentTerms: 'NET 30',
    termsAndConditions: 'Payment due within 30 days',
    notes: 'Wheel loader for construction site',
  },
  {
    id: 'b0000003-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice3,
    productId: productIds.product1,
    quantity: 1,
    unitPrice: '18500000.00',
    total: '18500000.00',
    paymentTerms: 'NET 30',
    termsAndConditions: 'Standard terms and conditions',
    notes: 'Shantui wheel loader - direct sale',
  },
  {
    id: 'b0000004-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice4,
    productId: productIds.product4,
    quantity: 1,
    unitPrice: '22000000.00',
    total: '22000000.00',
    paymentTerms: 'NET 15',
    termsAndConditions: 'Cash payment preferred',
    notes: 'Shantui bulldozer - no PPN applied',
  },
  {
    id: 'b0000005-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice5,
    productId: productIds.product5,
    quantity: 1,
    unitPrice: '42000000.00',
    total: '42000000.00',
    paymentTerms: 'NET 30',
    termsAndConditions: 'Premium equipment warranty included',
    notes: 'Excavator - payment received',
  },
  {
    id: 'b0000006-0000-4000-a000-000000000001',
    invoiceId: invoiceIds.invoice6,
    productId: productIds.product2,
    quantity: 1,
    unitPrice: '13500000.00',
    total: '13500000.00',
    paymentTerms: 'NET 30',
    termsAndConditions: 'Standard terms apply',
    notes: 'Wheel loader - voided due to cancellation',
  },
];
