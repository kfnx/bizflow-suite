import { InsertMachineType } from '../schema';

export const machineTypeIds = {
  excavator: 'excavator',
  bulldozer: 'bulldozer',
  wheel_loader: 'wheel_loader',
  backhoe_loader: 'backhoe_loader',
  motor_grader: 'motor_grader',
  roller: 'roller',
};

export const machineTypes: InsertMachineType[] = [
  { id: machineTypeIds.excavator, name: 'Excavator' },
  { id: machineTypeIds.bulldozer, name: 'Bulldozer' },
  { id: machineTypeIds.wheel_loader, name: 'Wheel Loader' },
  { id: machineTypeIds.backhoe_loader, name: 'Backhoe Loader' },
  { id: machineTypeIds.motor_grader, name: 'Motor Grader' },
  { id: machineTypeIds.roller, name: 'Roller' },
];
