import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const { Types: ProjectTypes, Creators: ProjectActions } = createActions(
  {
    fetchList: [],
    fetchListSuccess: ['data'],
    fetchListError: null,
    fetchProject: [],
    fetchProjectSuccess: ['data'],
    fetchProjectError: null,
  },
  { prefix }
);

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {},
});

const fetchListSuccess = (state = INITIAL_STATE, { data }) => state.set('projects', data);

const fetchProjectSuccess = (state = INITIAL_STATE, { data }) => state.set('project', data);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
  [ProjectTypes.FETCH_PROJECT_SUCCESS]: fetchProjectSuccess,
});
