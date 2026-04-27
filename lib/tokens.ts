export const brand = {
  teal: '#3AA2B7',
  tealLight: '#9AE6FA',
  tealAccent: '#4AC9E3',
  tealDark: '#25676E',
  white: '#FFFFFF',
} as const;

export const page = {
  bg: '#FAF8F6',
  cardBg: '#FFFFFF',
  cardAccent: '#DCF5FD',
  border: '#E5E7EB',
  divider: '#E5E7EB',
} as const;

export const text = {
  primary: '#231F20',
  secondary: '#605759',
  muted: '#6A7282',
  placeholder: '#908386',
  link: '#25676E',
  onDark: '#FFFFFF',
} as const;

export const healthZone = {
  poor: { bg: '#FEF2F2', label: 'Poor', range: '0–59', color: '#EF4444' },
  good: { bg: '#FEFCE8', label: 'Good', range: '60–85', color: '#EAB308' },
  excellent: { bg: '#ECFDF5', label: 'Excellent', range: '86–100', color: '#22C55E' },
} as const;

export const verticalColors: Record<string, string> = {
  Healthcare: '#2563EB',
  Investment: '#16A34A',
  'Human Resources': '#D97706',
  Packaging: '#DB2777',
  'Life Sciences': '#8B5CF6',
  Manufacturing: '#0EA5E9',
  Legal: '#F97316',
  'Clinical Trials': '#14B8A6',
  Procurement: '#6366F1',
  Energy: '#E11D48',
  'Tech Leaders': '#84CC16',
  'Marketing Leaders': '#A855F7',
};

export const verticals = Object.keys(verticalColors);

export type HealthZoneKey = 'poor' | 'good' | 'excellent';

export function getHealthZone(score: number): HealthZoneKey {
  if (score <= 59) return 'poor';
  if (score <= 85) return 'good';
  return 'excellent';
}
