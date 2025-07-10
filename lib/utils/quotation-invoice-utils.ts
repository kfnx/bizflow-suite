/**
 * Utility functions for handling quotation to invoice workflow
 *
 * Database Schema:
 * - quotations.invoiced_at: TIMESTAMP - When the quotation was converted to invoice
 * - quotations.invoice_id: VARCHAR(36) - ID of the generated invoice
 *
 * Status Flow:
 * 1. draft -> submitted -> approved/rejected
 * 2. approved -> sent -> accepted/rejected/revised
 * 3. accepted -> [marked as invoiced when invoice is created]
 *
 * Usage Examples:
 *
 * // Check if quotation can be converted to invoice
 * if (canCreateInvoice(quotation)) {
 *   // Create invoice from quotation
 *   const invoice = await createInvoiceFromQuotation(quotation.id);
 *
 *   // Mark quotation as invoiced
 *   await markQuotationAsInvoiced(quotation.id, invoice.id);
 * }
 *
 * // Get all quotations ready for invoicing
 * const readyQuotations = await fetchQuotations({
 *   status: 'accepted',
 *   ready_for_invoice: 'true'
 * });
 *
 * // Check if quotation has been invoiced
 * if (isQuotationInvoiced(quotation)) {
 *   console.log(`Invoiced on: ${quotation.invoicedAt}`);
 *   console.log(`Invoice ID: ${quotation.invoiceId}`);
 * }
 */

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { Quotation, QuotationDetail } from '@/hooks/use-quotations';

/**
 * Check if a quotation has been converted to an invoice
 */
export const isQuotationInvoiced = (
  quotation: QuotationDetail | Quotation,
): boolean => {
  return 'invoiceId' in quotation ? !!quotation.invoiceId : false;
};

/**
 * Check if a quotation can be converted to an invoice
 * Requirements: Status must be 'accepted' and not already invoiced
 */
export const canCreateInvoice = (
  quotation: QuotationDetail | Quotation,
): boolean => {
  return (
    quotation.status === QUOTATION_STATUS.ACCEPTED &&
    !isQuotationInvoiced(quotation)
  );
};

/**
 * Get human-readable invoice status
 */
export const getInvoiceStatus = (
  quotation: QuotationDetail | Quotation,
): string => {
  if (quotation.status !== QUOTATION_STATUS.ACCEPTED) {
    return 'Not ready for invoicing';
  }

  if (isQuotationInvoiced(quotation)) {
    return 'Invoiced';
  }

  return 'Ready for invoicing';
};

/**
 * SQL queries for common operations:
 *
 * -- Find accepted quotations ready for invoicing
 * SELECT * FROM quotations
 * WHERE status = 'accepted' AND invoiced_at IS NULL;
 *
 * -- Mark quotation as invoiced
 * UPDATE quotations
 * SET invoiced_at = NOW(), invoice_id = ?
 * WHERE id = ? AND status = 'accepted' AND invoiced_at IS NULL;
 *
 * -- Get quotations with their invoice information
 * SELECT q.*, i.invoice_number, i.invoice_date
 * FROM quotations q
 * LEFT JOIN invoices i ON q.invoice_id = i.id
 * WHERE q.status = 'accepted';
 *
 * -- Find quotations that were invoiced in a specific period
 * SELECT * FROM quotations
 * WHERE invoiced_at BETWEEN ? AND ?;
 */
