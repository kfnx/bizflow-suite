import { machineTypes as machineTypesSchema } from '../schema';

export type NewMachineType = typeof machineTypesSchema.$inferInsert;

export const machineTypes: NewMachineType[] = [
  {
    id: 'excavator',
    name: 'Excavator',
  },
  {
    id: 'bulldozer',
    name: 'Bulldozer',
  },
  {
    id: 'wheelLoader',
    name: 'Wheel Loader',
  },
  {
    id: 'backhoeLoader',
    name: 'Backhoe Loader',
  },
  {
    id: 'motorGrader',
    name: 'Motor Grader',
  },
  {
    id: 'roller',
    name: 'Roller',
  },
  {
    id: 'forklift',
    name: 'Forklift',
  },
  {
    id: 'compactor',
    name: 'Compactor',
  },
  {
    id: 'crane',
    name: 'Crane',
  },
];
