import { call, put, takeLatest, all } from 'redux-saga/effects';
import { chartActions } from '../slices/chartSlice';
import { chartService } from '../../services';
import type { ChartSeries, AnalyticsData, ChartRange } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';

function* fetchVoltageSaga(
  action: PayloadAction<{ vehicleId: string; range?: ChartRange }>
) {
  try {
    const series: ChartSeries = yield call(
      chartService.getVoltage,
      action.payload.vehicleId,
      action.payload.range
    );
    yield put(chartActions.fetchVoltageSuccess(series));
  } catch (error) {
    yield put(
      chartActions.fetchVoltageFailure(
        error instanceof Error ? error.message : 'Failed to fetch voltage chart'
      )
    );
  }
}

function* fetchCurrentSaga(
  action: PayloadAction<{ vehicleId: string; range?: ChartRange }>
) {
  try {
    const series: ChartSeries = yield call(
      chartService.getCurrent,
      action.payload.vehicleId,
      action.payload.range
    );
    yield put(chartActions.fetchCurrentSuccess(series));
  } catch (error) {
    yield put(
      chartActions.fetchCurrentFailure(
        error instanceof Error ? error.message : 'Failed to fetch current chart'
      )
    );
  }
}

function* fetchTemperatureSaga(
  action: PayloadAction<{ vehicleId: string; range?: ChartRange }>
) {
  try {
    const series: ChartSeries = yield call(
      chartService.getTemperature,
      action.payload.vehicleId,
      action.payload.range
    );
    yield put(chartActions.fetchTemperatureSuccess(series));
  } catch (error) {
    yield put(
      chartActions.fetchTemperatureFailure(
        error instanceof Error ? error.message : 'Failed to fetch temperature chart'
      )
    );
  }
}

function* fetchAllChartsSaga(
  action: PayloadAction<{ vehicleId: string; range?: ChartRange }>
) {
  try {
    const { vehicleId, range } = action.payload;
    const [voltage, current, temperature]: ChartSeries[] = yield all([
      call(chartService.getVoltage, vehicleId, range),
      call(chartService.getCurrent, vehicleId, range),
      call(chartService.getTemperature, vehicleId, range),
    ]);
    yield put(chartActions.fetchAllChartsSuccess({ voltage, current, temperature }));
  } catch (error) {
    yield put(
      chartActions.fetchAllChartsFailure(
        error instanceof Error ? error.message : 'Failed to fetch charts'
      )
    );
  }
}

function* fetchAnalyticsSaga(
  action: PayloadAction<{ vehicleId: string; period?: string }>
) {
  try {
    const analytics: AnalyticsData = yield call(
      chartService.getAnalytics,
      action.payload.vehicleId,
      action.payload.period
    );
    yield put(chartActions.fetchAnalyticsSuccess(analytics));
  } catch (error) {
    yield put(
      chartActions.fetchAnalyticsFailure(
        error instanceof Error ? error.message : 'Failed to fetch analytics'
      )
    );
  }
}

export default function* chartSaga() {
  yield takeLatest(chartActions.fetchVoltageRequest.type, fetchVoltageSaga);
  yield takeLatest(chartActions.fetchCurrentRequest.type, fetchCurrentSaga);
  yield takeLatest(chartActions.fetchTemperatureRequest.type, fetchTemperatureSaga);
  yield takeLatest(chartActions.fetchAllChartsRequest.type, fetchAllChartsSaga);
  yield takeLatest(chartActions.fetchAnalyticsRequest.type, fetchAnalyticsSaga);
}
