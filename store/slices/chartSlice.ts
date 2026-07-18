import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  ChartSeries,
  ChartMetric,
  ChartRange,
  AnalyticsData,
  LoadingState,
} from '../../types';

// Redux state shape for charts
interface ChartState {
  voltage: ChartSeries | null;
  current: ChartSeries | null;
  temperature: ChartSeries | null;
  series: Record<string, ChartSeries>; // keyed by metric name
  analytics: AnalyticsData | null;
  range: ChartRange;
  expandedChart: ChartMetric | null;
  status: LoadingState;
  analyticsStatus: LoadingState;
  error: string | null;
}

// Initial state
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
    // --- API fetch reducers (history) ---
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
      action: PayloadAction<{
        voltage: ChartSeries;
        current: ChartSeries;
        temperature: ChartSeries;
      }>
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

    // --- UPDATED reducer for rapid continuous ventilator streaming ---
    addTelemetryPoint(
      state,
      action: PayloadAction<{ metric: ChartMetric; point: { timestamp: string; value: number } }>
    ) {
      const { metric, point } = action.payload;

      // Initialize series structure if it does not exist yet
      if (!state.series[metric]) {
        state.series[metric] = {
          metric,
          name: metric,
          unit:
            metric === 'voltage'
              ? 'V'
              : metric === 'temperature'
              ? '°C'
              : metric === 'current'
              ? 'A'
              : '',
          color:
            metric === 'voltage'
              ? '#06b6d4'
              : metric === 'temperature'
              ? '#facc15'
              : '#f43f5e',
          data: [],
          avg: 0,
          min: 0,
          max: 0,
        };
      }

      // 🌊 THE VENTILATOR EFFECT: Change historical tracking array limit from 100 down to 25.
      // Pushing to the end and taking the last 25 creates a fast, dynamic rolling horizon.
      state.series[metric].data = [...state.series[metric].data, point].slice(-25);

      // Recalculate runtime aggregates cleanly
      const values = state.series[metric].data.map((d) => d.value);
      if (values.length > 0) {
        const structuralSum = values.reduce((a, b) => a + b, 0);
        // Round to one decimal point to keep the top dashboard numbers readable and static
        state.series[metric].avg = Math.round((structuralSum / values.length) * 10) / 10;
        state.series[metric].min = Math.round(Math.min(...values) * 10) / 10;
        state.series[metric].max = Math.round(Math.max(...values) * 10) / 10;
      }

      // Synchronize changes to top-level metric pointers instantly
      if (metric === 'voltage') state.voltage = state.series[metric];
      if (metric === 'current') state.current = state.series[metric];
      if (metric === 'temperature') state.temperature = state.series[metric];
    },
  },
});

export const chartActions = chartSlice.actions;
export default chartSlice.reducer;