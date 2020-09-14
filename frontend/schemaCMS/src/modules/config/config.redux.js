import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'CONFIG/';

export const ConfigRoutines = {
  fetchConfig: createRoutine(`${PREFIX}FETCH_CONFIG`),
};

export const INITIAL_STATE = new Immutable({
  authenticationBackend: null,
});

const handleFetchConfigSuccess = (state = INITIAL_STATE, { payload }) =>
  state.set('authenticationBackend', payload.authenticationBackend);

export const reducer = createReducer(INITIAL_STATE, {
  [ConfigRoutines.fetchConfig.SUCCESS]: handleFetchConfigSuccess,
});
