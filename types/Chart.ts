export type ChartMetric = 'voltage' | 'current' | 'temperature' | 'speed' | 'batterySoc' | 'rpm' | 'oilPressure';
export type ChartRange = '1h' | '6h' | '24h' | '7d' | '30d';

export interface ChartPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  metric: ChartMetric;
  unit: string;
  color: string;
  data: ChartPoint[];
  min?: number;
  max?: number;
  avg?: number;
}

export interface ChartConfig {
  vehicleId: string;
  metric: ChartMetric;
  range: ChartRange;
  title: string;
  unit: string;
  color: string;
  warningThreshold?: number;
  criticalThreshold?: number;
}

export interface AnalyticsData {
  vehicleId: string;
  period: string;
  healthTrend: ChartPoint[];
  efficiencyScore: number;
  downtimeHours: number;
  maintenanceCost: number;
  fuelEfficiency: number;
  alertsByCategory: { category: string; count: number }[];
  maintenanceByType: { type: string; count: number }[];
  componentHealth: { component: string; health: number }[];
  monthlyCosts: { month: string; predictive: number; preventive: number; corrective: number }[];
  utilizationRate: number;
  mtbf: number;
  mttr: number;
}
