export interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  change?: {
    value?: number;
    type: 'increase' | 'decrease' | 'no-change';
    period?: string;
  };
}
