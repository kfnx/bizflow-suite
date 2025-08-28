'use client';

import { useCallback, useState } from 'react';

import {
  Content as TabMenuContent,
  Root as TabMenuHorizontal,
  List as TabMenuList,
  Trigger as TabMenuTrigger,
} from '@/components/ui/tab-menu-horizontal';
import { PermissionGate } from '@/components/auth/permission-gate';

import { BrandsTable } from './brands-table';
import { ModelNumbersTable } from './machine-model-table';
import { MachineTypesTable } from './machine-types-table';
import { PartNumbersTable } from './part-numbers-table';
import { UnitOfMeasuresTable } from './unit-of-measures-table';

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState('brands');

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl text-gray-900 font-semibold'>Master Data</h1>
          <p className='text-sm text-gray-600'>
            Manage brands, units of measurement, machine types, part numbers,
            and machine model
          </p>
        </div>
      </div>

      {/* Tabs */}
      <TabMenuHorizontal value={activeTab} onValueChange={handleTabChange}>
        <TabMenuList>
          <TabMenuTrigger value='brands'>Brands</TabMenuTrigger>
          <TabMenuTrigger value='unit-of-measures'>
            Unit of Measures
          </TabMenuTrigger>
          <TabMenuTrigger value='machine-types'>Machine Types</TabMenuTrigger>
          <TabMenuTrigger value='part-numbers'>Part Numbers</TabMenuTrigger>
          <TabMenuTrigger value='machine-model'>Model Numbers</TabMenuTrigger>
        </TabMenuList>

        <TabMenuContent value='brands'>
          <PermissionGate permission='products:read'>
            <BrandsTable />
          </PermissionGate>
        </TabMenuContent>

        <TabMenuContent value='unit-of-measures'>
          <PermissionGate permission='products:read'>
            <UnitOfMeasuresTable />
          </PermissionGate>
        </TabMenuContent>

        <TabMenuContent value='machine-types'>
          <PermissionGate permission='products:read'>
            <MachineTypesTable />
          </PermissionGate>
        </TabMenuContent>

        <TabMenuContent value='part-numbers'>
          <PermissionGate permission='products:read'>
            <PartNumbersTable />
          </PermissionGate>
        </TabMenuContent>

        <TabMenuContent value='machine-model'>
          <PermissionGate permission='products:read'>
            <ModelNumbersTable />
          </PermissionGate>
        </TabMenuContent>
      </TabMenuHorizontal>
    </div>
  );
}
