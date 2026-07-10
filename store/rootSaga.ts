import { all, fork } from 'redux-saga/effects';
import vehicleSaga from './sagas/vehicleSaga';
import telemetrySaga from './sagas/telemetrySaga';
import chartSaga from './sagas/chartSaga';
import alertSaga from './sagas/alertSaga';
import maintenanceSaga from './sagas/maintenanceSaga';

export default function* rootSaga() {
  yield all([
    fork(vehicleSaga),
    fork(telemetrySaga),
    fork(chartSaga),
    fork(alertSaga),
    fork(maintenanceSaga),
  ]);
}
