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
  baseClock: { en: 'Base Clock', bg: 'Базова честота' },
  boostClock: { en: 'Boost Clock', bg: 'Турбо честота' },
  cudaCores: { en: 'CUDA Cores', bg: 'CUDA ядра' },
  streamProcessors: { en: 'Stream Processors', bg: 'Стрийм процесори' },
  rtCores: { en: 'RT Cores', bg: 'RT ядра' },
  tensorCores: { en: 'Tensor Cores', bg: 'Tensor ядра' },
  tdp: { en: 'TDP', bg: 'Консумация (TDP)' },
  recommendedPSU: { en: 'Recommended PSU', bg: 'Препоръчително захранване' },
  fans: { en: 'Fans', bg: 'Вентилатори' },
  fanType: { en: 'Fan Type', bg: 'Тип вентилатори' },
  coolingType: { en: 'Cooling Type', bg: 'Тип охлаждане' },
  length: { en: 'Length', bg: 'Дължина' },
  slots: { en: 'Slots', bg: 'Слотове' },
  maxResolution: { en: 'Max Resolution', bg: 'Макс. резолюция' },
  hdmi: { en: 'HDMI Ports', bg: 'HDMI портове' },
  displayPort: { en: 'DisplayPort', bg: 'DisplayPort' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
  dlss: { en: 'DLSS Support', bg: 'DLSS поддръжка' },
  rayTracing: { en: 'Ray Tracing', bg: 'Ray Tracing' },
  vr: { en: 'VR Ready', bg: 'VR Ready' },
  directX: { en: 'DirectX', bg: 'DirectX' },
  openGL: { en: 'OpenGL', bg: 'OpenGL' },
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

// ============================================
// MOTHERBOARD SPECIFICATIONS
// ============================================

export const motherboardSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  socket: { en: 'Socket', bg: 'Сокет' },
  chipset: { en: 'Chipset', bg: 'Чипсет' },
  formFactor: { en: 'Form Factor', bg: 'Форм фактор' },
  memoryType: { en: 'Memory Type', bg: 'Тип памет' },
  memorySlots: { en: 'Memory Slots', bg: 'Слотове за памет' },
  maxMemory: { en: 'Max Memory', bg: 'Макс. памет' },
  memorySpeed: { en: 'Memory Speed', bg: 'Скорост на паметта' },
  pciex16Slots: { en: 'PCIe x16 Slots', bg: 'PCIe x16 слотове' },
  pciex4Slots: { en: 'PCIe x4 Slots', bg: 'PCIe x4 слотове' },
  pciex1Slots: { en: 'PCIe x1 Slots', bg: 'PCIe x1 слотове' },
  m2Slots: { en: 'M.2 Slots', bg: 'M.2 слотове' },
  sataConnectors: { en: 'SATA Connectors', bg: 'SATA конектори' },
  usb32Gen2: { en: 'USB 3.2 Gen 2', bg: 'USB 3.2 Gen 2' },
  usb32Gen1: { en: 'USB 3.2 Gen 1', bg: 'USB 3.2 Gen 1' },
  usb20: { en: 'USB 2.0', bg: 'USB 2.0' },
  wifi: { en: 'WiFi', bg: 'WiFi' },
  bluetooth: { en: 'Bluetooth', bg: 'Bluetooth' },
  ethernet: { en: 'Ethernet', bg: 'Ethernet' },
  audio: { en: 'Audio', bg: 'Аудио' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// RAM SPECIFICATIONS
// ============================================

export const ramSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  type: { en: 'Type', bg: 'Тип' },
  capacity: { en: 'Capacity', bg: 'Капацитет' },
  modules: { en: 'Modules', bg: 'Модули' },
  speed: { en: 'Speed', bg: 'Скорост' },
  latency: { en: 'Latency (CL)', bg: 'Латентност (CL)' },
  voltage: { en: 'Voltage', bg: 'Напрежение' },
  timing: { en: 'Timing', bg: 'Тайминги' },
  xmpSupport: { en: 'XMP Support', bg: 'XMP поддръжка' },
  expoSupport: { en: 'EXPO Support', bg: 'EXPO поддръжка' },
  heatspreader: { en: 'Heatspreader', bg: 'Радиатор' },
  height: { en: 'Height', bg: 'Височина' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// STORAGE SPECIFICATIONS
// ============================================

export const storageSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  type: { en: 'Type', bg: 'Тип' },
  capacity: { en: 'Capacity', bg: 'Капацитет' },
  interface: { en: 'Interface', bg: 'Интерфейс' },
  formFactor: { en: 'Form Factor', bg: 'Форм фактор' },
  readSpeed: { en: 'Read Speed', bg: 'Скорост на четене' },
  writeSpeed: { en: 'Write Speed', bg: 'Скорост на запис' },
  iops: { en: 'IOPS', bg: 'IOPS' },
  tbw: { en: 'TBW', bg: 'TBW' },
  cache: { en: 'Cache', bg: 'Кеш' },
  nand: { en: 'NAND Type', bg: 'Тип NAND' },
  controller: { en: 'Controller', bg: 'Контролер' },
  encryption: { en: 'Encryption', bg: 'Криптиране' },
  heatsink: { en: 'Heatsink', bg: 'Радиатор' },
};

// ============================================
// PSU SPECIFICATIONS
// ============================================

export const psuSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  wattage: { en: 'Wattage', bg: 'Мощност' },
  efficiency: { en: 'Efficiency', bg: 'Ефективност' },
  modular: { en: 'Modular', bg: 'Модулен' },
  formFactor: { en: 'Form Factor', bg: 'Форм фактор' },
  fanSize: { en: 'Fan Size', bg: 'Размер на вентилатор' },
  fanType: { en: 'Fan Type', bg: 'Тип вентилатор' },
  atx24pin: { en: 'ATX 24-pin', bg: 'ATX 24-pin' },
  eps8pin: { en: 'EPS 8-pin', bg: 'EPS 8-pin' },
  pcie16pin: { en: 'PCIe 16-pin', bg: 'PCIe 16-pin' },
  pcie8pin: { en: 'PCIe 8-pin', bg: 'PCIe 8-pin' },
  pcie6pin: { en: 'PCIe 6-pin', bg: 'PCIe 6-pin' },
  sata: { en: 'SATA', bg: 'SATA' },
  molex: { en: 'Molex', bg: 'Molex' },
  protections: { en: 'Protections', bg: 'Защити' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// CASE SPECIFICATIONS
// ============================================

export const caseSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  type: { en: 'Type', bg: 'Тип' },
  motherboardSupport: { en: 'Motherboard Support', bg: 'Поддръжка на дънни платки' },
  maxGPULength: { en: 'Max GPU Length', bg: 'Макс. дължина на GPU' },
  maxCPUCoolerHeight: { en: 'Max CPU Cooler Height', bg: 'Макс. височина на охладител' },
  maxPSULength: { en: 'Max PSU Length', bg: 'Макс. дължина на PSU' },
  driveBays35: { en: '3.5" Drive Bays', bg: '3.5" слотове' },
  driveBays25: { en: '2.5" Drive Bays', bg: '2.5" слотове' },
  expansionSlots: { en: 'Expansion Slots', bg: 'Разширителни слотове' },
  frontPorts: { en: 'Front Ports', bg: 'Предни портове' },
  includedFans: { en: 'Included Fans', bg: 'Включени вентилатори' },
  fanSupport: { en: 'Fan Support', bg: 'Поддръжка на вентилатори' },
  radiatorSupport: { en: 'Radiator Support', bg: 'Поддръжка на радиатори' },
  sidePanelType: { en: 'Side Panel', bg: 'Страничен панел' },
  dustFilters: { en: 'Dust Filters', bg: 'Филтри против прах' },
  color: { en: 'Color', bg: 'Цвят' },
  dimensions: { en: 'Dimensions', bg: 'Размери' },
  weight: { en: 'Weight', bg: 'Тегло' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// COOLING SPECIFICATIONS
// ============================================

export const coolingSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  type: { en: 'Type', bg: 'Тип' },
  socketSupport: { en: 'Socket Support', bg: 'Поддържани сокети' },
  tdpRating: { en: 'TDP Rating', bg: 'TDP рейтинг' },
  fanSize: { en: 'Fan Size', bg: 'Размер на вентилатор' },
  fanCount: { en: 'Fan Count', bg: 'Брой вентилатори' },
  fanSpeed: { en: 'Fan Speed', bg: 'Скорост на вентилатор' },
  airflow: { en: 'Airflow', bg: 'Въздушен поток' },
  noiseLevel: { en: 'Noise Level', bg: 'Ниво на шум' },
  radiatorSize: { en: 'Radiator Size', bg: 'Размер на радиатор' },
  radiatorThickness: { en: 'Radiator Thickness', bg: 'Дебелина на радиатор' },
  pumpSpeed: { en: 'Pump Speed', bg: 'Скорост на помпа' },
  height: { en: 'Height', bg: 'Височина' },
  heatpipes: { en: 'Heatpipes', bg: 'Топлинни тръби' },
  bearing: { en: 'Bearing Type', bg: 'Тип лагер' },
  connector: { en: 'Connector', bg: 'Конектор' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// LAPTOP SPECIFICATIONS
// ============================================

export const laptopSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  screenSize: { en: 'Screen Size', bg: 'Размер на екрана' },
  screenResolution: { en: 'Resolution', bg: 'Резолюция' },
  screenRefreshRate: { en: 'Refresh Rate', bg: 'Честота на опресняване' },
  panelType: { en: 'Panel Type', bg: 'Тип панел' },
  screenBrightness: { en: 'Brightness', bg: 'Яркост' },
  cpuManufacturer: { en: 'CPU Manufacturer', bg: 'Производител на CPU' },
  cpuSeries: { en: 'CPU Series', bg: 'Серия CPU' },
  cpuModel: { en: 'CPU Model', bg: 'Модел CPU' },
  gpuManufacturer: { en: 'GPU Manufacturer', bg: 'Производител на GPU' },
  gpuModel: { en: 'GPU Model', bg: 'Модел GPU' },
  gpuVRAM: { en: 'GPU VRAM', bg: 'GPU памет' },
  ramType: { en: 'RAM Type', bg: 'Тип RAM' },
  ramSize: { en: 'RAM Size', bg: 'RAM памет' },
  ramSpeed: { en: 'RAM Speed', bg: 'Скорост на RAM' },
  ramUpgradeable: { en: 'RAM Upgradeable', bg: 'Надграждаема RAM' },
  storageType: { en: 'Storage Type', bg: 'Тип съхранение' },
  storageCapacity: { en: 'Storage Capacity', bg: 'Капацитет' },
  wirelessWiFi: { en: 'WiFi', bg: 'WiFi' },
  wirelessBluetooth: { en: 'Bluetooth', bg: 'Bluetooth' },
  webcam: { en: 'Webcam', bg: 'Уеб камера' },
  keyboardType: { en: 'Keyboard Type', bg: 'Тип клавиатура' },
  keyboardBacklight: { en: 'Keyboard Backlight', bg: 'Подсветка на клавиатура' },
  batteryCapacity: { en: 'Battery', bg: 'Батерия' },
  chargerWattage: { en: 'Charger', bg: 'Зарядно' },
  weight: { en: 'Weight', bg: 'Тегло' },
  color: { en: 'Color', bg: 'Цвят' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// KEYBOARD SPECIFICATIONS
// ============================================

export const keyboardSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  type: { en: 'Type', bg: 'Тип' },
  formFactor: { en: 'Form Factor', bg: 'Форм фактор' },
  switchBrand: { en: 'Switch Brand', bg: 'Марка суичове' },
  switchType: { en: 'Switch Type', bg: 'Тип суичове' },
  actuationForce: { en: 'Actuation Force', bg: 'Сила на натискане' },
  actuationPoint: { en: 'Actuation Point', bg: 'Точка на задействане' },
  hotSwappable: { en: 'Hot-Swappable', bg: 'Hot-Swappable' },
  nKeyRollover: { en: 'N-Key Rollover', bg: 'N-Key Rollover' },
  pollingRate: { en: 'Polling Rate', bg: 'Честота на опресняване' },
  connectivity: { en: 'Connectivity', bg: 'Свързване' },
  cableType: { en: 'Cable Type', bg: 'Тип кабел' },
  batteryLife: { en: 'Battery Life', bg: 'Живот на батерията' },
  keycapMaterial: { en: 'Keycap Material', bg: 'Материал на капачки' },
  backlighting: { en: 'Backlighting', bg: 'Подсветка' },
  wristRest: { en: 'Wrist Rest', bg: 'Опора за китки' },
  mediaControls: { en: 'Media Controls', bg: 'Медийни бутони' },
  software: { en: 'Software', bg: 'Софтуер' },
  weight: { en: 'Weight', bg: 'Тегло' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// MOUSE SPECIFICATIONS
// ============================================

export const mouseSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  sensorType: { en: 'Sensor Type', bg: 'Тип сензор' },
  sensorModel: { en: 'Sensor Model', bg: 'Модел сензор' },
  dpi: { en: 'DPI', bg: 'DPI' },
  maxAcceleration: { en: 'Max Acceleration', bg: 'Макс. ускорение' },
  maxSpeed: { en: 'Max Speed', bg: 'Макс. скорост' },
  pollingRate: { en: 'Polling Rate', bg: 'Честота на опресняване' },
  buttons: { en: 'Buttons', bg: 'Бутони' },
  mainSwitches: { en: 'Main Switches', bg: 'Основни суичове' },
  scrollWheel: { en: 'Scroll Wheel', bg: 'Скрол' },
  connectivity: { en: 'Connectivity', bg: 'Свързване' },
  cableType: { en: 'Cable Type', bg: 'Тип кабел' },
  batteryLife: { en: 'Battery Life', bg: 'Живот на батерията' },
  gripStyle: { en: 'Grip Style', bg: 'Стил на хващане' },
  handOrientation: { en: 'Hand Orientation', bg: 'Ориентация' },
  weight: { en: 'Weight', bg: 'Тегло' },
  length: { en: 'Length', bg: 'Дължина' },
  width: { en: 'Width', bg: 'Ширина' },
  height: { en: 'Height', bg: 'Височина' },
  feetMaterial: { en: 'Feet Material', bg: 'Материал на плъзгачи' },
  software: { en: 'Software', bg: 'Софтуер' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// MONITOR SPECIFICATIONS
// ============================================

export const monitorSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  screenSize: { en: 'Screen Size', bg: 'Размер' },
  aspectRatio: { en: 'Aspect Ratio', bg: 'Съотношение' },
  resolution: { en: 'Resolution', bg: 'Резолюция' },
  panelType: { en: 'Panel Type', bg: 'Тип панел' },
  refreshRate: { en: 'Refresh Rate', bg: 'Честота' },
  responseTime: { en: 'Response Time', bg: 'Време за реакция' },
  brightness: { en: 'Brightness', bg: 'Яркост' },
  contrast: { en: 'Contrast', bg: 'Контраст' },
  hdrSupport: { en: 'HDR Support', bg: 'HDR поддръжка' },
  colorGamut: { en: 'Color Gamut', bg: 'Цветови обхват' },
  colorDepth: { en: 'Color Depth', bg: 'Дълбочина на цвета' },
  adaptiveSync: { en: 'Adaptive Sync', bg: 'Adaptive Sync' },
  curvature: { en: 'Curvature', bg: 'Извивка' },
  displayPortVersion: { en: 'DisplayPort', bg: 'DisplayPort' },
  displayPortCount: { en: 'DisplayPort Count', bg: 'Брой DisplayPort' },
  hdmiVersion: { en: 'HDMI', bg: 'HDMI' },
  hdmiCount: { en: 'HDMI Count', bg: 'Брой HDMI' },
  usbHub: { en: 'USB Hub', bg: 'USB хъб' },
  builtInSpeakers: { en: 'Built-in Speakers', bg: 'Вградени говорители' },
  vesaMount: { en: 'VESA Mount', bg: 'VESA монтаж' },
  standAdjustment: { en: 'Stand Adjustment', bg: 'Настройки на стойката' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// HEADSET SPECIFICATIONS
// ============================================

export const headsetSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  type: { en: 'Type', bg: 'Тип' },
  connectivity: { en: 'Connectivity', bg: 'Свързване' },
  driverSize: { en: 'Driver Size', bg: 'Размер на драйвери' },
  driverType: { en: 'Driver Type', bg: 'Тип драйвери' },
  frequencyResponse: { en: 'Frequency Response', bg: 'Честотен диапазон' },
  impedance: { en: 'Impedance', bg: 'Импеданс' },
  sensitivity: { en: 'Sensitivity', bg: 'Чувствителност' },
  surroundSound: { en: 'Surround Sound', bg: 'Съраунд звук' },
  anc: { en: 'Active Noise Cancelling', bg: 'Активно шумопотискане' },
  microphoneType: { en: 'Microphone Type', bg: 'Тип микрофон' },
  microphonePattern: { en: 'Microphone Pattern', bg: 'Посочност на микрофон' },
  batteryLife: { en: 'Battery Life', bg: 'Живот на батерията' },
  earcupMaterial: { en: 'Earcup Material', bg: 'Материал на наушници' },
  weight: { en: 'Weight', bg: 'Тегло' },
  foldable: { en: 'Foldable', bg: 'Сгъваеми' },
  software: { en: 'Software', bg: 'Софтуер' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// MOUSEPAD SPECIFICATIONS
// ============================================

export const mousepadSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  type: { en: 'Type', bg: 'Тип' },
  surface: { en: 'Surface', bg: 'Повърхност' },
  size: { en: 'Size', bg: 'Размер' },
  length: { en: 'Length', bg: 'Дължина' },
  width: { en: 'Width', bg: 'Ширина' },
  thickness: { en: 'Thickness', bg: 'Дебелина' },
  baseMaterial: { en: 'Base Material', bg: 'Материал на основа' },
  surfaceMaterial: { en: 'Surface Material', bg: 'Материал на повърхност' },
  stitchedEdges: { en: 'Stitched Edges', bg: 'Зашити краища' },
  waterResistant: { en: 'Water Resistant', bg: 'Водоустойчив' },
  washable: { en: 'Washable', bg: 'Пере се' },
  wirelessCharging: { en: 'Wireless Charging', bg: 'Безжично зареждане' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// MICROPHONE SPECIFICATIONS
// ============================================

export const microphoneSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  type: { en: 'Connection Type', bg: 'Тип връзка' },
  microphoneType: { en: 'Microphone Type', bg: 'Тип микрофон' },
  polarPattern: { en: 'Polar Pattern', bg: 'Полярен модел' },
  frequencyResponse: { en: 'Frequency Response', bg: 'Честотен диапазон' },
  sampleRate: { en: 'Sample Rate', bg: 'Честота на дискретизация' },
  bitDepth: { en: 'Bit Depth', bg: 'Битова дълбочина' },
  sensitivity: { en: 'Sensitivity', bg: 'Чувствителност' },
  maxSPL: { en: 'Max SPL', bg: 'Макс. SPL' },
  gainControl: { en: 'Gain Control', bg: 'Контрол на усилване' },
  muteButton: { en: 'Mute Button', bg: 'Бутон за заглушаване' },
  headphoneOutput: { en: 'Headphone Output', bg: 'Изход за слушалки' },
  popFilter: { en: 'Pop Filter', bg: 'Поп филтър' },
  shockMount: { en: 'Shock Mount', bg: 'Shock Mount' },
  mountType: { en: 'Mount Type', bg: 'Тип монтаж' },
  software: { en: 'Software', bg: 'Софтуер' },
  weight: { en: 'Weight', bg: 'Тегло' },
  rgb: { en: 'RGB Lighting', bg: 'RGB осветление' },
};

// ============================================
// WEBCAM SPECIFICATIONS
// ============================================

export const webcamSpecLabels: SpecConfig = {
  manufacturer: { en: 'Manufacturer', bg: 'Производител' },
  series: { en: 'Series', bg: 'Серия' },
  resolution: { en: 'Resolution', bg: 'Резолюция' },
  maxResolutionFramerate: { en: 'Max Framerate', bg: 'Макс. кадри' },
  sensorType: { en: 'Sensor Type', bg: 'Тип сензор' },
  fieldOfView: { en: 'Field of View', bg: 'Зрително поле' },
  focusType: { en: 'Focus Type', bg: 'Тип фокус' },
  autofocusType: { en: 'Autofocus', bg: 'Автофокус' },
  hdr: { en: 'HDR', bg: 'HDR' },
  lowLightCorrection: { en: 'Low Light Correction', bg: 'Корекция при слаба светлина' },
  microphone: { en: 'Microphone', bg: 'Микрофон' },
  microphoneType: { en: 'Microphone Type', bg: 'Тип микрофон' },
  privacyShutter: { en: 'Privacy Shutter', bg: 'Капак за поверителност' },
  connectivity: { en: 'Connectivity', bg: 'Свързване' },
  mountType: { en: 'Mount Type', bg: 'Тип монтаж' },
  tripodThread: { en: 'Tripod Thread', bg: 'Резба за статив' },
  ringLight: { en: 'Ring Light', bg: 'Пръстеновидна светлина' },
  software: { en: 'Software', bg: 'Софтуер' },
  weight: { en: 'Weight', bg: 'Тегло' },
};

// ============================================
// GET SPEC LABELS BY CATEGORY
// ============================================

const specLabelsMap: { [key: string]: SpecConfig } = {
  'gpu-specification': gpuSpecLabels,
  'cpu-specification': cpuSpecLabels,
  'motherboard-specification': motherboardSpecLabels,
  'ram-specification': ramSpecLabels,
  'storage-specification': storageSpecLabels,
  'psu-specification': psuSpecLabels,
  'case-specification': caseSpecLabels,
  'cooling-specification': coolingSpecLabels,
  'laptop-specification': laptopSpecLabels,
  'keyboard-specification': keyboardSpecLabels,
  'mouse-specification': mouseSpecLabels,
  'monitor-specification': monitorSpecLabels,
  'headset-specification': headsetSpecLabels,
  'mousepad-specification': mousepadSpecLabels,
  'microphone-specification': microphoneSpecLabels,
  'webcam-specification': webcamSpecLabels,
};

export function getSpecLabels(specType: string): SpecConfig {
  return specLabelsMap[specType] || {};
}

// ============================================
// GET SPEC RELATION NAME BY CATEGORY SLUG
// ============================================

const categoryToSpecRelation: { [key: string]: string } = {
  'graphics-cards': 'gpuSpecification',
  'processors': 'cpuSpecification',
  'motherboards': 'motherboardSpecification',
  'ram': 'ramSpecification',
  'storage': 'storageSpecification',
  'power-supplies': 'psuSpecification',
  'cases': 'caseSpecification',
  'cooling': 'coolingSpecification',
  'laptops': 'laptopSpecification',
  'gaming-laptops': 'laptopSpecification',
  'keyboards': 'keyboardSpecification',
  'gaming-keyboards': 'keyboardSpecification',
  'mice': 'mouseSpecification',
  'gaming-mice': 'mouseSpecification',
  'monitors': 'monitorSpecification',
  'gaming-monitors': 'monitorSpecification',
  'headsets': 'headsetSpecification',
  'gaming-headsets': 'headsetSpecification',
  'mousepads': 'mousepadSpecification',
  'gaming-mousepads': 'mousepadSpecification',
  'microphones': 'microphoneSpecification',
  'streaming-microphones': 'microphoneSpecification',
  'webcams': 'webcamSpecification',
  'streaming-webcams': 'webcamSpecification',
};

export function getSpecRelation(categorySlug: string): string | null {
  return categoryToSpecRelation[categorySlug] || null;
}

export function getSpecType(categorySlug: string): string | null {
  const relation = categoryToSpecRelation[categorySlug];
  if (!relation) return null;
  
  // Convert camelCase to kebab-case and add -specification
  return relation.replace(/([A-Z])/g, '-$1').toLowerCase().replace('specification', '-specification').replace('--', '-');
}
