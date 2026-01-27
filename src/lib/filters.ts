// TechHub.bg - Filter Configuration per Category

import { CategoryFilterConfig, SortOption } from '@/types';

// ============================================
// SORT OPTIONS
// ============================================

export const sortOptions: SortOption[] = [
  { value: 'createdAt:desc', label: 'Newest', labelBg: 'Най-нови' },
  { value: 'price:asc', label: 'Price: Low to High', labelBg: 'Цена: Ниска към Висока' },
  { value: 'price:desc', label: 'Price: High to Low', labelBg: 'Цена: Висока към Ниска' },
  { value: 'name:asc', label: 'Name: A to Z', labelBg: 'Име: А до Я' },
  { value: 'name:desc', label: 'Name: Z to A', labelBg: 'Име: Я до А' },
];

// ============================================
// FORMAT DISPLAY VALUES
// ============================================

export function formatFilterValue(value: string, displayFormat?: string): string {
  if (!value) return value;
  
  // Remove common prefixes and format
  const formatters: { [key: string]: (v: string) => string } = {
    'VRAM_': (v) => v.replace('VRAM_', ''),
    'TDP_': (v) => v.replace('TDP_', ''),
    'Fans_': (v) => v.replace('Fans_', '') + ' Fan(s)',
    'MHz_': (v) => v.replace('MHz_', '') + ' MHz',
    'Bus_': (v) => v.replace('Bus_', '').replace('bit', '-bit'),
    'Cores_': (v) => v.replace('Cores_', '') + ' Cores',
    'Threads_': (v) => v.replace('Threads_', '') + ' Threads',
    'GHz_': (v) => v.replace('GHz_', '').replace('_', '.') + ' GHz',
    'MTs_': (v) => v.replace('MTs_', '') + ' MT/s',
    'Slots_': (v) => v.replace('Slots_', ''),
    'RAM_': (v) => v.replace('RAM_', ''),
    'GB_': (v) => v.replace('GB_', '') + ' GB',
    'TB_': (v) => v.replace('TB_', '') + ' TB',
    'W_': (v) => v.replace('W_', '') + 'W',
    'PSU_': (v) => v.replace('PSU_', ''),
    'Hz_': (v) => v.replace('Hz_', '') + ' Hz',
    'Inch_': (v) => v.replace('Inch_', '').replace('_', '.') + '"',
    'Nits_': (v) => v.replace('Nits_', '') + ' nits',
    'ms_': (v) => v.replace('ms_', '').replace('_', '.') + ' ms',
    'dB_': (v) => v.replace('dB_', '') + ' dB',
    'mm_': (v) => v.replace('mm_', '') + ' mm',
    'g_': (v) => v.replace('g_', '').replace('_', '-') + 'g',
    'Kg_': (v) => v.replace('Kg_', '').replace('_', '.') + ' kg',
    'Wh_': (v) => v.replace('Wh_', '') + ' Wh',
  };

  for (const [prefix, formatter] of Object.entries(formatters)) {
    if (value.startsWith(prefix)) {
      return formatter(value);
    }
  }

  // Replace underscores with spaces for other values
  return value.replace(/_/g, ' ');
}

// ============================================
// GPU FILTERS
// ============================================

