import { call, put, takeLatest } from 'redux-saga/effects';
import { maintenanceActions } from '../slices/maintenanceSlice';
import { maintenanceService } from '../../services';
import type { MaintenanceTask, MaintenancePrediction, MaintenanceSummary } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* fetchMaintenanceSaga(action: PayloadAction<string | undefined>) {
  try {
    const tasks: MaintenanceTask[] = yield call(
      maintenanceService.getMaintenanceData,
      action.payload
    );
    yield put(maintenanceActions.fetchMaintenanceSuccess(tasks));
  } catch (error) {
    yield put(
      maintenanceActions.fetchMaintenanceFailure(
        error instanceof Error ? error.message : 'Failed to fetch maintenance data'
      )
    );
  }
}

function* fetchPredictionsSaga(action: PayloadAction<string>) {
  try {
    const predictions: MaintenancePrediction[] = yield call(
      maintenanceService.getPredictions,
      action.payload
    );
    yield put(maintenanceActions.fetchPredictionsSuccess(predictions));
  } catch (error) {
    yield put(
      maintenanceActions.fetchPredictionsFailure(
        error instanceof Error ? error.message : 'Failed to fetch predictions'
      )
    );
  }
}

function* fetchSummarySaga() {
  try {
    const summary: MaintenanceSummary = yield call(maintenanceService.getSummary);
    yield put(maintenanceActions.fetchSummarySuccess(summary));
  } catch (error) {
    yield put(
      maintenanceActions.fetchSummaryFailure(
        error instanceof Error ? error.message : 'Failed to fetch summary'
      )
    );
  }
}

function* updateTaskStatusSaga(
  action: PayloadAction<{ taskId: string; status: MaintenanceTask['status'] }>
) {
  try {
    const task: MaintenanceTask = yield call(
      maintenanceService.updateTaskStatus,
      action.payload.taskId,
      action.payload.status
    );
    yield put(maintenanceActions.updateTaskStatusSuccess(task));
  } catch (error) {
    yield put(
      maintenanceActions.updateTaskStatusFailure(
        error instanceof Error ? error.message : 'Failed to update task'
      )
    );
  }
}

export default function* maintenanceSaga() {
  yield takeLatest(maintenanceActions.fetchMaintenanceRequest.type, fetchMaintenanceSaga);
  yield takeLatest(maintenanceActions.fetchPredictionsRequest.type, fetchPredictionsSaga);
  yield takeLatest(maintenanceActions.fetchSummaryRequest.type, fetchSummarySaga);
  yield takeLatest(maintenanceActions.updateTaskStatusRequest.type, updateTaskStatusSaga);
}
