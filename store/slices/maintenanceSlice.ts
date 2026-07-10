import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  MaintenanceTask,
  MaintenancePrediction,
  MaintenanceSummary,
  LoadingState,
} from '../../types';

interface MaintenanceState {
  tasks: MaintenanceTask[];
  predictions: MaintenancePrediction[];
  summary: MaintenanceSummary | null;
  filter: 'all' | 'predictive' | 'preventive' | 'corrective';
  status: LoadingState;
  error: string | null;
}

const initialState: MaintenanceState = {
  tasks: [],
  predictions: [],
  summary: null,
  filter: 'all',
  status: 'idle',
  error: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    fetchMaintenanceRequest(state, _action: PayloadAction<string | undefined>) {
      state.status = 'loading';
      state.error = null;
    },
    fetchMaintenanceSuccess(state, action: PayloadAction<MaintenanceTask[]>) {
      state.status = 'succeeded';
      state.tasks = action.payload;
    },
    fetchMaintenanceFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchPredictionsRequest(state, _action: PayloadAction<string>) {
      state.error = null;
    },
    fetchPredictionsSuccess(state, action: PayloadAction<MaintenancePrediction[]>) {
      state.predictions = action.payload;
    },
    fetchPredictionsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    fetchSummaryRequest(state) {
      state.error = null;
    },
    fetchSummarySuccess(state, action: PayloadAction<MaintenanceSummary>) {
      state.summary = action.payload;
    },
    fetchSummaryFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateTaskStatusRequest(
      state,
      _action: PayloadAction<{ taskId: string; status: MaintenanceTask['status'] }>
    ) {
      state.error = null;
    },
    updateTaskStatusSuccess(state, action: PayloadAction<MaintenanceTask>) {
      state.tasks = state.tasks.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
    },
    updateTaskStatusFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setFilter(state, action: PayloadAction<MaintenanceState['filter']>) {
      state.filter = action.payload;
    },
  },
});

export const maintenanceActions = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
