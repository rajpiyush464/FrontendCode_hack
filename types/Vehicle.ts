export interface Vehicle {
  id: string;
  name: string;
  model: string;
  make: string;
  year: number;
  vin: string;
  licensePlate: string;
  battery: number;
  health: number;
  mileage: number;
  status: 'active' | 'idle' | 'maintenance' | 'critical';
  lastService: string;
  nextService: string;
  fuelType: 'electric' | 'hybrid' | 'gasoline' | 'diesel';
  location: string;
  driver?: string;
  imageUrl?: string;
}

export interface VehicleHealth {
  vehicleId: string;
  overall: number;
  battery: number;
  engine: number;
  brakes: number;
  tires: number;
  cooling: number;
  electrical: number;
  transmission: number;
  lastUpdated: string;
}

export interface VehicleStats {
  totalVehicles: number;
  activeVehicles: number;
  criticalAlerts: number;
  pendingMaintenance: number;
  avgHealth: number;
  uptime: number;
}
export interface RCAData {
  executiveSummary: string;
  rootCause: string;
  incidentTimeline: string[];
  supportingEvidence: string[];
  atRiskComponent: string;
  failureType: string;
  severity: string;
  confidence: string;
  recommendedMaintenance: string;
  preventiveActions: string[];
}