import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'DATA_SOURCE_TAGS/';

export const DataSourceTagsRoutines = {
  fetchDataSourceTags: createRoutine(`${PREFIX}_FETCH_DATA_SOURCE_TAGS`),
  updateDataSourceTags: createRoutine(`${PREFIX}_UPDATE_DATA_SOURCE_TAGS`),
};

export const INITIAL_STATE = new Immutable({
  dataSourceTags: [],
});

const setDataSourceTags = (state = INITIAL_STATE, { payload }) => state.set('dataSourceTags', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceTagsRoutines.fetchDataSourceTags.SUCCESS]: setDataSourceTags,
  [DataSourceTagsRoutines.updateDataSourceTags.SUCCESS]: setDataSourceTags,
});
