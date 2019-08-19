import { reducer as startupReducer } from './startup/startup.redux';
import { reducer as userAuthReducer } from './userAuth/userAuth.redux';
import { reducer as appConfigReducer } from './appConfig/appConfig.redux';
//<-- IMPORT MODULE REDUCER -->

export default function createReducer() {
  return {
    startup: startupReducer,
    userAuth: userAuthReducer,
    appConfig: appConfigReducer,
    //<-- INJECT MODULE REDUCER -->
  };
}
