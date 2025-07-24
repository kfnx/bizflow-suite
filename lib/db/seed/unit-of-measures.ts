import { InsertUnitOfMeasure } from '../schema';

export const unitOfMeasureIds = {
  unit: 'unit',
  pcs: 'pcs',
  kg: 'kg',
  liter: 'liter',
  meter: 'meter',
  ton: 'ton',
};

export const unitOfMeasures: InsertUnitOfMeasure[] = [
  { id: unitOfMeasureIds.unit, abbreviation: 'unit', name: 'Unit' },
  { id: unitOfMeasureIds.pcs, abbreviation: 'pcs', name: 'Pieces' },
  { id: unitOfMeasureIds.kg, abbreviation: 'kg', name: 'Kilogram' },
  { id: unitOfMeasureIds.liter, abbreviation: 'liter', name: 'Liter' },
  { id: unitOfMeasureIds.meter, abbreviation: 'meter', name: 'Meter' },
  { id: unitOfMeasureIds.ton, abbreviation: 'ton', name: 'Ton' },
];
