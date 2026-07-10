import { combineReducers } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import telemetryReducer from './slices/telemetrySlice';
import chartReducer from './slices/chartSlice';
import alertReducer from './slices/alertSlice';
import maintenanceReducer from './slices/maintenanceSlice';

const rootReducer = combineReducers({
  vehicle: vehicleReducer,
  telemetry: telemetryReducer,
  chart: chartReducer,
  alert: alertReducer,
  maintenance: maintenanceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
