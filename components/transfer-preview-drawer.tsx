'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiArrowRightLine,
  RiBox3Line,
  RiExchangeFundsLine,
  RiExternalLinkLine,
  RiReceiptLine,
  RiStoreLine,
  RiTruckLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';

interface StockMovement {
  id: string;
  warehouseIdFrom: string;
  warehouseFromName: string;
  warehouseIdTo: string;
  warehouseToName: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  movementType: string;
  invoiceId?: string;
  deliveryId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TransferPreviewDrawerProps {
  transferId: string | null;
  open: boolean;
  onClose: () => void;
}

const getMovementTypeColor = (type: string) => {
  switch (type) {
    case 'in':
      return 'green';
    case 'out':
      return 'red';
    case 'transfer':
      return 'blue';
    case 'adjustment':
      return 'orange';
    default:
      return 'gray';
  }
};

export function TransferPreviewDrawer({
  transferId,
  open,
  onClose,
}: TransferPreviewDrawerProps) {
  const [transfer, setTransfer] = useState<StockMovement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  useEffect(() => {
    const fetchTransfer = async () => {
      if (!transferId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/transfers/${transferId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transfer details');
        }
        const data = await response.json();
        setTransfer(data.data || data);
      } catch (err) {
        console.error('Error fetching transfer:', err);
        setError('Failed to load transfer details');
      } finally {
        setIsLoading(false);
      }
    };

    if (transferId && open) {
      fetchTransfer();
    }
  }, [transferId, open]);

  if (!open) return null;

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('id-ID').format(quantity);
  };

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className={isMobile ? 'max-w-full' : 'max-w-md'}>
        <Drawer.Header>
          <Drawer.Title>Stock Movement Details</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-text-sub-600'>
                Loading...
              </div>
            </div>
          )}

          {error && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-red-600'>{error}</div>
            </div>
          )}

          {!isLoading && !error && !transfer && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-text-sub-600'>
                Transfer not found
              </div>
            </div>
          )}

          {transfer && <TransferPreviewContent transfer={transfer} />}
        </Drawer.Body>

        {transfer && <TransferPreviewFooter transfer={transfer} />}
      </Drawer.Content>
    </Drawer.Root>
  );
}

function TransferPreviewContent({ transfer }: { transfer: StockMovement }) {
  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('id-ID').format(quantity);
  };

  return (
    <>
      <Divider.Root variant='solid-text'>Movement Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-start justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='text-title-h4 text-text-strong-950'>
              Stock Movement
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              ID: {transfer.id}
            </div>
          </div>
          <div className='ml-4'>
            <Badge.Root
              variant='light'
              color={getMovementTypeColor(transfer.movementType)}
            >
              {transfer.movementType.toUpperCase()}
            </Badge.Root>
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Product</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center gap-3'>
          <div className='bg-gray-50 ring-gray-200 flex size-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset'>
            <RiBox3Line className='text-gray-600 size-5' />
          </div>
          <div>
            <div className='text-label-md font-medium text-text-strong-950'>
              {transfer.productName}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              {transfer.productCode}
            </div>
          </div>
        </div>

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Quantity
          </div>
          <div className='mt-1 text-label-lg font-medium text-text-strong-950'>
            {formatQuantity(transfer.quantity)}
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Warehouses</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <RiStoreLine className='text-text-sub-400 size-4' />
            <span className='text-label-sm text-text-strong-950'>
              {transfer.warehouseFromName}
            </span>
          </div>
          <RiArrowRightLine className='text-text-sub-400 size-4' />
          <div className='flex items-center gap-2'>
            <RiStoreLine className='text-text-sub-400 size-4' />
            <span className='text-label-sm text-text-strong-950'>
              {transfer.warehouseToName}
            </span>
          </div>
        </div>
      </div>

      {(transfer.invoiceId || transfer.deliveryId) && (
        <>
          <Divider.Root variant='solid-text'>References</Divider.Root>
          <div className='flex flex-col gap-3 p-5'>
            {transfer.invoiceId && (
              <div className='flex items-center gap-2'>
                <RiReceiptLine className='text-text-sub-400 size-4' />
                <span className='text-label-sm text-text-strong-950'>
                  Invoice: {transfer.invoiceId}
                </span>
              </div>
            )}
            {transfer.deliveryId && (
              <div className='flex items-center gap-2'>
                <RiTruckLine className='text-text-sub-400 size-4' />
                <span className='text-label-sm text-text-strong-950'>
                  Delivery: {transfer.deliveryId}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {transfer.notes && (
        <>
          <Divider.Root variant='solid-text'>Notes</Divider.Root>
          <div className='p-5'>
            <div className='text-paragraph-sm text-text-sub-600'>
              {transfer.notes}
            </div>
          </div>
        </>
      )}

      <Divider.Root variant='solid-text'>Metadata</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(transfer.createdAt)}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Last Updated
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(transfer.updatedAt)}
          </div>
        </div>
      </div>
    </>
  );
}

function TransferPreviewFooter({ transfer }: { transfer: StockMovement }) {
  const handleViewFull = () => {
    window.open(`/transfers/${transfer.id}`, '_blank');
  };

  return (
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='primary'
        size='medium'
        className='w-full'
        onClick={handleViewFull}
      >
        <Button.Icon as={RiExternalLinkLine} />
        View Full Details
      </Button.Root>
    </Drawer.Footer>
  );
}
