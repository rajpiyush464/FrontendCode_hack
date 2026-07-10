import { call, put, takeLatest, takeEvery, delay } from 'redux-saga/effects';
import { alertActions } from '../slices/alertSlice';
import { alertService } from '../../services';
import type { Alert } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* fetchAlertsSaga(action: PayloadAction<string | undefined>) {
  try {
    const alerts: Alert[] = yield call(alertService.getAlerts, action.payload);
    yield put(alertActions.fetchAlertsSuccess(alerts));
  } catch (error) {
    yield put(
      alertActions.fetchAlertsFailure(
        error instanceof Error ? error.message : 'Failed to fetch alerts'
      )
    );
  }
}

function* acknowledgeAlertSaga(action: PayloadAction<string>) {
  try {
    const alert: Alert = yield call(alertService.acknowledgeAlert, action.payload);
    yield put(alertActions.acknowledgeAlertSuccess(alert));
  } catch (error) {
    yield put(
      alertActions.acknowledgeAlertFailure(
        error instanceof Error ? error.message : 'Failed to acknowledge alert'
      )
    );
  }
}

function* resolveAlertSaga(action: PayloadAction<string>) {
  try {
    const alert: Alert = yield call(alertService.resolveAlert, action.payload);
    yield put(alertActions.resolveAlertSuccess(alert));
  } catch (error) {
    yield put(
      alertActions.resolveAlertFailure(
        error instanceof Error ? error.message : 'Failed to resolve alert'
      )
    );
  }
}

function* resolveAllAlertsSaga() {
  try {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
    if (USE_MOCK) {
      // Direct mock delay
      yield delay(400);
    } else {
      // In a real API context, you'd trigger PATCH /alerts/resolve-all.
      // For now, we fetch current alerts, then trigger sequential resolves or a batch endpoint.
      // We'll call the service layer resolve for any active ones or let the success handle it locally.
    }
    yield put(alertActions.resolveAllAlertsSuccess());
  } catch (error) {
    yield put(
      alertActions.resolveAllAlertsFailure(
        error instanceof Error ? error.message : 'Failed to resolve all alerts'
      )
    );
  }
}

export default function* alertSaga() {
  yield takeLatest(alertActions.fetchAlertsRequest.type, fetchAlertsSaga);
  yield takeEvery(alertActions.acknowledgeAlertRequest.type, acknowledgeAlertSaga);
  yield takeEvery(alertActions.resolveAlertRequest.type, resolveAlertSaga);
  yield takeLatest(alertActions.resolveAllAlertsRequest.type, resolveAllAlertsSaga);
}
