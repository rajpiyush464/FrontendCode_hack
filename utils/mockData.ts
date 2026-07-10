import type {
  Vehicle,
  VehicleHealth,
  VehicleStats,
  TelemetryData,
  TelemetryHistory,
  Alert,
  MaintenanceTask,
  MaintenancePrediction,
  MaintenanceSummary,
  AnalyticsData,
  ChartPoint,
  ChartSeries,
} from '../types';

const now = () => new Date().toISOString();

export const VEHICLE_ID = 'EV-001';

export const mockVehicle: Vehicle = {
  id: VEHICLE_ID,
  name: 'CyberGuard Ev-Alpha',
  model: 'Model S Plaid (AI Enhanced)',
  make: 'Tesla',
  year: 2026,
  vin: '5YJ3E1EA1KF123456',
  licensePlate: 'EV-ALPHA-1',
  battery: 87,
  health: 92,
  mileage: 28450,
  status: 'active',
  lastService: '2026-05-12',
  nextService: '2026-08-15',
  fuelType: 'electric',
  location: 'Bay Area Depot',
  driver: 'Alex Rivera',
  imageUrl: 'https://images.pexels.com/photos/18977344/pexels-photo-18977344.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};

export const mockVehicles: Vehicle[] = [
  mockVehicle,
];

export const mockHealth: VehicleHealth = {
  vehicleId: VEHICLE_ID,
  overall: 92,
  battery: 94,
  engine: 90,
  brakes: 88,
  tires: 85,
  cooling: 91,
  electrical: 96,
  transmission: 93,
  lastUpdated: now(),
};

export const mockStats: VehicleStats = {
  totalVehicles: 1,
  activeVehicles: 1,
  criticalAlerts: 1,
  pendingMaintenance: 2,
  avgHealth: 92.0,
  uptime: 99.8,
};

function generateSeries(
  base: number,
  variance: number,
  points = 48,
  intervalMs = 30 * 60 * 1000
): ChartPoint[] {
  const result: ChartPoint[] = [];
  const start = Date.now() - points * intervalMs;
  let value = base;

  for (let i = 0; i < points; i++) {
    value = Math.max(0, value + (Math.random() - 0.48) * variance);
    result.push({
      timestamp: new Date(start + i * intervalMs).toISOString(),
      value: Number(value.toFixed(2)),
    });
  }
  return result;
}

export function createLiveTelemetry(vehicleId = VEHICLE_ID): TelemetryData {
  // Occasionally spike metrics beyond thresholds so alert beeps can be demonstrated
  const spike = Math.random();
  let voltage = 380 + Math.random() * 40;
  let current = 80 + Math.random() * 60;
  let temperature = 35 + Math.random() * 30;
  let batterySoc = 70 + Math.random() * 25;

  if (spike > 0.82) {
    temperature = 71 + Math.random() * 20; // warning/critical temp
  }
  if (spike > 0.9) {
    voltage = 330 + Math.random() * 25; // low voltage
  }
  if (spike > 0.93) {
    current = 165 + Math.random() * 30; // high current
  }
  if (spike > 0.95) {
    batterySoc = 8 + Math.random() * 10; // low SOC
  }

  return {
    vehicleId,
    voltage: Number(voltage.toFixed(1)),
    current: Number(current.toFixed(1)),
    temperature: Number(temperature.toFixed(1)),
    speed: Number((20 + Math.random() * 80).toFixed(0)),
    rpm: Number((800 + Math.random() * 3200).toFixed(0)),
    batterySoc: Number(batterySoc.toFixed(1)),
    coolantTemp: Number((40 + Math.random() * 30).toFixed(1)),
    oilPressure: Number((30 + Math.random() * 20).toFixed(1)),
    tirePressure: Number((32 + Math.random() * 4).toFixed(1)),
    lastUpdated: now(),
  };
}

export function createTelemetryHistory(vehicleId = VEHICLE_ID): TelemetryHistory {
  return {
    vehicleId,
    voltage: generateSeries(400, 12),
    current: generateSeries(110, 25),
    temperature: generateSeries(55, 10),
    speed: generateSeries(45, 20),
    batterySoc: generateSeries(82, 4),
  };
}

export function createChartSeries(
  vehicleId: string,
  metric: 'voltage' | 'current' | 'temperature' | 'speed' | 'batterySoc'
): ChartSeries {
  const configs = {
    voltage: { name: 'Battery Voltage', unit: 'V', color: '#06b6d4', base: 400, variance: 12 },
    current: { name: 'Current Draw', unit: 'A', color: '#8b5cf6', base: 110, variance: 25 },
    temperature: { name: 'Temperature', unit: '°C', color: '#f59e0b', base: 55, variance: 10 },
    speed: { name: 'Speed', unit: 'km/h', color: '#10b981', base: 45, variance: 20 },
    batterySoc: { name: 'Battery SOC', unit: '%', color: '#3b82f6', base: 82, variance: 4 },
  } as const;

  const cfg = configs[metric];
  const data = generateSeries(cfg.base, cfg.variance);
  const values = data.map((d) => d.value);

  return {
    id: `${vehicleId}-${metric}`,
    name: cfg.name,
    metric,
    unit: cfg.unit,
    color: cfg.color,
    data,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  };
}

let alertCounter = 100;

export function createMockAlerts(vehicleId = VEHICLE_ID): Alert[] {
  return [
    {
      id: 'ALT-001',
      vehicleId,
      vehicleName: 'Fleet Unit Alpha',
      title: 'High Battery Temperature',
      message: 'Battery pack temperature exceeded warning threshold of 70°C',
      severity: 'warning',
      status: 'active',
      metric: 'temperature',
      value: 72.4,
      threshold: 70,
      unit: '°C',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      category: 'battery',
    },
    {
      id: 'ALT-002',
      vehicleId,
      vehicleName: 'Fleet Unit Alpha',
      title: 'Voltage Fluctuation Detected',
      message: 'Battery voltage variance exceeds normal operating range',
      severity: 'critical',
      status: 'active',
      metric: 'voltage',
      value: 358.2,
      threshold: 360,
      unit: 'V',
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      category: 'electrical',
    },
    {
      id: 'ALT-003',
      vehicleId: 'VH-2024-003',
      vehicleName: 'Fleet Unit Gamma',
      title: 'Brake Pad Wear Critical',
      message: 'Front brake pads below 15% remaining life — schedule replacement',
      severity: 'critical',
      status: 'active',
      metric: 'brakes',
      value: 12,
      threshold: 15,
      unit: '%',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      category: 'brakes',
    },
    {
      id: 'ALT-004',
      vehicleId: 'VH-2024-002',
      vehicleName: 'Fleet Unit Beta',
      title: 'Coolant Level Low',
      message: 'Coolant reservoir below recommended minimum level',
      severity: 'warning',
      status: 'acknowledged',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      category: 'cooling',
    },
    {
      id: 'ALT-005',
      vehicleId,
      vehicleName: 'Fleet Unit Alpha',
      title: 'Tire Pressure Uneven',
      message: 'Rear-left tire pressure 4 PSI below recommended',
      severity: 'info',
      status: 'active',
      metric: 'tirePressure',
      value: 30,
      threshold: 34,
      unit: 'PSI',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      category: 'tires',
    },
  ];
}

export function generateThresholdAlert(
  vehicleId: string,
  metric: string,
  value: number,
  threshold: number,
  severity: 'warning' | 'critical',
  unit: string
): Alert {
  alertCounter += 1;
  const titles: Record<string, string> = {
    voltage: 'Voltage Out of Range',
    current: 'Current Overload',
    temperature: 'Temperature Threshold Breach',
    batterySoc: 'Low Battery SOC',
    speed: 'Speed Anomaly',
  };

  return {
    id: `ALT-${alertCounter}`,
    vehicleId,
    vehicleName: mockVehicle.name,
    title: titles[metric] || `${metric} Alert`,
    message: `${metric} reading ${value}${unit} exceeded ${severity} threshold of ${threshold}${unit}`,
    severity,
    status: 'active',
    metric,
    value,
    threshold,
    unit,
    timestamp: now(),
    category: metric === 'temperature' ? 'cooling' : metric === 'voltage' || metric === 'current' ? 'electrical' : 'battery',
  };
}

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'MNT-001',
    vehicleId: VEHICLE_ID,
    vehicleName: 'Fleet Unit Alpha',
    title: 'Battery Thermal Management Check',
    description: 'Predictive model indicates elevated thermal stress patterns. Inspect cooling system and battery module connections.',
    type: 'predictive',
    priority: 'high',
    status: 'scheduled',
    predictedFailureDate: '2026-07-25',
    confidence: 87,
    estimatedCost: 450,
    estimatedDuration: 3,
    scheduledDate: '2026-07-12',
    component: 'Battery Pack',
    recommendations: [
      'Inspect coolant flow rates',
      'Check thermal paste on BMS modules',
      'Run diagnostic thermal cycle test',
    ],
    assignedTo: 'Tech Team A',
  },
  {
    id: 'MNT-002',
    vehicleId: VEHICLE_ID,
    vehicleName: 'Fleet Unit Alpha',
    title: 'Quarterly Preventive Inspection',
    description: 'Scheduled preventive maintenance including brake, tire, and electrical system inspection.',
    type: 'preventive',
    priority: 'medium',
    status: 'scheduled',
    estimatedCost: 280,
    estimatedDuration: 4,
    scheduledDate: '2026-07-18',
    component: 'Full Vehicle',
    recommendations: [
      'Rotate tires',
      'Check brake fluid',
      'Update ECU firmware',
      'Inspect charging port',
    ],
    assignedTo: 'Tech Team B',
  },
  {
    id: 'MNT-003',
    vehicleId: 'VH-2024-003',
    vehicleName: 'Fleet Unit Gamma',
    title: 'Brake Pad Replacement',
    description: 'Critical wear detected on front brake pads. Immediate replacement required.',
    type: 'corrective',
    priority: 'critical',
    status: 'in_progress',
    estimatedCost: 620,
    estimatedDuration: 2,
    scheduledDate: '2026-07-08',
    component: 'Brakes',
    recommendations: ['Replace front pads', 'Resurface rotors if needed', 'Bleed brake lines'],
    assignedTo: 'Tech Team A',
  },
  {
    id: 'MNT-004',
    vehicleId: 'VH-2024-002',
    vehicleName: 'Fleet Unit Beta',
    title: 'Inverter Capacitor Health Check',
    description: 'ML model predicts capacitor degradation based on voltage ripple patterns.',
    type: 'predictive',
    priority: 'medium',
    status: 'scheduled',
    predictedFailureDate: '2026-08-30',
    confidence: 74,
    estimatedCost: 890,
    estimatedDuration: 5,
    scheduledDate: '2026-07-22',
    component: 'Power Inverter',
    recommendations: ['Measure ESR values', 'Inspect solder joints', 'Replace if ESR > threshold'],
  },
  {
    id: 'MNT-005',
    vehicleId: VEHICLE_ID,
    vehicleName: 'Fleet Unit Alpha',
    title: 'Cabin Air Filter Replacement',
    description: 'Preventive replacement based on mileage interval.',
    type: 'preventive',
    priority: 'low',
    status: 'completed',
    estimatedCost: 45,
    estimatedDuration: 0.5,
    scheduledDate: '2026-06-15',
    completedDate: '2026-06-15',
    component: 'HVAC',
    recommendations: ['Replace HEPA filter', 'Clean intake ducts'],
  },
  {
    id: 'MNT-006',
    vehicleId: 'VH-2024-003',
    vehicleName: 'Fleet Unit Gamma',
    title: 'Suspension Bushing Inspection',
    description: 'Vibration analysis indicates possible bushing wear.',
    type: 'predictive',
    priority: 'high',
    status: 'overdue',
    predictedFailureDate: '2026-07-05',
    confidence: 81,
    estimatedCost: 340,
    estimatedDuration: 3,
    scheduledDate: '2026-07-01',
    component: 'Suspension',
    recommendations: ['Visual inspection', 'Replace worn bushings', 'Align wheels after repair'],
  },
];

