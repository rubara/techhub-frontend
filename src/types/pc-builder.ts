// PC Builder Types

export interface PcBuildTemplate {
  id: number;
  name: string;
  nameBg: string;
  slug: string;
  basePrice: number;
  platform: 'AMD' | 'Intel';
  image?: { url: string };
  gallery?: { url: string }[];
  description?: string;
  descriptionBg?: string;
  active: boolean;
}

export interface BuildComponent {
  id: number;
  name: string;
  nameBg?: string;
  category: ComponentCategory;
  priceDifference: number;
  isDefault: boolean;
  hasRgb: boolean;
  image?: { url: string };
  order: number;
}

export type ComponentCategory = 
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooling'
  | 'fans'
  | 'os';

export interface SelectedComponents {
  cpu?: BuildComponent;
  gpu?: BuildComponent;
  motherboard?: BuildComponent;
  ram?: BuildComponent;
  storage?: BuildComponent;
  psu?: BuildComponent;
  case?: BuildComponent;
  cooling?: BuildComponent;
  fans?: BuildComponent;
  os?: BuildComponent;
}

export const categoryLabels: Record<ComponentCategory, { en: string; bg: string; icon: string }> = {
  cpu: { en: 'Processor', bg: 'Процесор', icon: '🔲' },
  gpu: { en: 'Graphics Card', bg: 'Видео карта', icon: '🎮' },
  motherboard: { en: 'Motherboard', bg: 'Дънна платка', icon: '🔌' },
  ram: { en: 'Memory', bg: 'Памет', icon: '💾' },
  storage: { en: 'Storage', bg: 'Съхранение', icon: '💿' },
  psu: { en: 'Power Supply', bg: 'Захранване', icon: '⚡' },
  case: { en: 'Case', bg: 'Кутия', icon: '🖥️' },
  cooling: { en: 'CPU Cooling', bg: 'Охлаждане', icon: '❄️' },
  fans: { en: 'Case Fans', bg: 'Вентилатори', icon: '🌀' },
  os: { en: 'Operating System', bg: 'Операционна система', icon: '💻' },
};

export const categoryOrder: ComponentCategory[] = [
  'cpu',
  'gpu',
  'motherboard',
  'ram',
  'storage',
  'psu',
  'case',
  'cooling',
  'fans',
  'os',
];
