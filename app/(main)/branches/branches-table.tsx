'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  RiDeleteBin6Line,
  RiEditLine,
  RiMapPin2Line,
  RiMore2Fill,
} from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';

import type { Branch, BranchesFilters } from '@/hooks/use-branches';
import { useBranches, useDeleteBranch } from '@/hooks/use-branches';
import * as Button from '@/components/ui/button';
import { DataTable, type PaginationInfo } from '@/components/ui/data-table';
import * as Dropdown from '@/components/ui/dropdown';
import * as Modal from '@/components/ui/modal';
import { PermissionGate } from '@/components/auth/permission-gate';

interface BranchesTableProps {
  filters: BranchesFilters;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function BranchesTable({
  filters,
  onPageChange,
  onLimitChange,
}: BranchesTableProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [branchToDelete, setBranchToDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, error } = useBranches({
    ...filters,
    limit: 10,
    page: 1,
  });
  const deleteBranchMutation = useDeleteBranch();

  const handleDeleteClick = React.useCallback(
    (branch: { id: string; name: string }) => {
      setBranchToDelete(branch);
      setDeleteModalOpen(true);
    },
    [],
  );

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!branchToDelete) return;

    try {
      await deleteBranchMutation.mutateAsync(branchToDelete.id);
      setDeleteModalOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  }, [branchToDelete, deleteBranchMutation]);

  const columns: ColumnDef<Branch>[] = React.useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <RiMapPin2Line className='text-gray-400 size-4' />
            <span className='font-medium'>{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='xsmall'
                className='size-8 p-0'
                onClick={(e) => e.stopPropagation()}
              >
                <RiMore2Fill className='size-4' />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align='end'>
              <PermissionGate permission='branches:update'>
                <Dropdown.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/branches/${row.original.id}/edit`);
                  }}
                >
                  <RiEditLine className='size-4' />
                  Edit
                </Dropdown.Item>
              </PermissionGate>
              <PermissionGate permission='branches:delete'>
                <Dropdown.Separator />
                <Dropdown.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(row.original);
                  }}
                  className='text-red-600'
                >
                  <RiDeleteBin6Line className='size-4' />
                  Delete
                </Dropdown.Item>
              </PermissionGate>
            </Dropdown.Content>
          </Dropdown.Root>
        ),
      },
    ],
    [handleDeleteClick, router],
  );

  const pagination: PaginationInfo | undefined = data?.pagination
    ? {
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }
    : undefined;

  const emptyState = {
    icon: RiMapPin2Line,
    title: 'No branches found',
    description: 'Get started by creating a new branch.',
    action: {
      label: 'Add Branch',
      onClick: () => router.push('/branches/new'),
    },
  };

  return (
    <>
      <DataTable
        data={data?.data || []}
        columns={columns}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        emptyState={emptyState}
        tableClassName='rounded-lg border border-stroke-soft-200 bg-bg-white-0'
      />

      {/* Delete Confirmation Modal */}
      <Modal.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Modal.Content>
          <Modal.Header className='flex'>
            <Modal.Title>Delete Branch</Modal.Title>
          </Modal.Header>
          <div className='px-8 py-4'>
            <p>
              Are you sure you want to delete the branch &quot;
              {branchToDelete?.name}
              &quot;?
            </p>
            <br />
            <p>
              action cannot be undone and will fail if there are users assigned
              to this branch.
            </p>
          </div>
          <Modal.Footer>
            <Button.Root
              variant='neutral'
              mode='ghost'
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteBranchMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='error'
              onClick={handleDeleteConfirm}
              disabled={deleteBranchMutation.isPending}
            >
              {deleteBranchMutation.isPending ? 'Deleting...' : 'Delete Branch'}
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
