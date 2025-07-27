'use client';

import { useCallback, useState } from 'react';

import { Root as TabMenuHorizontal, Trigger as TabMenuTrigger, List as TabMenuList, Content as TabMenuContent } from '@/components/ui/tab-menu-horizontal';
import { PermissionGate } from '@/components/auth/permission-gate';

import { BrandsTable } from './brands-table';
import { UnitOfMeasuresTable } from './unit-of-measures-table';
import { MachineTypesTable } from './machine-types-table';

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
            Manage brands, units of measurement, and machine types
          </p>
        </div>
      </div>

      {/* Tabs */}
      <TabMenuHorizontal value={activeTab} onValueChange={handleTabChange}>
        <TabMenuList>
          <TabMenuTrigger value='brands'>Brands</TabMenuTrigger>
          <TabMenuTrigger value='unit-of-measures'>Unit of Measures</TabMenuTrigger>
          <TabMenuTrigger value='machine-types'>Machine Types</TabMenuTrigger>
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
      </TabMenuHorizontal>
    </div>
  );
}