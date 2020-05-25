import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'METADATA/';

export const MetadataRoutines = {
  fetchMetadata: createRoutine(`${PREFIX}_FETCH_METADATA_TAGS`),
  updateMetadata: createRoutine(`${PREFIX}_UPDATE_METADATA_TAGS`),
};

export const INITIAL_STATE = new Immutable({
  metadata: [],
});

const setMetadata = (state = INITIAL_STATE, { payload }) => state.set('metadata', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [MetadataRoutines.fetchMetadata.SUCCESS]: setMetadata,
  [MetadataRoutines.updateMetadata.SUCCESS]: setMetadata,
});
