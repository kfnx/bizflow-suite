import { InsertMachineType } from '../schema';

export const machineTypesObject: Record<string, string> = {
  excavator: 'Excavator',
  bulldozer: 'Bulldozer',
  wheel_loader: 'Wheel Loader',
  backhoe_loader: 'Backhoe Loader',
  motor_grader: 'Motor Grader',
};

export const machineTypes: InsertMachineType[] = Object.entries(
  machineTypesObject,
).map(([id, name]) => ({
  id,
  name,
}));
