// import api from './api';
// import type { ChartSeries, ChartMetric, ChartRange, AnalyticsData, ApiResponse } from '../types';
// import { createChartSeries, createAnalytics, VEHICLE_ID } from '../utils/mockData';

// const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
// const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// export const chartService = {
//   async getVoltage(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
//     if (USE_MOCK) {
//       await delay();
//       return createChartSeries(vehicleId, 'voltage');
//     }
//     const { data } = await api.get<ApiResponse<ChartSeries>>(
//       `/chart/${vehicleId}/voltage`,
//       { params: { range } }
//     );
//     return data.data;
//   },

//   async getCurrent(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
//     if (USE_MOCK) {
//       await delay();
//       return createChartSeries(vehicleId, 'current');
//     }
//     const { data } = await api.get<ApiResponse<ChartSeries>>(
//       `/chart/${vehicleId}/current`,
//       { params: { range } }
//     );
//     return data.data;
//   },

//   async getTemperature(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
//     if (USE_MOCK) {
//       await delay();
//       return createChartSeries(vehicleId, 'temperature');
//     }
//     const { data } = await api.get<ApiResponse<ChartSeries>>(
//       `/chart/${vehicleId}/battery-temp`,
//       { params: { range } }
//     );
//     return data.data;
//   },

//   async getMetric(
//     vehicleId: string,
//     metric: ChartMetric,
//     range: ChartRange = '24h'
//   ): Promise<ChartSeries> {
//     if (USE_MOCK) {
//       await delay();
//       const allowed = ['voltage', 'current', 'temperature', 'speed', 'batterySoc'] as const;
//       const key = allowed.includes(metric as (typeof allowed)[number])
//         ? (metric as (typeof allowed)[number])
//         : 'voltage';
//       return createChartSeries(vehicleId, key);
//     }
//     const { data } = await api.get<ApiResponse<ChartSeries>>(
//       `/chart/${vehicleId}/${metric}`,
//       { params: { range } }
//     );
//     return data.data;
//   },

//   async getAnalytics(vehicleId: string = VEHICLE_ID, period = '30d'): Promise<AnalyticsData> {
//     if (USE_MOCK) {
//       await delay(500);
//       return createAnalytics(vehicleId);
//     }
//     const { data } = await api.get<ApiResponse<AnalyticsData>>(
//       `/analytics/${vehicleId}`,
//       { params: { period } }
//     );
//     return data.data;
//   },
// };

// export default chartService;
import api from './api';
import type { ChartSeries, ChartMetric, ChartRange, AnalyticsData } from '../types';
import { VEHICLE_ID } from '../utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const chartService = {
  async getVoltage(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
    if (USE_MOCK) {
      await delay();
      return { metric: 'voltage', name: 'Voltage', unit: 'V', color: '#3b82f6', data: [] };
    }
    const { data } = await api.get(`/chart/${vehicleId}/voltage`, { params: { range } });
    return {
      metric: 'voltage',
      name: 'Voltage',
      unit: 'V',
      color: '#3b82f6',
      data: data.voltageHistory.map((p: any) => ({ timestamp: p.timestamp, value: p.voltage })),
      avg: data.voltageHistory.reduce((a: number, b: any) => a + b.voltage, 0) / data.voltageHistory.length,
      min: Math.min(...data.voltageHistory.map((p: any) => p.voltage)),
      max: Math.max(...data.voltageHistory.map((p: any) => p.voltage))
    };
  },

  async getCurrent(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
    if (USE_MOCK) {
      await delay();
      return { metric: 'current', name: 'Current', unit: 'A', color: '#22c55e', data: [] };
    }
    const { data } = await api.get(`/chart/${vehicleId}/current`, { params: { range } });
    return {
      metric: 'current',
      name: 'Current',
      unit: 'A',
      color: '#22c55e',
      data: data.currentHistory.map((p: any) => ({ timestamp: p.timestamp, value: p.current })),
      avg: data.currentHistory.reduce((a: number, b: any) => a + b.current, 0) / data.currentHistory.length,
      min: Math.min(...data.currentHistory.map((p: any) => p.current)),
      max: Math.max(...data.currentHistory.map((p: any) => p.current))
    };
  },

  async getTemperature(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
    if (USE_MOCK) {
      await delay();
      return { metric: 'temperature', name: 'Battery Temp', unit: '°C', color: '#f59e0b', data: [] };
    }
    const { data } = await api.get(`/chart/${vehicleId}/battery-temp`, { params: { range } });
    return {
      metric: 'temperature',
      name: 'Battery Temp',
      unit: '°C',
      color: '#f59e0b',
      data: data.batteryTempHistory.map((p: any) => ({ timestamp: p.timestamp, value: p.battery_temp })),
      avg: data.batteryTempHistory.reduce((a: number, b: any) => a + b.battery_temp, 0) / data.batteryTempHistory.length,
      min: Math.min(...data.batteryTempHistory.map((p: any) => p.battery_temp)),
      max: Math.max(...data.batteryTempHistory.map((p: any) => p.battery_temp))
    };
  },

  async getSpeed(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
    const { data } = await api.get(`/chart/${vehicleId}/speed`, { params: { range } });
    return {
      metric: 'speed',
      name: 'Speed',
      unit: 'km/h',
      color: '#06b6d4',
      data: data.speedHistory.map((p: any) => ({ timestamp: p.timestamp, value: p.speed })),
      avg: data.speedHistory.reduce((a: number, b: any) => a + b.speed, 0) / data.speedHistory.length,
      min: Math.min(...data.speedHistory.map((p: any) => p.speed)),
      max: Math.max(...data.speedHistory.map((p: any) => p.speed))
    };
  },

  async getSoc(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
    const { data } = await api.get(`/chart/${vehicleId}/soc`, { params: { range } });
    return {
      metric: 'batterySoc',
      name: 'SOC',
      unit: '%',
      color: '#10b981',
      data: data.socHistory.map((p: any) => ({ timestamp: p.timestamp, value: p.soc })),
      avg: data.socHistory.reduce((a: number, b: any) => a + b.soc, 0) / data.socHistory.length,
      min: Math.min(...data.socHistory.map((p: any) => p.soc)),
      max: Math.max(...data.socHistory.map((p: any) => p.soc))
    };
  },

  async getRpm(vehicleId: string = VEHICLE_ID, range: ChartRange = '24h'): Promise<ChartSeries> {
    const { data } = await api.get(`/chart/${vehicleId}/rpm`, { params: { range } });
    return {
      metric: 'rpm',
      name: 'RPM',
      unit: 'rpm',
      color: '#ef4444',
      data: data.rpmHistory.map((p: any) => ({ timestamp: p.timestamp, value: p.rpm })),
      avg: data.rpmHistory.reduce((a: number, b: any) => a + b.rpm, 0) / data.rpmHistory.length,
      min: Math.min(...data.rpmHistory.map((p: any) => p.rpm)),
      max: Math.max(...data.rpmHistory.map((p: any) => p.rpm))
    };
  }
};

export default chartService;