export const mockPredictions: MaintenancePrediction[] = [
  {
    vehicleId: VEHICLE_ID,
    component: 'Battery Cooling Pump',
    remainingLife: 18,
    remainingLifeUnit: 'days',
    failureProbability: 0.78,
    recommendedAction: 'Schedule pump inspection and potential replacement within 2 weeks',
    urgency: 'high',
    lastInspected: '2026-05-12',
  },
  {
    vehicleId: VEHICLE_ID,
    component: 'Drive Inverter',
    remainingLife: 45,
    remainingLifeUnit: 'days',
    failureProbability: 0.42,
    recommendedAction: 'Monitor voltage ripple; schedule diagnostic at next service',
    urgency: 'medium',
    lastInspected: '2026-05-12',
  },
  {
    vehicleId: VEHICLE_ID,
    component: 'Front Brake Pads',
    remainingLife: 3200,
    remainingLifeUnit: 'km',
    failureProbability: 0.55,
    recommendedAction: 'Plan pad replacement within next 3,000 km',
    urgency: 'medium',
    lastInspected: '2026-06-01',
  },
  {
    vehicleId: VEHICLE_ID,
    component: '12V Auxiliary Battery',
    remainingLife: 90,
    remainingLifeUnit: 'days',
    failureProbability: 0.28,
    recommendedAction: 'Continue monitoring; replace at next major service',
    urgency: 'low',
    lastInspected: '2026-04-20',
  },
];

