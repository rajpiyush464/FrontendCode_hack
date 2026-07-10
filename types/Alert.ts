export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  vehicleId: string;
  vehicleName?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  metric?: string;
  value?: number;
  threshold?: number;
  unit?: string;
  timestamp: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  category: 'battery' | 'engine' | 'brakes' | 'tires' | 'cooling' | 'electrical' | 'maintenance' | 'system';
}

export interface AlertThreshold {
  metric: string;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  unit: string;
}
