import { call, put, takeLatest, take, race, delay, select } from 'redux-saga/effects';
import { telemetryActions } from '../slices/telemetrySlice';
import { alertActions } from '../slices/alertSlice';
import { telemetryService } from '../../services';
import type { TelemetryData, TelemetryHistory, Alert } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { generateThresholdAlert, THRESHOLDS } from '../../utils/mockData';
import type { RootState } from '../rootReducer';

function checkThresholds(telemetry: TelemetryData) {
  const alerts = [];
  const { voltage, current, temperature, batterySoc } = telemetry;

  if (voltage <= (THRESHOLDS.voltage.criticalMin || 340)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'voltage',
        voltage,
        THRESHOLDS.voltage.criticalMin || 340,
        'critical',
        'V'
      )
    );
  } else if (voltage <= (THRESHOLDS.voltage.warningMin || 360)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'voltage',
        voltage,
        THRESHOLDS.voltage.warningMin || 360,
        'warning',
        'V'
      )
    );
  }

  if (current >= (THRESHOLDS.current.criticalMax || 180)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'current',
        current,
        THRESHOLDS.current.criticalMax || 180,
        'critical',
        'A'
      )
    );
  } else if (current >= (THRESHOLDS.current.warningMax || 160)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'current',
        current,
        THRESHOLDS.current.warningMax || 160,
        'warning',
        'A'
      )
    );
  }

  if (temperature >= (THRESHOLDS.temperature.criticalMax || 85)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'temperature',
        temperature,
        THRESHOLDS.temperature.criticalMax || 85,
        'critical',
        '°C'
      )
    );
  } else if (temperature >= (THRESHOLDS.temperature.warningMax || 70)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'temperature',
        temperature,
        THRESHOLDS.temperature.warningMax || 70,
        'warning',
        '°C'
      )
    );
  }

  if (batterySoc <= (THRESHOLDS.batterySoc.criticalMin || 10)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'batterySoc',
        batterySoc,
        THRESHOLDS.batterySoc.criticalMin || 10,
        'critical',
        '%'
      )
    );
  } else if (batterySoc <= (THRESHOLDS.batterySoc.warningMin || 20)) {
    alerts.push(
      generateThresholdAlert(
        telemetry.vehicleId,
        'batterySoc',
        batterySoc,
        THRESHOLDS.batterySoc.warningMin || 20,
        'warning',
        '%'
      )
    );
  }

  return alerts;
}

function* fetchTelemetrySaga(action: PayloadAction<string>) {
  try {
    const data: TelemetryData = yield call(telemetryService.getTelemetry, action.payload);
    yield put(telemetryActions.fetchTelemetrySuccess(data));

    const existing: Alert[] = yield select((s: RootState) => s.alert.alerts);
    const thresholdAlerts = checkThresholds(data);

    for (const alert of thresholdAlerts) {
      // Avoid spamming identical metric alerts within a 60s window
      const duplicate = existing.some(
        (a) =>
          a.status === 'active' &&
          a.metric === alert.metric &&
          a.severity === alert.severity &&
          Date.now() - new Date(a.timestamp).getTime() < 60_000
      );
      if (!duplicate) {
        yield put(alertActions.pushAlert(alert));
      }
    }
  } catch (error) {
    yield put(
      telemetryActions.fetchTelemetryFailure(
        error instanceof Error ? error.message : 'Failed to fetch telemetry'
      )
    );
  }
}

function* fetchHistorySaga(
  action: PayloadAction<{ vehicleId: string; range?: string }>
) {
  try {
    const history: TelemetryHistory = yield call(
      telemetryService.getTelemetryHistory,
      action.payload.vehicleId,
      action.payload.range
    );
    yield put(telemetryActions.fetchHistorySuccess(history));
  } catch (error) {
    yield put(
      telemetryActions.fetchHistoryFailure(
        error instanceof Error ? error.message : 'Failed to fetch history'
      )
    );
  }
}

function* pollTelemetrySaga(action: PayloadAction<string>) {
  const vehicleId = action.payload;

  while (true) {
    const { stop } = yield race({
      tick: delay(3000),
      stop: take(telemetryActions.stopPolling.type),
    });

    if (stop) break;

    const isPolling: boolean = yield select((s: RootState) => s.telemetry.isPolling);
    if (!isPolling) break;

    yield put(telemetryActions.fetchTelemetryRequest(vehicleId));
  }
}

export default function* telemetrySaga() {
  yield takeLatest(telemetryActions.fetchTelemetryRequest.type, fetchTelemetrySaga);
  yield takeLatest(telemetryActions.fetchHistoryRequest.type, fetchHistorySaga);
  yield takeLatest(telemetryActions.startPolling.type, pollTelemetrySaga);
}
