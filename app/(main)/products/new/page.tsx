'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiBox1Line } from '@remixicon/react';

import { useSuppliers } from '@/hooks/use-suppliers';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import { Root as TextareaRoot } from '@/components/ui/textarea';
import Header from '@/components/header';

export default function NewProductPage() {
  const router = useRouter();
  const { data: suppliersData } = useSuppliers();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    year: '',
    condition: 'new',
    status: 'in_stock',
    location: '',
    unit: '',
    price: '',
    currency: 'IDR',
    engineModel: '',
    enginePower: '',
    operatingWeight: '',
    supplierId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBox1Line className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Product'
        description='Add a new product to your inventory.'
      >
        <Button.Root
          mode='ghost'
          size='small'
          onClick={() => router.back()}
          className='hidden lg:flex'
        >
          <RiArrowLeftLine className='size-4' />
          Back
        </Button.Root>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Basic Information
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='code'>
                  Product Code <span className='text-red-500'>*</span>
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='code'
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder='PROD001'
                    required
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='name'>
                  Product Name <span className='text-red-500'>*</span>
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='name'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder='Excavator Shantui SE200'
                    required
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='category'>Category</Label.Root>
                <Select.Root
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange('category', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select category' />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='excavator'>Excavator</Select.Item>
                    <Select.Item value='bulldozer'>Bulldozer</Select.Item>
                    <Select.Item value='wheel_loader'>Wheel Loader</Select.Item>
                    <Select.Item value='backhoe_loader'>
                      Backhoe Loader
                    </Select.Item>
                    <Select.Item value='compactor'>Compactor</Select.Item>
                    <Select.Item value='forklift'>Forklift</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='brand'>Brand</Label.Root>
                <Select.Root
                  value={formData.brand}
                  onValueChange={(value) => handleInputChange('brand', value)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select brand' />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='Shantui'>Shantui</Select.Item>
                    <Select.Item value='Caterpillar'>Caterpillar</Select.Item>
                    <Select.Item value='Komatsu'>Komatsu</Select.Item>
                    <Select.Item value='Hitachi'>Hitachi</Select.Item>
                    <Select.Item value='Volvo'>Volvo</Select.Item>
                    <Select.Item value='JCB'>JCB</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='model'>Model</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='model'
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder='SE200'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='year'>Year</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='year'
                    type='number'
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder='2024'
                    min='1900'
                    max='2030'
                    className='px-3'
                  />
                </Input.Root>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Product Details
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='condition'>Condition</Label.Root>
                <Select.Root
                  value={formData.condition}
                  onValueChange={(value) =>
                    handleInputChange('condition', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='new'>New</Select.Item>
                    <Select.Item value='used'>Used</Select.Item>
                    <Select.Item value='refurbished'>Refurbished</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='status'>Status</Label.Root>
                <Select.Root
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='in_stock'>In Stock</Select.Item>
                    <Select.Item value='out_of_stock'>Out of Stock</Select.Item>
                    <Select.Item value='discontinued'>Discontinued</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='location'>Location</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='location'
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    placeholder='Warehouse A, Section 1'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='unit'>
                  Unit <span className='text-red-500'>*</span>
                </Label.Root>
                <Select.Root
                  value={formData.unit}
                  onValueChange={(value) => handleInputChange('unit', value)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select unit' />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='pcs'>Pieces</Select.Item>
                    <Select.Item value='kg'>Kilograms</Select.Item>
                    <Select.Item value='m'>Meters</Select.Item>
                    <Select.Item value='l'>Liters</Select.Item>
                    <Select.Item value='set'>Set</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Pricing
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='price'>Price</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='price'
                    type='number'
                    step='0.01'
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder='0.00'
                    min='0'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='currency'>Currency</Label.Root>
                <Select.Root
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange('currency', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='IDR'>IDR</Select.Item>
                    <Select.Item value='USD'>USD</Select.Item>
                    <Select.Item value='EUR'>EUR</Select.Item>
                    <Select.Item value='SGD'>SGD</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='supplierId'>Supplier</Label.Root>
                <Select.Root
                  value={formData.supplierId}
                  onValueChange={(value) =>
                    handleInputChange('supplierId', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select supplier' />
                  </Select.Trigger>
                  <Select.Content>
                    {suppliersData?.data.map((supplier) => (
                      <Select.Item key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.code})
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Specifications
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='engineModel'>Engine Model</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='engineModel'
                    value={formData.engineModel}
                    onChange={(e) =>
                      handleInputChange('engineModel', e.target.value)
                    }
                    placeholder='Cummins QSB6.7'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='enginePower'>Engine Power</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='enginePower'
                    value={formData.enginePower}
                    onChange={(e) =>
                      handleInputChange('enginePower', e.target.value)
                    }
                    placeholder='378 hp'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='operatingWeight'>
                  Operating Weight
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='operatingWeight'
                    value={formData.operatingWeight}
                    onChange={(e) =>
                      handleInputChange('operatingWeight', e.target.value)
                    }
                    placeholder='47,250 kg'
                    className='px-3'
                  />
                </Input.Root>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Description
            </h2>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='description'>Product Description</Label.Root>
              <TextareaRoot
                id='description'
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder='Enter detailed product description...'
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end gap-3'>
            <Button.Root
              type='button'
              mode='ghost'
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' mode='filled' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
