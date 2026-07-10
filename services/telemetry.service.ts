import api from './api';
import type { TelemetryData, TelemetryHistory, ApiResponse } from '../types';
import {
  createLiveTelemetry,
  createTelemetryHistory,
  VEHICLE_ID,
} from '../utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms = 250) =>
  new Promise((r) => setTimeout(r, ms));


export const telemetryService = {

  async getTelemetry(
    vehicleId: string = VEHICLE_ID
  ): Promise<TelemetryData> {


    // Mock mode
    if (USE_MOCK) {

      await delay(150);

      return createLiveTelemetry(vehicleId);

    }


    // Real API mode
    const response = await api.get<any>(
      '/master/EV-001/latest'
    );


    const latest = response.data.latest;


    // Convert backend response -> frontend format
    const telemetry: TelemetryData = {

      vehicleId: latest.vehicle_id,

      voltage: Number(latest.voltage),

      current: Number(latest.current),

      temperature: Number(latest.battery_temp),

      batterySoc: Number(latest.soc),

      rpm: Number(latest.rpm),

      speed: Number(latest.speed),

      vibration: Number(latest.vibration),


      // Extra fields (if your type supports them)
      health: Number(latest.battery_health),

      healthStatus: latest.health_status,

      riskLevel: latest.risk_level,

      failureProbability: Number(
        latest.failure_probability
      ),

      faultCode: latest.fault_code,

    };


    return telemetry;

  },


  async getTelemetryHistory(
    vehicleId: string = VEHICLE_ID,
    range = '24h'
  ): Promise<TelemetryHistory> {


    if (USE_MOCK) {

      await delay(200);

      return createTelemetryHistory(vehicleId);

    }


    const { data } = await api.get<ApiResponse<TelemetryHistory>>(
      `/master/${vehicleId}/history?range=${range}`
    );


    return data.data;

  },


};