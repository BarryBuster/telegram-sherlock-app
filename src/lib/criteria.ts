// Конфігурація 8 критеріїв оцінки з вагами

export interface CriterionConfig {
  key: string;
  label: string;
  labelUk: string;
  weight: number;
  icon: string;
}

export const CRITERIA: CriterionConfig[] = [
  { key: 'cost',          label: 'Financial Cost',        labelUk: 'Фінансові витрати',          weight: 0.8,  icon: '💰' },
  { key: 'time',          label: 'Time to Market',        labelUk: 'Час виходу на ринок',         weight: 0.7,  icon: '⏱️' },
  { key: 'risk',          label: 'Risk Mitigation',       labelUk: 'Мітигація ризиків',           weight: 0.9,  icon: '🛡️' },
  { key: 'benefit',       label: 'Strategic Impact',      labelUk: 'Стратегічний вплив',          weight: 1.0,  icon: '🎯' },
  { key: 'complexity',    label: 'Implementation Effort', labelUk: 'Зусилля на впровадження',     weight: 0.6,  icon: '⚙️' },
  { key: 'comfort',       label: 'Emotional Comfort',     labelUk: 'Емоційний комфорт',           weight: 0.5,  icon: '💚' },
  { key: 'reversibility', label: 'Reversibility',         labelUk: 'Зворотність',                 weight: 0.7,  icon: '🔄' },
  { key: 'longterm',      label: 'Long-term Effect',      labelUk: 'Довгостроковий ефект',        weight: 0.9,  icon: '📈' },
];

export const TOTAL_WEIGHT = CRITERIA.reduce((sum, c) => sum + c.weight, 0);