export const mockMaintenanceSummary: MaintenanceSummary = {
  total: 6,
  scheduled: 3,
  overdue: 1,
  inProgress: 1,
  predictive: 3,
  preventive: 2,
  estimatedMonthlyCost: 2625,
};

export function createAnalytics(vehicleId = VEHICLE_ID): AnalyticsData {
  return {
    vehicleId,
    period: '30d',
    healthTrend: generateSeries(90, 3, 30, 24 * 3600000),
    efficiencyScore: 88.5,
    downtimeHours: 12.4,
    maintenanceCost: 2480,
    fuelEfficiency: 4.2,
    alertsByCategory: [
      { category: 'Battery', count: 8 },
      { category: 'Electrical', count: 5 },
      { category: 'Brakes', count: 3 },
      { category: 'Cooling', count: 4 },
      { category: 'Tires', count: 2 },
      { category: 'System', count: 1 },
    ],
    maintenanceByType: [
      { type: 'Predictive', count: 12 },
      { type: 'Preventive', count: 18 },
      { type: 'Corrective', count: 5 },
    ],
    componentHealth: [
      { component: 'Battery', health: 94 },
      { component: 'Motor', health: 90 },
      { component: 'Brakes', health: 88 },
      { component: 'Tires', health: 85 },
      { component: 'Cooling', health: 91 },
      { component: 'Electrical', health: 96 },
      { component: 'Suspension', health: 87 },
    ],
    monthlyCosts: [
      { month: 'Feb', predictive: 420, preventive: 680, corrective: 210 },
      { month: 'Mar', predictive: 380, preventive: 720, corrective: 450 },
      { month: 'Apr', predictive: 510, preventive: 640, corrective: 180 },
      { month: 'May', predictive: 460, preventive: 700, corrective: 320 },
      { month: 'Jun', predictive: 390, preventive: 750, corrective: 150 },
      { month: 'Jul', predictive: 480, preventive: 690, corrective: 280 },
    ],
    utilizationRate: 84.2,
    mtbf: 420,
    mttr: 3.2,
  };
}

export const THRESHOLDS = {
  voltage: { warningMin: 360, warningMax: 430, criticalMin: 340, criticalMax: 450, unit: 'V' },
  current: { warningMax: 160, criticalMax: 180, unit: 'A' },
  temperature: { warningMax: 70, criticalMax: 85, unit: '°C' },
  batterySoc: { warningMin: 20, criticalMin: 10, unit: '%' },
  speed: { warningMax: 120, criticalMax: 140, unit: 'km/h' },
};
