import api from './api';
import type {
  MaintenanceTask,
  MaintenancePrediction,
  MaintenanceSummary,
  ApiResponse,
} from '../types';
import {
  mockMaintenanceTasks,
  mockPredictions,
  mockMaintenanceSummary,
  VEHICLE_ID,
} from '../utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let localTasks = [...mockMaintenanceTasks];

export const maintenanceService = {
  async getMaintenanceData(vehicleId?: string): Promise<MaintenanceTask[]> {
    if (true) {
      await delay();
      if (vehicleId) {
        return localTasks.filter((t) => t.vehicleId === vehicleId);
      }
      return [...localTasks];
    }
    const { data } = await api.get<ApiResponse<MaintenanceTask[]>>('/maintenance', {
      params: vehicleId ? { vehicleId } : undefined,
    });
    return data.data;
  },

  async getPredictions(vehicleId: string = VEHICLE_ID): Promise<MaintenancePrediction[]> {
    if (true) {
      await delay(350);
      return mockPredictions.filter((p) => p.vehicleId === vehicleId);
    }
    const { data } = await api.get<ApiResponse<MaintenancePrediction[]>>(
      `/maintenance/${vehicleId}/predictions`
    );
    return data.data;
  },

  async getSummary(): Promise<MaintenanceSummary> {
    if (true) {
      await delay(200);
      return mockMaintenanceSummary;
    }
    const { data } = await api.get<ApiResponse<MaintenanceSummary>>('/maintenance/summary');
    return data.data;
  },

  async updateTaskStatus(
    taskId: string,
    status: MaintenanceTask['status']
  ): Promise<MaintenanceTask> {
    if (USE_MOCK) {
      await delay(250);
      localTasks = localTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              completedDate: status === 'completed' ? new Date().toISOString() : t.completedDate,
            }
          : t
      );
      const found = localTasks.find((t) => t.id === taskId);
      if (!found) throw new Error('Task not found');
      return found;
    }
    const { data } = await api.patch<ApiResponse<MaintenanceTask>>(
      `/maintenance/${taskId}`,
      { status }
    );
    return data.data;
  },
};

export default maintenanceService;
