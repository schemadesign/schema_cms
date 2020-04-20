import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PREVIEW_LINK/';

export const PreviewLinkRoutines = {
  fetchLink: createRoutine(`${PREFIX}FETCH_LINK`),
};

export const INITIAL_STATE = new Immutable({
  metaTags: null,
});

const handleFetchLinkSuccess = (state = INITIAL_STATE, { payload }) => state.set('metaTags', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PreviewLinkRoutines.fetchLink.SUCCESS]: handleFetchLinkSuccess,
});
