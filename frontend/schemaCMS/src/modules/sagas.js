import { all, fork } from 'redux-saga/effects';
import { routinePromiseWatcherSaga } from 'redux-saga-routines';

import reportError from '../shared/utils/reportError';
import { watchUserAuth } from './userAuth/userAuth.sagas';
import { watchUserProfile } from './userProfile/userProfile.sagas';
import { watchProject } from './project/project.sagas';
import { watchDataSource } from './dataSource/dataSource.sagas';
import { watchDataWranglingScripts } from './dataWranglingScripts/dataWranglingScripts.sagas';
import { watchUser } from './user/user.sagas';
import { watchJob } from './job/job.sagas';
import { watchFilter } from './filter/filter.sagas';
import { watchFolder } from './folder/folder.sagas';
import { watchPage } from './page/page.sagas';
import { watchPageBlock } from './pageBlock/pageBlock.sagas';
import { watchDataSourceTag } from './dataSourceTag/dataSourceTag.sagas';
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
      fork(watchUser),
      fork(watchJob),
      fork(watchFilter),
      fork(watchFolder),
      fork(watchPage),
      fork(watchPageBlock),
      fork(watchDataSourceTag),
      //<-- INJECT MODULE SAGA -->
    ]);
  } catch (e) {
    yield reportError(e);
  }
}
