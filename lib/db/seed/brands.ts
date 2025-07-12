import { brands as brandsSchema } from '../schema';

export type NewBrand = typeof brandsSchema.$inferInsert;

export const brands: NewBrand[] = [
  {
    id: 'shantui',
    name: 'Shantui',
  },
  {
    id: 'caterpillar',
    name: 'Caterpillar',
  },
  {
    id: 'komatsu',
    name: 'Komatsu',
  },
  {
    id: 'hitachi',
    name: 'Hitachi',
  },
  {
    id: 'volvo',
    name: 'Volvo',
  },
  {
    id: 'jcb',
    name: 'JCB',
  },
];
