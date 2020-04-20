import { reducer as startupReducer } from './startup/startup.redux';
import { reducer as userAuthReducer } from './userAuth/userAuth.redux';
import { reducer as userProfileReducer } from './userProfile/userProfile.redux';
import { reducer as projectReducer } from './project/project.redux';
import { reducer as dataSourceReducer } from './dataSource/dataSource.redux';
import { reducer as dataWranglingScriptsReducer } from './dataWranglingScripts/dataWranglingScripts.redux';
import { reducer as userReducer } from './user/user.redux';
import { reducer as jobReducer } from './job/job.redux';
import { reducer as filterReducer } from './filter/filter.redux';
import { reducer as pageReducer } from './page/page.redux';
import { reducer as DataSourceTagReducer } from './dataSourceTag/dataSourceTag.redux';
import { reducer as projectStateReducer } from './projectState/projectState.redux';
import { reducer as blockTemplatesReducer } from './blockTemplates/blockTemplates.redux';
import { reducer as pageTemplatesReducer } from './pageTemplates/pageTemplates.redux';
import { reducer as sectionsReducer } from './sections/sections.redux';
import { reducer as previewLinkReducer } from './previewLink/previewLink.redux';
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
    page: pageReducer,
    dataSourceTag: DataSourceTagReducer,
    projectState: projectStateReducer,
    blockTemplates: blockTemplatesReducer,
    pageTemplates: pageTemplatesReducer,
    sections: sectionsReducer,
    previewLink: previewLinkReducer,
    //<-- INJECT MODULE REDUCER -->
  };
}
