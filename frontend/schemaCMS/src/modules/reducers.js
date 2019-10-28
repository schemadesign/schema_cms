import { reducer as startupReducer } from './startup/startup.redux';
import { reducer as userAuthReducer } from './userAuth/userAuth.redux';
import { reducer as userProfileReducer } from './userProfile/userProfile.redux';
import { reducer as projectReducer } from './project/project.redux';
import { reducer as dataSourceReducer } from './dataSource/dataSource.redux';
import { reducer as dataWranglingScriptsReducer } from './dataWranglingScripts/dataWranglingScripts.redux';
import { reducer as userReducer } from './user/user.redux';
import { reducer as jobReducer } from './job/job.redux';
//<-- IMPORT MODULE REDUCER -->

export default function createReducer() {
  return {
    startup: startupReducer,
    userAuth: userAuthReducer,
    userProfile: userProfileReducer,
    project: projectReducer,
    dataSource: dataSourceReducer,
    dataWranglingScripts: dataWranglingScriptsReducer,
    user: userReducer,
    job: jobReducer,
    //<-- INJECT MODULE REDUCER -->
  };
}
