export interface TelemetryReading {
  timestamp: string;
  value: number;
}

export interface TelemetryData {
  vehicleId: string;
  voltage: number;
  current: number;
  temperature: number;
  speed: number;
  rpm: number;
  batterySoc: number;
  coolantTemp: number;
  oilPressure: number;
  tirePressure: number;
  lastUpdated: string;
}

export interface TelemetryHistory {
  vehicleId: string;
  voltage: TelemetryReading[];
  current: TelemetryReading[];
  temperature: TelemetryReading[];
  speed: TelemetryReading[];
  batterySoc: TelemetryReading[];
}

export interface LiveMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warning: number;
  critical: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}
