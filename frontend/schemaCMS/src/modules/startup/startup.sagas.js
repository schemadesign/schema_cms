import { all, takeLatest } from 'redux-saga/effects';


export function* startup() {}

export function* watchStartup() {
  yield all([takeLatest(StartupTypes.STARTUP, startup)]);
}
