// TechHub.bg - Specification Labels and Formatting

export interface SpecLabel {
  en: string;
  bg: string;
}

export interface SpecConfig {
  [key: string]: SpecLabel;
}

// ============================================
// GPU SPECIFICATIONS
// ============================================

export const gpuSpecLabels: SpecConfig = {
  chipManufacturer: { en: 'Chip Manufacturer', bg: 'Производител на чип' },
  series: { en: 'Series', bg: 'Серия' },
  gpuModel: { en: 'GPU Model', bg: 'Модел GPU' },
  memory: { en: 'Memory', bg: 'Видео памет' },
  memoryType: { en: 'Memory Type', bg: 'Тип памет' },
  memoryBus: { en: 'Memory Bus', bg: 'Шина на паметта' },
  cudaCoresStreams: { en: 'CUDA Cores / Stream Processors', bg: 'CUDA ядра / Stream процесори' },
  recommendedPSU: { en: 'Recommended PSU', bg: 'Препоръчително захранване' },
  powerConnector: { en: 'Power Connector', bg: 'Конектор за захранване' },
  slotWidth: { en: 'Slot Width', bg: 'Ширина на слот' },
  maxResolution: { en: 'Max Resolution', bg: 'Макс. резолюция' },
  hdmiPorts: { en: 'HDMI Ports', bg: 'HDMI портове' },
  displayPorts: { en: 'DisplayPort', bg: 'DisplayPort' },
  dlss: { en: 'DLSS Support', bg: 'DLSS поддръжка' },
  rayTracing: { en: 'Ray Tracing', bg: 'Ray Tracing' },
  fsr: { en: 'FSR Support', bg: 'FSR поддръжка' },
};

// ============================================
// CPU SPECIFICATIONS
// ============================================

export const cpuSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  model: { en: 'Model', bg: 'Модел' },
  socket: { en: 'Socket', bg: 'Сокет' },
  cores: { en: 'Cores', bg: 'Ядра' },
  threads: { en: 'Threads', bg: 'Нишки' },
  baseClock: { en: 'Base Clock', bg: 'Базова честота' },
  boostClock: { en: 'Boost Clock', bg: 'Турбо честота' },
  cache: { en: 'Cache', bg: 'Кеш памет' },
  cacheL2: { en: 'L2 Cache', bg: 'L2 кеш' },
  cacheL3: { en: 'L3 Cache', bg: 'L3 кеш' },
  tdp: { en: 'TDP', bg: 'Консумация (TDP)' },
  integratedGraphics: { en: 'Integrated Graphics', bg: 'Вградена графика' },
  memoryType: { en: 'Memory Type', bg: 'Тип памет' },
  maxMemory: { en: 'Max Memory', bg: 'Макс. памет' },
  memoryChannels: { en: 'Memory Channels', bg: 'Канали памет' },
  pcieLanes: { en: 'PCIe Lanes', bg: 'PCIe линии' },
  pcieVersion: { en: 'PCIe Version', bg: 'PCIe версия' },
  architecture: { en: 'Architecture', bg: 'Архитектура' },
  lithography: { en: 'Lithography', bg: 'Литография' },
  coolerIncluded: { en: 'Cooler Included', bg: 'Охладител в комплекта' },
  unlocked: { en: 'Unlocked', bg: 'Отключен' },
};

// ... (keep all other spec labels - motherboard, ram, storage, psu, case, cooling, laptop, keyboard, mouse, monitor, headset, mousepad, microphone, webcam)

// ============================================
// GET SPEC LABELS BY CATEGORY
// ============================================

const specLabelsMap: { [key: string]: SpecConfig } = {
  'gpu-specification': gpuSpecLabels,
  'cpu-specification': cpuSpecLabels,
  // ... other mappings
};

export function getSpecLabels(specType: string): SpecConfig {
  return specLabelsMap[specType] || {};
}

// ============================================
// GET SPEC RELATION NAME BY CATEGORY SLUG
// ============================================

const categoryToSpecRelation: { [key: string]: string } = {
  // ✅ FIXED: Use snake_case to match Strapi field names
  'graphics-cards': 'gpu_specification',
  'video-cards': 'gpu_specification',
  'processors': 'cpu_specification',
  'motherboards': 'motherboard_specification',
  'ram': 'ram_specification',
  'storage': 'storage_specification',
  'power-supplies': 'psu_specification',
  'cases': 'case_specification',
  'cooling': 'cooling_specification',
  'laptops': 'laptop_specification',
  'gaming-laptops': 'laptop_specification',
  'keyboards': 'keyboard_specification',
  'gaming-keyboards': 'keyboard_specification',
  'mice': 'mouse_specification',
  'gaming-mice': 'mouse_specification',
  'monitors': 'monitor_specification',
  'gaming-monitors': 'monitor_specification',
  'headsets': 'headset_specification',
  'gaming-headsets': 'headset_specification',
  'mousepads': 'mousepad_specification',
  'gaming-mousepads': 'mousepad_specification',
  'microphones': 'microphone_specification',
  'streaming-microphones': 'microphone_specification',
  'webcams': 'webcam_specification',
  'streaming-webcams': 'webcam_specification',
};

export function getSpecRelation(categorySlug: string): string | null {
  return categoryToSpecRelation[categorySlug] || null;
}

export function getSpecType(categorySlug: string): string | null {
  const relation = categoryToSpecRelation[categorySlug];
  if (!relation) return null;

  // Already in kebab-case format
  return relation.replace(/_/g, '-');
}
