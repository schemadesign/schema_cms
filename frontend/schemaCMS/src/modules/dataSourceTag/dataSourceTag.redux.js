import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'DATA_SOURCE_TAG/';

export const DataSourceTagRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  createTag: createRoutine(`${PREFIX}CREATE_TAG`),
  setTags: createRoutine(`${PREFIX}SET_TAGS`),
  fetchTag: createRoutine(`${PREFIX}FETCH_TAG`),
  removeTag: createRoutine(`${PREFIX}REMOVE_TAG`),
  updateTag: createRoutine(`${PREFIX}UPDATE_TAG`),
};

export const INITIAL_STATE = new Immutable({
  tags: [],
  tag: {},
});

const setTags = (state = INITIAL_STATE, { payload }) => state.set('tags', payload);
const setTag = (state = INITIAL_STATE, { payload }) => state.set('tag', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceTagRoutines.fetchList.success]: setTags,
  [DataSourceTagRoutines.setTags.success]: setTags,
  [DataSourceTagRoutines.fetchTag.success]: setTag,
});
