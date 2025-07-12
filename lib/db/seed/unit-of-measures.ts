import { unitOfMeasures as unitOfMeasuresSchema } from '../schema';

export type NewUnitOfMeasure = typeof unitOfMeasuresSchema.$inferInsert;

export const unitOfMeasures: NewUnitOfMeasure[] = [
  {
    id: 'pcs',
    abbreviation: 'pcs',
    name: 'Pieces',
  },
  {
    id: 'kg',
    abbreviation: 'kg',
    name: 'Kilogram',
  },
  {
    id: 'liter',
    abbreviation: 'l',
    name: 'Liter',
  },
  {
    id: 'meter',
    abbreviation: 'm',
    name: 'Meter',
  },
  {
    id: 'ton',
    abbreviation: 'ton',
    name: 'Ton',
  },
  {
    id: 'set',
    abbreviation: 'set',
    name: 'Set',
  },
];
