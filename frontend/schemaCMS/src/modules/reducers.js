import { reducer as startupReducer } from './startup/startup.redux';
import { reducer as userAuthReducer } from './userAuth/userAuth.redux';
import { reducer as userProfileReducer } from './userProfile/userProfile.redux';
import { reducer as projectReducer } from './project/project.redux';
import { reducer as dataSourceReducer } from './dataSource/dataSource.redux';
import { reducer as dataWranglingScriptsReducer } from './dataWranglingScripts/dataWranglingScripts.redux';
import { reducer as userReducer } from './user/user.redux';
import { reducer as jobReducer } from './job/job.redux';
import { reducer as filterReducer } from './filter/filter.redux';
import { reducer as folderReducer } from './folder/folder.redux';
import { reducer as pageReducer } from './page/page.redux';
import { reducer as pageBlockReducer } from './pageBlock/pageBlock.redux';
import { reducer as tagReducer } from './tag/tag.redux';
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
    filter: filterReducer,
    folder: folderReducer,
    page: pageReducer,
    pageBlock: pageBlockReducer,
    tag: tagReducer,
    //<-- INJECT MODULE REDUCER -->
  };
}
