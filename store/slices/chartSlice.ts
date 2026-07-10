import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChartSeries, ChartMetric, ChartRange, AnalyticsData, LoadingState } from '../../types';

interface ChartState {
  voltage: ChartSeries | null;
  current: ChartSeries | null;
  temperature: ChartSeries | null;
  series: Record<string, ChartSeries>;
  analytics: AnalyticsData | null;
  range: ChartRange;
  expandedChart: ChartMetric | null;
  status: LoadingState;
  analyticsStatus: LoadingState;
  error: string | null;
}

const initialState: ChartState = {
  voltage: null,
  current: null,
  temperature: null,
  series: {},
  analytics: null,
  range: '24h',
  expandedChart: null,
  status: 'idle',
  analyticsStatus: 'idle',
  error: null,
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    fetchVoltageRequest(state, _action: PayloadAction<{ vehicleId: string; range?: ChartRange }>) {
      state.status = 'loading';
      state.error = null;
    },
    fetchVoltageSuccess(state, action: PayloadAction<ChartSeries>) {
      state.status = 'succeeded';
      state.voltage = action.payload;
      state.series.voltage = action.payload;
    },
    fetchVoltageFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchCurrentRequest(state, _action: PayloadAction<{ vehicleId: string; range?: ChartRange }>) {
      state.error = null;
    },
    fetchCurrentSuccess(state, action: PayloadAction<ChartSeries>) {
      state.current = action.payload;
      state.series.current = action.payload;
    },
    fetchCurrentFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    fetchTemperatureRequest(
      state,
      _action: PayloadAction<{ vehicleId: string; range?: ChartRange }>
    ) {
      state.error = null;
    },
    fetchTemperatureSuccess(state, action: PayloadAction<ChartSeries>) {
      state.temperature = action.payload;
      state.series.temperature = action.payload;
    },
    fetchTemperatureFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    fetchAllChartsRequest(
      state,
      _action: PayloadAction<{ vehicleId: string; range?: ChartRange }>
    ) {
      state.status = 'loading';
      state.error = null;
    },
    fetchAllChartsSuccess(
      state,
      action: PayloadAction<{ voltage: ChartSeries; current: ChartSeries; temperature: ChartSeries }>
    ) {
      state.status = 'succeeded';
      state.voltage = action.payload.voltage;
      state.current = action.payload.current;
      state.temperature = action.payload.temperature;
      state.series.voltage = action.payload.voltage;
      state.series.current = action.payload.current;
      state.series.temperature = action.payload.temperature;
    },
    fetchAllChartsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchAnalyticsRequest(state, _action: PayloadAction<{ vehicleId: string; period?: string }>) {
      state.analyticsStatus = 'loading';
    },
    fetchAnalyticsSuccess(state, action: PayloadAction<AnalyticsData>) {
      state.analyticsStatus = 'succeeded';
      state.analytics = action.payload;
    },
    fetchAnalyticsFailure(state, action: PayloadAction<string>) {
      state.analyticsStatus = 'failed';
      state.error = action.payload;
    },
    setChartRange(state, action: PayloadAction<ChartRange>) {
      state.range = action.payload;
    },
    setExpandedChart(state, action: PayloadAction<ChartMetric | null>) {
      state.expandedChart = action.payload;
    },
  },
});

export const chartActions = chartSlice.actions;
export default chartSlice.reducer;
