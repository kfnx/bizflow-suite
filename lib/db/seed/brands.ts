import { InsertBrand } from '../schema';

export const brandIds = {
  shantui: 'shantui',
  sparepartShantui: 'sparepart_shantui',
  caterpillar: 'caterpillar',
  komatsu: 'komatsu',
  hitachi: 'hitachi',
  volvo: 'volvo',
  jcb: 'jcb',
  oliolio: 'oliolio',
  spareXYZ: 'spare_xyz',
  sparepartABC: 'sparepart_abc',
};

export const brands: InsertBrand[] = [
  { id: brandIds.shantui, type: 'machine', name: 'Shantui' },
  { id: brandIds.caterpillar, type: 'machine', name: 'Caterpillar' },
  { id: brandIds.komatsu, type: 'machine', name: 'Komatsu' },
  { id: brandIds.hitachi, type: 'machine', name: 'Hitachi' },
  { id: brandIds.volvo, type: 'machine', name: 'Volvo' },
  { id: brandIds.jcb, type: 'machine', name: 'JCB' },
  { id: brandIds.sparepartShantui, type: 'sparepart', name: 'Shantui' },
  { id: brandIds.oliolio, type: 'sparepart', name: 'Oliolio' },
  { id: brandIds.spareXYZ, type: 'sparepart', name: 'Spare XYZ' },
  { id: brandIds.sparepartABC, type: 'sparepart', name: 'Sparepart ABC' },
];
