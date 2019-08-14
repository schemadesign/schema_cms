import { combineReducers } from 'redux';

import { reducer as startupReducer } from './startup/startup.redux';
import { reducer as userAuthReducer } from './userAuth/userAuth.redux';
//<-- IMPORT MODULE REDUCER -->

export default function createReducer() {
  return combineReducers({
    startup: startupReducer,
    userAuth: userAuthReducer,
    //<-- INJECT MODULE REDUCER -->
  });
}
