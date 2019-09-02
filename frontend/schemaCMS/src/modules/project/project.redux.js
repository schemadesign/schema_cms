import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const { Types: ProjectTypes, Creators: ProjectActions } = createActions(
  {
    fetchList: [],
    fetchListSuccess: ['data'],
    fetchListError: null,
    fetchOne: ['id'],
    fetchOneSuccess: ['data'],
    fetchOneError: null,
    setFetched: null,
    unsetFetched: null,
  },
  { prefix }
);

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {},
  isFetched: false,
});

const fetchListSuccess = (state = INITIAL_STATE, { data }) => state.set('projects', data);

const fetchOneSuccess = (state = INITIAL_STATE, { data }) => state.set('project', data);

const setFetched = (state = INITIAL_STATE) => state.set('isFetched', true);
const unsetFetched = (state = INITIAL_STATE) => state.set('isFetched', false).set('project', INITIAL_STATE.project);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
  [ProjectTypes.FETCH_ONE_SUCCESS]: fetchOneSuccess,
  [ProjectTypes.SET_FETCHED]: setFetched,
  [ProjectTypes.UNSET_FETCHED]: unsetFetched,
});
