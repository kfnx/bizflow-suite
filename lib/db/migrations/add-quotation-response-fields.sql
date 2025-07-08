-- Add customer response fields to quotations table
ALTER TABLE quotations 
ADD COLUMN customer_response_date TIMESTAMP NULL,
ADD COLUMN customer_response_notes TEXT NULL,
ADD COLUMN customer_acceptance_info TEXT NULL,
ADD COLUMN rejection_reason TEXT NULL,
ADD COLUMN revision_reason TEXT NULL;