export const gpuFilters: CategoryFilterConfig = {
  category: 'graphics-cards',
  specType: 'gpu-specification',
  specRelation: 'gpuSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 10000,
      step: 50,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'chipManufacturer',
      label: 'Chip Manufacturer',
      labelBg: 'Производител на чип',
      type: 'checkbox',
      field: 'gpuSpecification.chipManufacturer',
      options: ['NVIDIA', 'AMD', 'Intel'],
    },
    {
      id: 'series',
      label: 'Series',
      labelBg: 'Серия',
      type: 'checkbox',
      field: 'gpuSpecification.series',
      options: ['RTX_5000', 'RTX_4000', 'RTX_3000', 'RX_9000', 'RX_7000', 'RX_6000', 'Arc_A_Series', 'Arc_B_Series'],
    },
    {
      id: 'memory',
      label: 'Memory',
      labelBg: 'Видео памет',
      type: 'checkbox',
      field: 'gpuSpecification.memory',
      options: ['VRAM_4GB', 'VRAM_6GB', 'VRAM_8GB', 'VRAM_10GB', 'VRAM_12GB', 'VRAM_16GB', 'VRAM_20GB', 'VRAM_24GB', 'VRAM_32GB', 'VRAM_48GB'],
    },
    {
      id: 'memoryType',
      label: 'Memory Type',
      labelBg: 'Тип памет',
      type: 'checkbox',
      field: 'gpuSpecification.memoryType',
      options: ['GDDR5', 'GDDR6', 'GDDR6X'],
    },
    {
      id: 'fans',
      label: 'Fans',
      labelBg: 'Вентилатори',
      type: 'checkbox',
      field: 'gpuSpecification.fans',
      options: ['Fans_1', 'Fans_2', 'Fans_3'],
    },
    {
      id: 'tdp',
      label: 'TDP',
      labelBg: 'Консумация',
      type: 'checkbox',
      field: 'gpuSpecification.tdp',
      options: ['TDP_75W', 'TDP_100W', 'TDP_150W', 'TDP_200W', 'TDP_250W', 'TDP_300W', 'TDP_350W', 'TDP_450W'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'gpuSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// CPU FILTERS
// ============================================

export const cpuFilters: CategoryFilterConfig = {
  category: 'processors',
  specType: 'cpu-specification',
  specRelation: 'cpuSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 5000,
      step: 50,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'manufacturer',
      label: 'Manufacturer',
      labelBg: 'Производител',
      type: 'checkbox',
      field: 'cpuSpecification.manufacturer',
      options: ['AMD', 'Intel'],
    },
    {
      id: 'series',
      label: 'Series',
      labelBg: 'Серия',
      type: 'checkbox',
      field: 'cpuSpecification.series',
      options: ['Ryzen_9', 'Ryzen_7', 'Ryzen_5', 'Ryzen_3', 'Core_i9', 'Core_i7', 'Core_i5', 'Core_i3', 'Core_Ultra_9', 'Core_Ultra_7', 'Core_Ultra_5'],
    },
    {
      id: 'socket',
      label: 'Socket',
      labelBg: 'Сокет',
      type: 'checkbox',
      field: 'cpuSpecification.socket',
      options: ['AM5', 'AM4', 'LGA1700', 'LGA1851', 'LGA1200'],
    },
    {
      id: 'cores',
      label: 'Cores',
      labelBg: 'Ядра',
      type: 'checkbox',
      field: 'cpuSpecification.cores',
      options: ['Cores_4', 'Cores_6', 'Cores_8', 'Cores_10', 'Cores_12', 'Cores_14', 'Cores_16', 'Cores_24', 'Cores_32'],
    },
    {
      id: 'integratedGraphics',
      label: 'Integrated Graphics',
      labelBg: 'Вградена графика',
      type: 'toggle',
      field: 'cpuSpecification.integratedGraphics',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// MOTHERBOARD FILTERS
// ============================================

export const motherboardFilters: CategoryFilterConfig = {
  category: 'motherboards',
  specType: 'motherboard-specification',
  specRelation: 'motherboardSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 3000,
      step: 50,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'socket',
      label: 'Socket',
      labelBg: 'Сокет',
      type: 'checkbox',
      field: 'motherboardSpecification.socket',
      options: ['AM5', 'AM4', 'LGA1700', 'LGA1851', 'LGA1200'],
    },
    {
      id: 'formFactor',
      label: 'Form Factor',
      labelBg: 'Форм фактор',
      type: 'checkbox',
      field: 'motherboardSpecification.formFactor',
      options: ['E_ATX', 'ATX', 'Micro_ATX', 'Mini_ITX'],
    },
    {
      id: 'memoryType',
      label: 'Memory Type',
      labelBg: 'Тип памет',
      type: 'checkbox',
      field: 'motherboardSpecification.memoryType',
      options: ['DDR4', 'DDR5'],
    },
    {
      id: 'wifi',
      label: 'WiFi',
      labelBg: 'WiFi',
      type: 'checkbox',
      field: 'motherboardSpecification.wifi',
      options: ['None', 'WiFi_6', 'WiFi_6E', 'WiFi_7'],
    },
  ],
};

// ============================================
// RAM FILTERS
// ============================================

export const ramFilters: CategoryFilterConfig = {
  category: 'ram',
  specType: 'ram-specification',
  specRelation: 'ramSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 2000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'ramSpecification.type',
      options: ['DDR4', 'DDR5'],
    },
    {
      id: 'capacity',
      label: 'Capacity',
      labelBg: 'Капацитет',
      type: 'checkbox',
      field: 'ramSpecification.capacity',
      options: ['GB_8', 'GB_16', 'GB_32', 'GB_64', 'GB_128'],
    },
    {
      id: 'speed',
      label: 'Speed',
      labelBg: 'Скорост',
      type: 'checkbox',
      field: 'ramSpecification.speed',
      options: ['MTs_3200', 'MTs_3600', 'MTs_4800', 'MTs_5600', 'MTs_6000', 'MTs_6400', 'MTs_7200', 'MTs_8000'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'ramSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// STORAGE FILTERS
// ============================================

export const storageFilters: CategoryFilterConfig = {
  category: 'storage',
  specType: 'storage-specification',
  specRelation: 'storageSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 2000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'storageSpecification.type',
      options: ['NVMe_SSD', 'SATA_SSD', 'HDD'],
    },
    {
      id: 'capacity',
      label: 'Capacity',
      labelBg: 'Капацитет',
      type: 'checkbox',
      field: 'storageSpecification.capacity',
      options: ['GB_256', 'GB_512', 'TB_1', 'TB_2', 'TB_4'],
    },
    {
      id: 'interface',
      label: 'Interface',
      labelBg: 'Интерфейс',
      type: 'checkbox',
      field: 'storageSpecification.interface',
      options: ['PCIe_5_0_x4', 'PCIe_4_0_x4', 'PCIe_3_0_x4', 'SATA_III'],
    },
  ],
};

// ============================================
// PSU FILTERS
// ============================================

export const psuFilters: CategoryFilterConfig = {
  category: 'power-supplies',
  specType: 'psu-specification',
  specRelation: 'psuSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1500,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'wattage',
      label: 'Wattage',
      labelBg: 'Мощност',
      type: 'checkbox',
      field: 'psuSpecification.wattage',
      options: ['W_550', 'W_650', 'W_750', 'W_850', 'W_1000', 'W_1200', 'W_1500'],
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      labelBg: 'Ефективност',
      type: 'checkbox',
      field: 'psuSpecification.efficiency',
      options: ['Bronze_80Plus', 'Silver_80Plus', 'Gold_80Plus', 'Platinum_80Plus', 'Titanium_80Plus'],
    },
    {
      id: 'modular',
      label: 'Modular',
      labelBg: 'Модулен',
      type: 'checkbox',
      field: 'psuSpecification.modular',
      options: ['Non_Modular', 'Semi_Modular', 'Fully_Modular'],
    },
  ],
};

