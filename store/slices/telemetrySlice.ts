import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TelemetryData, TelemetryHistory, LoadingState } from '../../types';

interface TelemetryState {
  live: TelemetryData | null;
  history: TelemetryHistory | null;
  status: LoadingState;
  historyStatus: LoadingState;
  error: string | null;
  isPolling: boolean;
}

const initialState: TelemetryState = {
  live: null,
  history: null,
  status: 'idle',
  historyStatus: 'idle',
  error: null,
  isPolling: false,
};

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    fetchTelemetryRequest(state, _action: PayloadAction<string>) {
      if (state.status === 'idle') state.status = 'loading';
      state.error = null;
    },
    fetchTelemetrySuccess(state, action: PayloadAction<TelemetryData>) {
      state.status = 'succeeded';
      state.live = action.payload;
    },
    fetchTelemetryFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchHistoryRequest(state, _action: PayloadAction<{ vehicleId: string; range?: string }>) {
      state.historyStatus = 'loading';
    },
    fetchHistorySuccess(state, action: PayloadAction<TelemetryHistory>) {
      state.historyStatus = 'succeeded';
      state.history = action.payload;
    },
    fetchHistoryFailure(state, action: PayloadAction<string>) {
      state.historyStatus = 'failed';
      state.error = action.payload;
    },
    startPolling(state, _action: PayloadAction<string>) {
      state.isPolling = true;
    },
    stopPolling(state) {
      state.isPolling = false;
    },
  },
});

export const telemetryActions = telemetrySlice.actions;
export default telemetrySlice.reducer;
