'use client';

import {
  RiArrowRightLine,
  RiBox3Line,
  RiCalendarLine,
  RiExternalLinkLine,
  RiReceiptLine,
  RiStoreLine,
  RiTruckLine,
  RiUserLine,
} from '@remixicon/react';

import { useTransfer, type Transfer } from '@/hooks/use-transfers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import * as Table from '@/components/ui/table';

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'approved':
      return 'blue';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

export function TransferPreviewDrawer({
  transferId,
  open,
  onClose,
}: TransferPreviewDrawerProps) {
  const { data: transfer, isLoading, error } = useTransfer(transferId);

  if (!open) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className='flex h-full flex-col'>
        <Drawer.Header>
          <Drawer.Title>Transfer Details</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className='flex-1 overflow-y-auto'>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-text-sub-600'>
                Loading...
              </div>
            </div>
          )}

          {error && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-red-600'>
                {error.message || 'Failed to load transfer details'}
              </div>
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

function TransferPreviewContent({ transfer }: { transfer: Transfer }) {
  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('id-ID').format(quantity);
  };

  return (
    <>
      <Divider.Root variant='solid-text'>Transfer Info</Divider.Root>

      <div className='p-5'>
        <div className='flex items-start justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='text-title-h5 text-text-strong-950'>
              {transfer.transferNumber}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {transfer.items && transfer.items.length > 1
                ? `${transfer.items.length} products`
                : transfer.name || 'Transfer'}
            </div>
          </div>
          <div className='ml-4 flex flex-col items-end gap-2'>
            <Badge.Root
              variant='lighter'
              color={getMovementTypeColor(transfer.movementType)}
            >
              {transfer.movementType.toUpperCase()}
            </Badge.Root>
            <Badge.Root
              variant='lighter'
              color={getStatusColor(transfer.status)}
            >
              {transfer.status.toUpperCase()}
            </Badge.Root>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {transfer.items && transfer.items.length > 0 ? (
        <>
          <Divider.Root variant='solid-text'>
            Products ({transfer.items.length})
          </Divider.Root>
          <div className='p-5'>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Product</Table.Head>
                  <Table.Head>Quantity</Table.Head>
                  <Table.Head>Notes</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {transfer.items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <div className='flex items-center gap-3'>
                        <div className='bg-gray-50 ring-gray-200 flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset'>
                          <RiBox3Line className='text-gray-600 size-4' />
                        </div>
                        <div>
                          <div className='text-label-sm font-medium text-text-strong-950'>
                            {item.productName}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className='text-label-sm font-medium text-text-strong-950'>
                        {formatQuantity(item.quantity)}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        {item.notes || '-'}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        </>
      ) : transfer.name ? (
        // Fallback for legacy single-product transfers
        <>
          <Divider.Root variant='solid-text'>Product</Divider.Root>
          <div className='flex flex-col gap-3 p-5'>
            <div className='flex items-center gap-3'>
              <div className='bg-gray-50 ring-gray-200 flex size-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset'>
                <RiBox3Line className='text-gray-600 size-5' />
              </div>
              <div>
                <div className='text-label-md font-medium text-text-strong-950'>
                  {transfer.name}
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
                {formatQuantity(transfer.quantity || 0)}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <Divider.Root variant='solid-text'>Warehouses</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <RiStoreLine className='text-text-sub-400 size-4' />
            <span className='text-label-sm text-text-strong-950'>
              {transfer.warehouseFromName || 'External Source'}
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

      <Divider.Root variant='solid-text'>Transfer Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center gap-2'>
          <RiCalendarLine className='text-text-sub-400 size-4' />
          <span className='text-label-sm text-text-strong-950'>
            Transfer Date:{' '}
            {new Date(transfer.transferDate).toLocaleDateString()}
          </span>
        </div>
        {transfer.createdByName && (
          <div className='flex items-center gap-2'>
            <RiUserLine className='text-text-sub-400 size-4' />
            <span className='text-label-sm text-text-strong-950'>
              Created by: {transfer.createdByName}
            </span>
          </div>
        )}
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
    </>
  );
}

function TransferPreviewFooter({ transfer }: { transfer: Transfer }) {
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
