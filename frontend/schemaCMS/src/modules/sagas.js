import { all, fork } from 'redux-saga/effects';
import { routinePromiseWatcherSaga } from 'redux-saga-routines';

import reportError from '../shared/utils/reportError';
import { watchUserAuth } from './userAuth/userAuth.sagas';
import { watchUserProfile } from './userProfile/userProfile.sagas';
import { watchProject } from './project/project.sagas';
import { watchDataSource } from './dataSource/dataSource.sagas';
import { watchDataWranglingScripts } from './dataWranglingScripts/dataWranglingScripts.sagas';
import { watchDataWranglingResult } from './dataWranglingResult/dataWranglingResult.sagas';
import { watchUser } from './user/user.sagas';
//<-- IMPORT MODULE SAGA -->

export default function* rootSaga() {
  try {
    yield all([
      fork(watchUserAuth),
      fork(routinePromiseWatcherSaga),
      fork(watchUserProfile),
      fork(watchProject),
      fork(watchDataSource),
      fork(watchDataWranglingScripts),
      fork(watchDataWranglingResult),
      fork(watchUser),
      //<-- INJECT MODULE SAGA -->
    ]);
  } catch (e) {
    yield reportError(e);
  }
}
