import { InsertBrand } from '../schema';

export const brandsObject: Record<string, string> = {
  shantui: 'Shantui',
  caterpillar: 'Caterpillar',
  komatsu: 'Komatsu',
  hitachi: 'Hitachi',
  volvo: 'Volvo',
  jcb: 'JCB',
};

export const brands: InsertBrand[] = Object.entries(brandsObject).map(
  ([id, name]) => ({
    id,
    name,
  }),
);
