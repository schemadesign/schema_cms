import { all, fork } from 'redux-saga/effects';

import reportError from '../shared/utils/reportError';
import { watchUserAuth } from './userAuth/userAuth.sagas';
import { watchAppConfig } from './appConfig/appConfig.sagas';
//<-- IMPORT MODULE SAGA -->

export default function* rootSaga() {
  try {
    yield all([
      fork(watchUserAuth),
      fork(watchAppConfig),
      //<-- INJECT MODULE SAGA -->
    ]);
  } catch (e) {
    yield reportError(e);
  }
}
