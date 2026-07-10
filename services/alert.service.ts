// import api from './api';
// import type { Alert, ApiResponse } from '../types';
// import { createMockAlerts, VEHICLE_ID } from '../utils/mockData';

// const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
// const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// let localAlerts: Alert[] = createMockAlerts();

// export const alertService = {
//   async getAlerts(vehicleId?: string): Promise<Alert[]> {
//     if (USE_MOCK) {
//       await delay();
//       if (vehicleId) {
//         return localAlerts.filter((a) => a.vehicleId === vehicleId);
//       }
//       return [...localAlerts];
//     }
//     const { data } = await api.get<ApiResponse<Alert[]>>('/alerts', {
//       params: vehicleId ? { vehicleId } : undefined,
//     });
//     return data.data;
//   },

//   async acknowledgeAlert(alertId: string): Promise<Alert> {
//     if (USE_MOCK) {
//       await delay(200);
//       localAlerts = localAlerts.map((a) =>
//         a.id === alertId
//           ? { ...a, status: 'acknowledged' as const, acknowledgedAt: new Date().toISOString() }
//           : a
//       );
//       const found = localAlerts.find((a) => a.id === alertId);
//       if (!found) throw new Error('Alert not found');
//       return found;
//     }
//     const { data } = await api.patch<ApiResponse<Alert>>(`/alerts/${alertId}/acknowledge`);
//     return data.data;
//   },

//   async resolveAlert(alertId: string): Promise<Alert> {
//     if (USE_MOCK) {
//       await delay(200);
//       localAlerts = localAlerts.map((a) =>
//         a.id === alertId
//           ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toISOString() }
//           : a
//       );
//       const found = localAlerts.find((a) => a.id === alertId);
//       if (!found) throw new Error('Alert not found');
//       return found;
//     }
//     const { data } = await api.patch<ApiResponse<Alert>>(`/alerts/${alertId}/resolve`);
//     return data.data;
//   },

//   async addAlert(alert: Alert): Promise<Alert> {
//     if (USE_MOCK) {
//       localAlerts = [alert, ...localAlerts];
//       return alert;
//     }
//     const { data } = await api.post<ApiResponse<Alert>>('/alerts', alert);
//     return data.data;
//   },

//   async getActiveCount(vehicleId: string = VEHICLE_ID): Promise<number> {
//     const alerts = await this.getAlerts(vehicleId);
//     return alerts.filter((a) => a.status === 'active').length;
//   },
// };

// export default alertService;



import api from './api';
import type { Alert, ApiResponse } from '../types';
import { createMockAlerts, VEHICLE_ID } from '../utils/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let localAlerts: Alert[] = createMockAlerts();

export const alertService = {
  async getAlerts(vehicleId: string = VEHICLE_ID): Promise<Alert[]> {
    if (USE_MOCK) {
      await delay();
      return localAlerts.filter((a) => a.vehicleId === vehicleId);
    }
    // 🔑 Updated endpoint to match backend
    const { data } = await api.get<ApiResponse<Alert[]>>(
      `/vehiclealert/${vehicleId}/alerts`
    );
    return data.data;
  },

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    if (USE_MOCK) {
      await delay(200);
      localAlerts = localAlerts.map((a) =>
        a.id === alertId
          ? { ...a, status: 'acknowledged' as const, acknowledgedAt: new Date().toISOString() }
          : a
      );
      const found = localAlerts.find((a) => a.id === alertId);
      if (!found) throw new Error('Alert not found');
      return found;
    }
    const { data } = await api.patch<ApiResponse<Alert>>(
      `/vehiclealert/${alertId}/acknowledge`
    );
    return data.data;
  },

  async resolveAlert(alertId: string): Promise<Alert> {
    if (USE_MOCK) {
      await delay(200);
      localAlerts = localAlerts.map((a) =>
        a.id === alertId
          ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toISOString() }
          : a
      );
      const found = localAlerts.find((a) => a.id === alertId);
      if (!found) throw new Error('Alert not found');
      return found;
    }
    const { data } = await api.patch<ApiResponse<Alert>>(
      `/vehiclealert/${alertId}/resolve`
    );
    return data.data;
  },

  async addAlert(alert: Alert): Promise<Alert> {
    if (USE_MOCK) {
      localAlerts = [alert, ...localAlerts];
      return alert;
    }
    const { data } = await api.post<ApiResponse<Alert>>(
      `/vehiclealert/add`,
      alert
    );
    return data.data;
  },

  async getActiveCount(vehicleId: string = VEHICLE_ID): Promise<number> {
    const alerts = await this.getAlerts(vehicleId);
    return alerts.filter((a) => a.status === 'active').length;
  },
};

export default alertService;
