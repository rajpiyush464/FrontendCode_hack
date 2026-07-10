import { call, put, takeLatest } from 'redux-saga/effects';
import { vehicleActions } from '../slices/vehicleSlice';
import { vehicleService } from '../../services';
import type { Vehicle, VehicleHealth, VehicleStats } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* fetchVehiclesSaga() {
  try {
    const vehicles: Vehicle[] = yield call(vehicleService.getVehicles);
    yield put(vehicleActions.fetchVehiclesSuccess(vehicles));
  } catch (error) {
    yield put(
      vehicleActions.fetchVehiclesFailure(
        error instanceof Error ? error.message : 'Failed to fetch vehicles'
      )
    );
  }
}

function* fetchVehicleSaga(action: PayloadAction<string>) {
  try {
    const vehicle: Vehicle = yield call(vehicleService.getVehicle, action.payload);
    yield put(vehicleActions.fetchVehicleSuccess(vehicle));
  } catch (error) {
    yield put(
      vehicleActions.fetchVehicleFailure(
        error instanceof Error ? error.message : 'Failed to fetch vehicle'
      )
    );
  }
}

function* fetchHealthSaga(action: PayloadAction<string>) {
  try {
    const health: VehicleHealth = yield call(vehicleService.getVehicleHealth, action.payload);
    yield put(vehicleActions.fetchHealthSuccess(health));
  } catch (error) {
    yield put(
      vehicleActions.fetchHealthFailure(
        error instanceof Error ? error.message : 'Failed to fetch health'
      )
    );
  }
}

function* fetchStatsSaga() {
  try {
    const stats: VehicleStats = yield call(vehicleService.getVehicleStats);
    yield put(vehicleActions.fetchStatsSuccess(stats));
  } catch (error) {
    yield put(
      vehicleActions.fetchStatsFailure(
        error instanceof Error ? error.message : 'Failed to fetch stats'
      )
    );
  }
}

export default function* vehicleSaga() {
  yield takeLatest(vehicleActions.fetchVehiclesRequest.type, fetchVehiclesSaga);
  yield takeLatest(vehicleActions.fetchVehicleRequest.type, fetchVehicleSaga);
  yield takeLatest(vehicleActions.fetchHealthRequest.type, fetchHealthSaga);
  yield takeLatest(vehicleActions.fetchStatsRequest.type, fetchStatsSaga);
}
