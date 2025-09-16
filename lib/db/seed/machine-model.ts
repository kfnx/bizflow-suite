import { InsertMachineModel } from '../schema';

export const machineModel: InsertMachineModel[] = [
  // Shantui Excavators
  { id: 'se135-9', model: 'SE135-9', name: 'Shantui SE135-9 Excavator' },
  { id: 'se215-9', model: 'SE215-9', name: 'Shantui SE215-9 Excavator' },
  { id: 'se215w', model: 'SE215W', name: 'Shantui SE215W Wheel Excavator' },
  { id: 'se240-9', model: 'SE240-9', name: 'Shantui SE240-9 Excavator' },
  { id: 'se350-9', model: 'SE350-9', name: 'Shantui SE350-9 Large Excavator' },
  { id: 'se75-9', model: 'SE75-9', name: 'Shantui SE75-9 Mini Excavator' },
  { id: 'se85-9', model: 'SE85-9', name: 'Shantui SE85-9 Compact Excavator' },

  // Shantui Bulldozers
  { id: 'sd13', model: 'SD13', name: 'Shantui SD13 Bulldozer' },
  { id: 'sd16', model: 'SD16', name: 'Shantui SD16 Bulldozer' },
  { id: 'sd22', model: 'SD22', name: 'Shantui SD22 Bulldozer' },
  { id: 'sd32', model: 'SD32', name: 'Shantui SD32 Large Bulldozer' },
  { id: 'sd16tl', model: 'SD16TL', name: 'Shantui SD16TL Swamp Bulldozer' },
  { id: 'sd08-3', model: 'SD08-3', name: 'Shantui SD08-3 Mini Bulldozer' },

  // Shantui Motor Graders
  { id: 'sg14-3', model: 'SG14-3', name: 'Shantui SG14-3 Motor Grader' },
  { id: 'sg16-3', model: 'SG16-3', name: 'Shantui SG16-3 Motor Grader' },
  { id: 'sg18-3', model: 'SG18-3', name: 'Shantui SG18-3 Motor Grader' },
  { id: 'sg21-3', model: 'SG21-3', name: 'Shantui SG21-3 Large Motor Grader' },

  // Shantui Loaders
  { id: 'sl30w', model: 'SL30W', name: 'Shantui SL30W Wheel Loader' },
  { id: 'sl50w', model: 'SL50W', name: 'Shantui SL50W Wheel Loader' },
  { id: 'sl60w', model: 'SL60W', name: 'Shantui SL60W Large Wheel Loader' },
  { id: 'sl80w', model: 'SL80W', name: 'Shantui SL80W Heavy Wheel Loader' },

  // Shantui Road Rollers
  {
    id: 'sr12d-3',
    model: 'SR12D-3',
    name: 'Shantui SR12D-3 Double Drum Roller',
  },
  {
    id: 'sr14d-3',
    model: 'SR14D-3',
    name: 'Shantui SR14D-3 Double Drum Roller',
  },
  {
    id: 'sr20m-3',
    model: 'SR20M-3',
    name: 'Shantui SR20M-3 Single Drum Roller',
  },
  {
    id: 'sr26m-3',
    model: 'SR26M-3',
    name: 'Shantui SR26M-3 Heavy Single Drum Roller',
  },

  // Doosan Models
  { id: 'dh08b3', model: 'DH08B3', name: 'Doosan DH08B3 Mini Excavator' },
  { id: 'dx140lc', model: 'DX140LC', name: 'Doosan DX140LC Excavator' },
  { id: 'dx225lc', model: 'DX225LC', name: 'Doosan DX225LC Excavator' },
  { id: 'dx300lc', model: 'DX300LC', name: 'Doosan DX300LC Large Excavator' },
  { id: 'dx55w', model: 'DX55W', name: 'Doosan DX55W Wheel Excavator' },

  // Caterpillar Models (for spare parts compatibility)
  { id: 'cat320d', model: 'CAT320D', name: 'Caterpillar 320D Excavator' },
  { id: 'cat330d', model: 'CAT330D', name: 'Caterpillar 330D Excavator' },
  { id: 'cat966h', model: 'CAT966H', name: 'Caterpillar 966H Wheel Loader' },
  { id: 'cat140m', model: 'CAT140M', name: 'Caterpillar 140M Motor Grader' },

  // Komatsu Models (for spare parts compatibility)
  { id: 'pc200-8', model: 'PC200-8', name: 'Komatsu PC200-8 Excavator' },
  { id: 'pc300-8', model: 'PC300-8', name: 'Komatsu PC300-8 Excavator' },
  { id: 'wa320-7', model: 'WA320-7', name: 'Komatsu WA320-7 Wheel Loader' },
  { id: 'd65px-17', model: 'D65PX-17', name: 'Komatsu D65PX-17 Bulldozer' },

  // Hitachi Models (for spare parts compatibility)
  { id: 'zx200-3', model: 'ZX200-3', name: 'Hitachi ZX200-3 Excavator' },
  { id: 'zx350-3', model: 'ZX350-3', name: 'Hitachi ZX350-3 Large Excavator' },
  { id: 'zw180-5', model: 'ZW180-5', name: 'Hitachi ZW180-5 Wheel Loader' },

  // Volvo Models (for spare parts compatibility)
  { id: 'ec210d', model: 'EC210D', name: 'Volvo EC210D Excavator' },
  { id: 'l120h', model: 'L120H', name: 'Volvo L120H Wheel Loader' },
  { id: 'g990b', model: 'G990B', name: 'Volvo G990B Motor Grader' },
];
