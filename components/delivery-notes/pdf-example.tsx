'use client';

import React from 'react';

import { DeliveryNotePDF } from './pdf';

// Example data that matches the DeliveryNoteDetail structure
const exampleDeliveryNote = {
  id: '1',
  deliveryNumber: '074/JKT-STISJ/VII/2025',
  customerId: '1',
  deliveryDate: '2025-07-18',
  deliveryMethod: 'Laut',
  status: 'pending',
  createdBy: '1',
  createdAt: '2025-07-18T00:00:00Z',
  updatedAt: '2025-07-18T00:00:00Z',
  customer: {
    id: '1',
    code: 'CUST001',
    name: 'PT Borneo Multi Traktor',
    address: 'JL A. YANI KM 10 No 12',
    city: 'Sungai Lakum, Banjarmasin',
    province: 'KALSEL',
    country: 'Indonesia',
    postalCode: '70123',
    contactPersons: [
      {
        id: '1',
        prefix: 'Bp',
        name: 'Ahim',
        email: 'ahim@borneo.com',
        phone: '0813-4741-7777',
      },
    ],
  },
  items: [
    {
      id: '1',
      productId: '1',
      quantity: 2,
      product: {
        id: '1',
        name: 'AIR FILTER INNER',
        code: '60650-07-00008',
        category: 'non_serialized',
        partNumber: '60650-07-00008',
        modelNumber: 'SE215W',
      },
    },
    {
      id: '2',
      productId: '2',
      quantity: 2,
      product: {
        id: '2',
        name: 'PILOT FILTER ELEMENT',
        code: '60210-84-00009',
        category: 'non_serialized',
        partNumber: '60210-84-00009',
        modelNumber: 'SE215W',
      },
    },
    {
      id: '3',
      productId: '3',
      quantity: 2,
      product: {
        id: '3',
        name: 'RETURN FILTER HYD',
        code: '60210-78-00028',
        category: 'non_serialized',
        partNumber: '60210-78-00028',
        modelNumber: 'SE215W',
      },
    },
    {
      id: '4',
      productId: '4',
      quantity: 2,
      product: {
        id: '4',
        name: 'BREATHER FILTER',
        code: '60550-78-00041',
        category: 'non_serialized',
        partNumber: '60550-78-00041',
        modelNumber: 'SE215W',
      },
    },
    {
      id: '5',
      productId: '5',
      quantity: 2,
      product: {
        id: '5',
        name: 'FILTER CABIN AC',
        code: '60210-38-00015',
        category: 'non_serialized',
        partNumber: '60210-38-00015',
        modelNumber: 'SE215W',
      },
    },
    {
      id: '6',
      productId: '6',
      quantity: 2,
      product: {
        id: '6',
        name: 'FILTER AC',
        code: '60210-38-00017',
        category: 'non_serialized',
        partNumber: '60210-38-00017',
        modelNumber: 'SE215W',
      },
    },
  ],
};

// Example for serialized products (like the second image)
const exampleSerializedDeliveryNote = {
  id: '2',
  deliveryNumber: '098/JKT-STISJ/VII/2025',
  customerId: '2',
  deliveryDate: '2025-07-31',
  deliveryMethod: 'Laut',
  status: 'pending',
  createdBy: '1',
  createdAt: '2025-07-31T00:00:00Z',
  updatedAt: '2025-07-31T00:00:00Z',
  customer: {
    id: '2',
    code: 'CUST002',
    name: 'PT. Salam Sejahtera Perkasa',
    address:
      'Jl. Lingkar Stadion Palaran No. 168 Simpang Pasir, Palaran, Kota Samarinda, Kalimantan Timur 75243',
    city: 'Samarinda',
    province: 'Kalimantan Timur',
    country: 'Indonesia',
    postalCode: '75243',
    contactPersons: [
      {
        id: '2',
        prefix: 'Bp',
        name: 'Ahim',
        email: 'ahim@salam.com',
        phone: '0813-4741-7777',
      },
    ],
  },
  items: [
    {
      id: '1',
      productId: '1',
      quantity: 1,
      product: {
        id: '1',
        name: 'Roller SR10-B6',
        code: 'SR10-B6',
        category: 'serialized',
        serialNumber: 'CHSRA10AASB000668',
        engineNumber: '4P25D001840',
        modelNumber: 'SR10-B6',
      },
    },
  ],
};

export function DeliveryNotePDFExample() {
  const [showSerialized, setShowSerialized] = React.useState(false);

  return (
    <div className='space-y-4'>
      <div className='mb-4 flex gap-4'>
        <button
          onClick={() => setShowSerialized(false)}
          className={`rounded px-4 py-2 ${
            !showSerialized ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Non-Serialized Products (First Image)
        </button>
        <button
          onClick={() => setShowSerialized(true)}
          className={`rounded px-4 py-2 ${
            showSerialized ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Serialized Products (Second Image)
        </button>
      </div>

      <DeliveryNotePDF
        deliveryNote={
          showSerialized ? exampleSerializedDeliveryNote : exampleDeliveryNote
        }
      />
    </div>
  );
}
