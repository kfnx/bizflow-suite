import { desc, like, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { invoices } from '@/lib/db/schema';

/**
 * Generates the next invoice number in INV/YYYY/MM/XXX format
 * Uses database transaction with table locking to prevent race conditions
 */
export async function generateNextInvoiceNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `INV/${year}/${month}/`;

  // Use a transaction to atomically find the next sequence number
  return await db.transaction(async (tx) => {
    // Lock the table to prevent concurrent access
    await tx.execute(sql`LOCK TABLES invoices WRITE`);

    try {
      // Find the highest sequence number for this month
      const result = await tx
        .select({
          invoiceNumber: invoices.invoiceNumber,
        })
        .from(invoices)
        .where(like(invoices.invoiceNumber, `${prefix}%`))
        .orderBy(desc(invoices.invoiceNumber))
        .limit(1);

      let nextSequence = 1;
      if (result.length > 0) {
        const lastNumber = result[0].invoiceNumber;
        const lastSequence = parseInt(lastNumber.split('/').pop() || '0');
        nextSequence = lastSequence + 1;
      }

      const sequence = nextSequence.toString().padStart(3, '0');
      return `${prefix}${sequence}`;
    } finally {
      await tx.execute(sql`UNLOCK TABLES`);
    }
  });
}
