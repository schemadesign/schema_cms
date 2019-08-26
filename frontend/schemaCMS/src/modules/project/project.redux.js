import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const { Types: ProjectTypes, Creators: ProjectActions } = createActions(
  {
    fetchListSuccess: ['data'],
    fetchListError: null,
  },
  { prefix }
);

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}_FETCH_LIST`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
});

const fetchListSuccess = (state = INITIAL_STATE, { data }) => state.set('projects', data);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
});
