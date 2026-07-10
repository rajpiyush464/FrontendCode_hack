export type MaintenanceType = 'predictive' | 'preventive' | 'corrective';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  vehicleName?: string;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  predictedFailureDate?: string;
  confidence?: number;
  estimatedCost: number;
  estimatedDuration: number;
  scheduledDate: string;
  completedDate?: string;
  component: string;
  recommendations: string[];
  assignedTo?: string;
}

export interface MaintenancePrediction {
  vehicleId: string;
  component: string;
  remainingLife: number;
  remainingLifeUnit: 'days' | 'hours' | 'km' | 'miles';
  failureProbability: number;
  recommendedAction: string;
  urgency: MaintenancePriority;
  lastInspected: string;
}

export interface MaintenanceSummary {
  total: number;
  scheduled: number;
  overdue: number;
  inProgress: number;
  predictive: number;
  preventive: number;
  estimatedMonthlyCost: number;
}