// ============================================
// CASE FILTERS
// ============================================

export const caseFilters: CategoryFilterConfig = {
  category: 'cases',
  specType: 'case-specification',
  specRelation: 'caseSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1500,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'caseSpecification.type',
      options: ['Full_Tower', 'Mid_Tower', 'Mini_Tower', 'SFF'],
    },
    {
      id: 'color',
      label: 'Color',
      labelBg: 'Цвят',
      type: 'checkbox',
      field: 'caseSpecification.color',
      options: ['Black', 'White', 'Gray', 'Silver'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'caseSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// COOLING FILTERS
// ============================================

export const coolingFilters: CategoryFilterConfig = {
  category: 'cooling',
  specType: 'cooling-specification',
  specRelation: 'coolingSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'coolingSpecification.type',
      options: ['Air_Cooler_Tower', 'Air_Cooler_Low_Profile', 'AIO_120mm', 'AIO_240mm', 'AIO_280mm', 'AIO_360mm', 'AIO_420mm'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'coolingSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// LAPTOP FILTERS
// ============================================

export const laptopFilters: CategoryFilterConfig = {
  category: 'laptops',
  specType: 'laptop-specification',
  specRelation: 'laptopSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 15000,
      step: 100,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'screenSize',
      label: 'Screen Size',
      labelBg: 'Размер на екрана',
      type: 'checkbox',
      field: 'laptopSpecification.screenSize',
      options: ['Inch_14', 'Inch_15_6', 'Inch_16', 'Inch_17_3', 'Inch_18'],
    },
    {
      id: 'cpuManufacturer',
      label: 'CPU',
      labelBg: 'Процесор',
      type: 'checkbox',
      field: 'laptopSpecification.cpuManufacturer',
      options: ['Intel', 'AMD', 'Apple'],
    },
    {
      id: 'gpuManufacturer',
      label: 'GPU',
      labelBg: 'Видеокарта',
      type: 'checkbox',
      field: 'laptopSpecification.gpuManufacturer',
      options: ['NVIDIA', 'AMD', 'Intel', 'Apple', 'Integrated'],
    },
    {
      id: 'ramSize',
      label: 'RAM',
      labelBg: 'RAM Памет',
      type: 'checkbox',
      field: 'laptopSpecification.ramSize',
      options: ['RAM_8GB', 'RAM_16GB', 'RAM_32GB', 'RAM_64GB'],
    },
    {
      id: 'storageCapacity',
      label: 'Storage',
      labelBg: 'Съхранение',
      type: 'checkbox',
      field: 'laptopSpecification.storageCapacity',
      options: ['GB_256', 'GB_512', 'TB_1', 'TB_2'],
    },
  ],
};

// ============================================
// KEYBOARD FILTERS
// ============================================

export const keyboardFilters: CategoryFilterConfig = {
  category: 'keyboards',
  specType: 'keyboard-specification',
  specRelation: 'keyboardSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'keyboardSpecification.type',
      options: ['Mechanical', 'Optical_Mechanical', 'Membrane', 'Hall_Effect'],
    },
    {
      id: 'formFactor',
      label: 'Form Factor',
      labelBg: 'Форм фактор',
      type: 'checkbox',
      field: 'keyboardSpecification.formFactor',
      options: ['Full_Size_100', 'TKL_80', 'Compact_75', 'Compact_65', 'Compact_60'],
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      labelBg: 'Свързване',
      type: 'checkbox',
      field: 'keyboardSpecification.connectivity',
      options: ['Wired_USB', 'Wireless_2_4GHz', 'Bluetooth', 'Wired_Wireless_2_4GHz_Bluetooth'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'keyboardSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// MOUSE FILTERS
// ============================================

export const mouseFilters: CategoryFilterConfig = {
  category: 'mice',
  specType: 'mouse-specification',
  specRelation: 'mouseSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 500,
      step: 10,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      labelBg: 'Свързване',
      type: 'checkbox',
      field: 'mouseSpecification.connectivity',
      options: ['Wired_USB', 'Wireless_2_4GHz', 'Bluetooth', 'Wired_Wireless_2_4GHz_Bluetooth'],
    },
    {
      id: 'dpi',
      label: 'DPI',
      labelBg: 'DPI',
      type: 'checkbox',
      field: 'mouseSpecification.dpi',
      options: ['DPI_16000', 'DPI_20000', 'DPI_25000', 'DPI_30000'],
    },
    {
      id: 'weight',
      label: 'Weight',
      labelBg: 'Тегло',
      type: 'checkbox',
      field: 'mouseSpecification.weight',
      options: ['g_Under_50', 'g_50_60', 'g_60_70', 'g_70_80', 'g_Over_80'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'mouseSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// MONITOR FILTERS
// ============================================

export const monitorFilters: CategoryFilterConfig = {
  category: 'monitors',
  specType: 'monitor-specification',
  specRelation: 'monitorSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 5000,
      step: 50,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'screenSize',
      label: 'Screen Size',
      labelBg: 'Размер',
      type: 'checkbox',
      field: 'monitorSpecification.screenSize',
      options: ['Inch_24', 'Inch_27', 'Inch_32', 'Inch_34', 'Inch_42', 'Inch_49'],
    },
    {
      id: 'resolution',
      label: 'Resolution',
      labelBg: 'Резолюция',
      type: 'checkbox',
      field: 'monitorSpecification.resolution',
      options: ['FHD_1920x1080', 'QHD_2560x1440', 'WQHD_3440x1440', 'UHD_4K_3840x2160'],
    },
    {
      id: 'panelType',
      label: 'Panel Type',
      labelBg: 'Тип панел',
      type: 'checkbox',
      field: 'monitorSpecification.panelType',
      options: ['IPS', 'VA', 'TN', 'OLED', 'QD_OLED', 'Mini_LED'],
    },
    {
      id: 'refreshRate',
      label: 'Refresh Rate',
      labelBg: 'Честота',
      type: 'checkbox',
      field: 'monitorSpecification.refreshRate',
      options: ['Hz_60', 'Hz_144', 'Hz_165', 'Hz_240', 'Hz_360'],
    },
  ],
};

// ============================================
// HEADSET FILTERS
// ============================================

export const headsetFilters: CategoryFilterConfig = {
  category: 'headsets',
  specType: 'headset-specification',
  specRelation: 'headsetSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'headsetSpecification.type',
      options: ['Over_Ear_Closed', 'Over_Ear_Open', 'On_Ear', 'In_Ear'],
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      labelBg: 'Свързване',
      type: 'checkbox',
      field: 'headsetSpecification.connectivity',
      options: ['Wired_3_5mm', 'Wired_USB', 'Wireless_2_4GHz', 'Wireless_Bluetooth', 'Wired_Wireless_2_4GHz_Bluetooth'],
    },
    {
      id: 'surroundSound',
      label: 'Surround Sound',
      labelBg: 'Съраунд звук',
      type: 'checkbox',
      field: 'headsetSpecification.surroundSound',
      options: ['Stereo', 'Virtual_7_1', 'Dolby_Atmos', 'DTS_Headphone_X'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'headsetSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// MOUSEPAD FILTERS
// ============================================

export const mousepadFilters: CategoryFilterConfig = {
  category: 'mousepads',
  specType: 'mousepad-specification',
  specRelation: 'mousepadSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 300,
      step: 10,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Type',
      labelBg: 'Тип',
      type: 'checkbox',
      field: 'mousepadSpecification.type',
      options: ['Soft_Cloth', 'Hybrid', 'Hard', 'Glass'],
    },
    {
      id: 'size',
      label: 'Size',
      labelBg: 'Размер',
      type: 'checkbox',
      field: 'mousepadSpecification.size',
      options: ['Small', 'Medium', 'Large', 'XL', 'XXL', 'Desk_Mat'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'mousepadSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// MICROPHONE FILTERS
// ============================================

export const microphoneFilters: CategoryFilterConfig = {
  category: 'microphones',
  specType: 'microphone-specification',
  specRelation: 'microphoneSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'type',
      label: 'Connection',
      labelBg: 'Връзка',
      type: 'checkbox',
      field: 'microphoneSpecification.type',
      options: ['USB', 'XLR', 'USB_XLR', 'Wireless'],
    },
    {
      id: 'polarPattern',
      label: 'Polar Pattern',
      labelBg: 'Полярен модел',
      type: 'checkbox',
      field: 'microphoneSpecification.polarPattern',
      options: ['Cardioid', 'Omnidirectional', 'Bidirectional', 'Multi_Pattern'],
    },
    {
      id: 'rgb',
      label: 'RGB Lighting',
      labelBg: 'RGB Осветление',
      type: 'toggle',
      field: 'microphoneSpecification.rgb',
      condition: 'eq:true',
    },
  ],
};

// ============================================
// WEBCAM FILTERS
// ============================================

export const webcamFilters: CategoryFilterConfig = {
  category: 'webcams',
  specType: 'webcam-specification',
  specRelation: 'webcamSpecification',
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 1000,
      step: 20,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
    {
      id: 'resolution',
      label: 'Resolution',
      labelBg: 'Резолюция',
      type: 'checkbox',
      field: 'webcamSpecification.resolution',
      options: ['HD_720p', 'FHD_1080p', 'QHD_1440p', 'UHD_4K'],
    },
    {
      id: 'autofocusType',
      label: 'Autofocus',
      labelBg: 'Автофокус',
      type: 'checkbox',
      field: 'webcamSpecification.autofocusType',
      options: ['Fixed', 'Standard', 'Fast', 'AI_Powered'],
    },
  ],
};

// ============================================
// DEFAULT FILTERS (for categories without specifications)
// ============================================

export const defaultFilters: CategoryFilterConfig = {
  category: 'default',
  specType: null,
  specRelation: null,
  filters: [
    {
      id: 'price',
      label: 'Price',
      labelBg: 'Цена',
      type: 'range',
      field: 'price',
      min: 0,
      max: 10000,
      step: 50,
      unit: 'лв.',
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      labelBg: 'Само налични',
      type: 'toggle',
      field: 'stock',
      condition: 'gt:0',
    },
  ],
};

// ============================================
// GET FILTERS BY CATEGORY
// ============================================

const filterMap: { [key: string]: CategoryFilterConfig } = {
  'graphics-cards': gpuFilters,
  'processors': cpuFilters,
  'motherboards': motherboardFilters,
  'ram': ramFilters,
  'storage': storageFilters,
  'power-supplies': psuFilters,
  'cases': caseFilters,
  'cooling': coolingFilters,
  'laptops': laptopFilters,
  'gaming-laptops': laptopFilters,
  'keyboards': keyboardFilters,
  'gaming-keyboards': keyboardFilters,
  'mice': mouseFilters,
  'gaming-mice': mouseFilters,
  'monitors': monitorFilters,
  'gaming-monitors': monitorFilters,
  'headsets': headsetFilters,
  'gaming-headsets': headsetFilters,
  'mousepads': mousepadFilters,
  'gaming-mousepads': mousepadFilters,
  'microphones': microphoneFilters,
  'streaming-microphones': microphoneFilters,
  'webcams': webcamFilters,
  'streaming-webcams': webcamFilters,
};

export function getFiltersForCategory(categorySlug: string): CategoryFilterConfig {
  return filterMap[categorySlug] || defaultFilters;
}
