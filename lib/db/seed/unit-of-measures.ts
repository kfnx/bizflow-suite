import { InsertUnitOfMeasure } from '../schema';

export const unitOfMeasuresObject: Record<string, string> = {
  pcs: 'Pieces',
  kg: 'Kilogram',
  liter: 'Liter',
  meter: 'Meter',
  ton: 'Ton',
};

export const unitOfMeasures: InsertUnitOfMeasure[] = Object.entries(
  unitOfMeasuresObject,
).map(([id, name]) => ({
  id,
  abbreviation: id,
  name,
}));
