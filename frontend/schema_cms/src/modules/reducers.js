import { combineReducers } from 'redux';

import { reducer as startupReducer } from './startup/startup.redux';
//<-- IMPORT MODULE REDUCER -->

export default function createReducer() {
  return combineReducers({
    startup: startupReducer,
    //<-- INJECT MODULE REDUCER -->
  });
}
