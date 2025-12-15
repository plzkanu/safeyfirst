export type RiskType = 
  | 'fall'
  | 'electric-shock'
  | 'fire'
  | 'explosion'
  | 'chemical'
  | 'mechanical'
  | 'other';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface RiskTypeOption {
  id: RiskType;
  label: string;
  icon?: string;
}

export const RISK_TYPES: RiskTypeOption[] = [
  { id: 'fall', label: '낙하 위험' },
  { id: 'electric-shock', label: '감전 위험' },
  { id: 'fire', label: '화재 위험' },
  { id: 'explosion', label: '폭발 위험' },
  { id: 'chemical', label: '화학물질 위험' },
  { id: 'mechanical', label: '기계적 위험' },
  { id: 'other', label: '기타' },
];

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  high: '상',
  medium: '중',
  low: '하',
};

