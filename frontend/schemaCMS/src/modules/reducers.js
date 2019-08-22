import { reducer as startupReducer } from './startup/startup.redux';
import { reducer as userAuthReducer } from './userAuth/userAuth.redux';
import { reducer as appConfigReducer } from './appConfig/appConfig.redux';
import { reducer as userProfileReducer } from './userProfile/userProfile.redux';
//<-- IMPORT MODULE REDUCER -->

export default function createReducer() {
  return {
    startup: startupReducer,
    userAuth: userAuthReducer,
    appConfig: appConfigReducer,
    userProfile: userProfileReducer,
    //<-- INJECT MODULE REDUCER -->
  };
}
