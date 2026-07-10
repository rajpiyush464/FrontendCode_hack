import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Alert, LoadingState } from '../../types';

interface AlertState {
  alerts: Alert[];
  status: LoadingState;
  error: string | null;
  soundEnabled: boolean;
  volume: number;
  lastBeepAt: number | null;
  unreadCritical: number;
}

const initialState: AlertState = {
  alerts: [],
  status: 'idle',
  error: null,
  soundEnabled: true,
  volume: 70,
  lastBeepAt: null,
  unreadCritical: 0,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    fetchAlertsRequest(state, _action: PayloadAction<string | undefined>) {
      state.status = 'loading';
      state.error = null;
    },
    fetchAlertsSuccess(state, action: PayloadAction<Alert[]>) {
      state.status = 'succeeded';
      state.alerts = action.payload;
      state.unreadCritical = action.payload.filter(
        (a) => a.status === 'active' && a.severity === 'critical'
      ).length;
    },
    fetchAlertsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    acknowledgeAlertRequest(state, _action: PayloadAction<string>) {
      state.error = null;
    },
    acknowledgeAlertSuccess(state, action: PayloadAction<Alert>) {
      state.alerts = state.alerts.map((a) =>
        a.id === action.payload.id ? action.payload : a
      );
      state.unreadCritical = state.alerts.filter(
        (a) => a.status === 'active' && a.severity === 'critical'
      ).length;
    },
    acknowledgeAlertFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    resolveAlertRequest(state, _action: PayloadAction<string>) {
      state.error = null;
    },
    resolveAlertSuccess(state, action: PayloadAction<Alert>) {
      state.alerts = state.alerts.map((a) =>
        a.id === action.payload.id ? action.payload : a
      );
      state.unreadCritical = state.alerts.filter(
        (a) => a.status === 'active' && a.severity === 'critical'
      ).length;
    },
    resolveAlertFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    pushAlert(state, action: PayloadAction<Alert>) {
      const exists = state.alerts.some((a) => a.id === action.payload.id);
      if (!exists) {
        state.alerts = [action.payload, ...state.alerts];
        if (action.payload.severity === 'critical' && action.payload.status === 'active') {
          state.unreadCritical += 1;
          state.lastBeepAt = Date.now();
        } else if (action.payload.severity === 'warning' && action.payload.status === 'active') {
          state.lastBeepAt = Date.now();
        }
      }
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
    },
    setSoundEnabled(state, action: PayloadAction<boolean>) {
      state.soundEnabled = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(100, action.payload));
      if (state.volume === 0) state.soundEnabled = false;
    },
    resolveAllAlertsRequest(state) {
      state.status = 'loading';
    },
    resolveAllAlertsSuccess(state) {
      state.alerts = state.alerts.map((a) =>
        a.status === 'active'
          ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toISOString() }
          : a
      );
      state.unreadCritical = 0;
      state.status = 'succeeded';
    },
    resolveAllAlertsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearLastBeep(state) {
      state.lastBeepAt = null;
    },
  },
});

export const alertActions = alertSlice.actions;
export default alertSlice.reducer;
