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
import { watchPage } from './page/page.sagas';
import { watchDataSourceTag } from './dataSourceTag/dataSourceTag.sagas';
import { watchProjectState } from './projectState/projectState.sagas';
import { watchBlockTemplates } from './blockTemplates/blockTemplates.sagas';
import { watchPageTemplates } from './pageTemplates/pageTemplates.sagas';
import { watchSections } from './sections/sections.sagas';
import { watchPreviewLink } from './previewLink/previewLink.sagas';
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
      fork(watchPage),
      fork(watchDataSourceTag),
      fork(watchProjectState),
      fork(watchBlockTemplates),
      fork(watchPageTemplates),
      fork(watchSections),
      fork(watchPreviewLink),
      //<-- INJECT MODULE SAGA -->
    ]);
  } catch (e) {
    yield reportError(e);
  }
}
