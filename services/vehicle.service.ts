import api from './api';
import type { Vehicle, VehicleHealth, VehicleStats, RCAData } from '../types';
import {
  mockVehicle,
  mockVehicles,
  mockHealth,
  mockStats,
  VEHICLE_ID,
} from '../utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Helper: merge backend response with mock defaults
function mergeWithMock<T extends object>(backend: Partial<T> | undefined, mock: T): T {
  return { ...mock, ...(backend || {}) };
}

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    if (USE_MOCK) {
      await delay();
      return mockVehicles;
    }
    const { data } = await api.get('/vehicle/all/list');
    return (data.vehicles || []).map((v: Partial<Vehicle>) => mergeWithMock(v, mockVehicle));
  },

  async getVehicle(id: string = VEHICLE_ID): Promise<Vehicle> {
    if (USE_MOCK) {
      await delay();
      return mockVehicles.find((v) => v.vin === id) || mockVehicle;
    }
    const { data } = await api.get(`/vehicle/${id}`);
    const backend = data.vehicle;

    return {
      vin: backend.vehicle_id || mockVehicle.vin,
      name: backend.vehicle_id || mockVehicle.name,
      make: backend.firmware_version || mockVehicle.make,
      model: backend.failure_label || mockVehicle.model,
      year: backend.year_of_manufacture || mockVehicle.year,
      status: backend.health_status || mockVehicle.status,

      // ✅ Vehicle health = 100 - failure_probability
      health: backend.failure_probability
        ? 100 - Number(backend.failure_probability)
        : mockVehicle.health,

      // ✅ Battery charge from SOC
      battery: backend.soc ?? mockVehicle.battery,

      // ✅ Battery health from backend
      batteryHealth: backend.battery_health
        ? Number(backend.battery_health)
        : mockVehicle.batteryHealth,

      mileage: backend.odometer ?? mockVehicle.mileage,
      location:
        backend.gps_lat && backend.gps_lon
          ? `${backend.gps_lat}, ${backend.gps_lon}`
          : mockVehicle.location,
      fuelType: 'Electric',
      driver: backend.driver || mockVehicle.driver,
      lastService: backend.maintenance_history || mockVehicle.lastService,
      nextService: mockVehicle.nextService,
      imageUrl: mockVehicle.imageUrl,
    };
  },

  async getVehicleHealth(id: string = VEHICLE_ID): Promise<VehicleHealth> {
    if (USE_MOCK) {
      await delay(300);
      return { ...mockHealth, vehicleId: id, lastUpdated: new Date().toISOString() };
    }
    const { data } = await api.get(`/vehicle/${id}`);
    const backend = data.vehicle;

    return {
      vehicleId: backend.vehicle_id || mockHealth.vehicleId,
      battery: Number(backend.battery_health) || mockHealth.battery,
      engine: backend.motor_temp ?? mockHealth.engine,
      brakes: backend.brake_condition ?? mockHealth.brakes,
      tires: backend.tire_pressure ?? mockHealth.tires,
      cooling: backend.coolant_temp ?? mockHealth.cooling,
      electrical: backend.diagnostic_trouble_code_count ?? mockHealth.electrical,
      lastUpdated: backend.timestamp || new Date().toISOString(),
    };
  },

  async getVehicleStats(): Promise<VehicleStats> {
    if (USE_MOCK) {
      await delay(200);
      return mockStats;
    }
    const { data } = await api.get('/vehicle/stats');
    return mergeWithMock(data.stats, mockStats);
  },

  async getVehicleRCA(vehicleId: string = VEHICLE_ID): Promise<RCAData | null> {
  if (USE_MOCK) {
    await delay(200);
    return {
      executiveSummary:
        "Vehicle EV-001 is flagged with a critical health status and a high probability of failure, indicating an imminent issue.",
      rootCause:
        "The ML model predicts a high probability of failure (93.57%) with critical health status.",
      incidentTimeline: [
        "ML model predicts 93.57% failure probability with critical health status.",
        "Rule engine analysis identifies 'No Major Issue' and recommends continued monitoring.",
        "Telemetry data shows 2 detected anomalies and 1 diagnostic trouble code.",
      ],
      supportingEvidence: [
        "ML Predicted Failure Probability: 93.57%",
        "ML Health Status: Critical",
        "Detected Anomalies: 2",
        "Diagnostic Trouble Codes: 1",
        "Failure History: 1",
      ],
      atRiskComponent: "General Vehicle",
      failureType: "Predicted failure",
      severity: "Critical",
      confidence: "High",
      recommendedMaintenance:
        "Perform a comprehensive diagnostic scan to identify the cause of anomalies and DTCs.",
      preventiveActions: [
        "Implement enhanced real-time anomaly detection algorithms.",
        "Regularly update ML models with new telemetry data.",
        "Establish a proactive diagnostic schedule.",
      ],
    };
  }

  // ✅ Live API call
  const { data } = await api.get(`/vehicle/${vehicleId}`);
  const backend = data.vehicle;

  // Normalize fields to arrays
  const toArray = (val: any): string[] =>
    Array.isArray(val) ? val : val ? [String(val)] : [];

  return {
    executiveSummary: backend.rca_executive_summary || "",
    rootCause: backend.rca_root_cause || "",
    incidentTimeline: toArray(backend.rca_incident_timeline),
    supportingEvidence: toArray(backend.rca_supporting_evidence),
    atRiskComponent: backend.rca_at_risk_component || "General Vehicle",
    failureType: backend.rca_failure_type || "Unknown",
    severity: backend.rca_severity || "Unknown",
    confidence: backend.rca_confidence || "Low",
    recommendedMaintenance: backend.rca_recommended_maintenance || "",
    preventiveActions: toArray(backend.rca_preventive_actions),
  };
}
}

export default vehicleService;
