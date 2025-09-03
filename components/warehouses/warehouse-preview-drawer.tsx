'use client';

import { useEffect, useState } from 'react';
import {
  RiEditLine,
  RiExternalLinkLine,
  RiMapPinLine,
  RiStoreLine,
  RiUserLine,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';

interface Warehouse {
  id: string;
  name: string;
  address?: string;
  managerId?: string;
  managerFirstName?: string;
  managerLastName?: string;
  branchId: string;
  branchName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WarehousePreviewDrawerProps {
  warehouseId: string | null;
  open: boolean;
  onClose: () => void;
}

export function WarehousePreviewDrawer({
  warehouseId,
  open,
  onClose,
}: WarehousePreviewDrawerProps) {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouse = async () => {
      if (!warehouseId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/warehouses/${warehouseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch warehouse details');
        }
        const data = await response.json();
        setWarehouse(data.data || data);
      } catch (err) {
        console.error('Error fetching warehouse:', err);
        setError('Failed to load warehouse details');
      } finally {
        setIsLoading(false);
      }
    };

    if (warehouseId && open) {
      fetchWarehouse();
    }
  }, [warehouseId, open]);

  if (!open) return null;

  const formatManagerName = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'No manager assigned';
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  };

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Warehouse Details</Drawer.Title>
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

          {!isLoading && !error && !warehouse && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-text-sub-600'>
                Warehouse not found
              </div>
            </div>
          )}

          {warehouse && <WarehousePreviewContent warehouse={warehouse} />}
        </Drawer.Body>

        {warehouse && <WarehousePreviewFooter warehouse={warehouse} />}
      </Drawer.Content>
    </Drawer.Root>
  );
}

function WarehousePreviewContent({ warehouse }: { warehouse: Warehouse }) {
  const formatManagerName = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'No manager assigned';
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  };

  return (
    <>
      <Divider.Root variant='solid-text'>Warehouse Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-start justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='text-title-h5 text-text-strong-950'>
              {warehouse.name}
            </div>
          </div>
          <div className='ml-4'>
            <Badge.Root
              variant='lighter'
              color={warehouse.isActive ? 'green' : 'red'}
            >
              {warehouse.isActive ? 'Active' : 'Inactive'}
            </Badge.Root>
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Address
          </div>
          <div className='mt-1 flex items-start gap-1 text-label-sm text-text-strong-950'>
            <RiMapPinLine className='mt-0.5 size-4 shrink-0 text-text-soft-400' />
            <span className='break-words'>
              {warehouse.address || 'No address provided'}
            </span>
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Manager
          </div>
          <div className='mt-1 flex items-center gap-1 text-label-sm text-text-strong-950'>
            <RiUserLine className='size-4 text-text-soft-400' />
            {formatManagerName(
              warehouse.managerFirstName,
              warehouse.managerLastName,
            )}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Branch
          </div>
          <div className='mt-1 flex items-center gap-1 text-label-sm text-text-strong-950'>
            <RiMapPinLine className='size-4 text-text-soft-400' />
            {warehouse.branchName || 'No branch assigned'}
          </div>
        </div>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(warehouse.createdAt).toLocaleDateString()}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Last Updated
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(warehouse.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}

function WarehousePreviewFooter({ warehouse }: { warehouse: Warehouse }) {
  const handleViewFull = () => {
    window.open(`/warehouses/${warehouse.id}`, '_blank');
  };

  const handleEdit = () => {
    window.open(`/warehouses/${warehouse.id}/edit`, '_blank');
  };

  return (
    <Drawer.Footer className='border-t'>
      <div className='flex w-full gap-3'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='medium'
          className='flex-1'
          onClick={handleEdit}
        >
          <Button.Icon as={RiEditLine} />
          Edit
        </Button.Root>
        <Button.Root
          variant='primary'
          size='medium'
          className='flex-1'
          onClick={handleViewFull}
        >
          <Button.Icon as={RiExternalLinkLine} />
          View Details
        </Button.Root>
      </div>
    </Drawer.Footer>
  );
}
