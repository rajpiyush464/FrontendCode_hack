import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Vehicle, VehicleHealth, VehicleStats, LoadingState } from '../../types';
import { VEHICLE_ID } from '../../utils/mockData';

interface VehicleState {
  selectedVehicleId: string;
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  health: VehicleHealth | null;
  stats: VehicleStats | null;
  status: LoadingState;
  error: string | null;
}

const initialState: VehicleState = {
  selectedVehicleId: VEHICLE_ID,
  vehicles: [],
  currentVehicle: null,
  health: null,
  stats: null,
  status: 'idle',
  error: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    fetchVehiclesRequest(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchVehiclesSuccess(state, action: PayloadAction<Vehicle[]>) {
      state.status = 'succeeded';
      state.vehicles = action.payload;
    },
    fetchVehiclesFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchVehicleRequest(state, action: PayloadAction<string>) {
      state.status = 'loading';
      state.selectedVehicleId = action.payload;
      state.error = null;
    },
    fetchVehicleSuccess(state, action: PayloadAction<Vehicle>) {
      state.status = 'succeeded';
      state.currentVehicle = action.payload;
    },
    fetchVehicleFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchHealthRequest(state, _action: PayloadAction<string>) {
      state.error = null;
    },
    fetchHealthSuccess(state, action: PayloadAction<VehicleHealth>) {
      state.health = action.payload;
    },
    fetchHealthFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    fetchStatsRequest(state) {
      state.error = null;
    },
    fetchStatsSuccess(state, action: PayloadAction<VehicleStats>) {
      state.stats = action.payload;
    },
    fetchStatsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setSelectedVehicle(state, action: PayloadAction<string>) {
      state.selectedVehicleId = action.payload;
    },
  },
});

export const vehicleActions = vehicleSlice.actions;
export default vehicleSlice.reducer;
