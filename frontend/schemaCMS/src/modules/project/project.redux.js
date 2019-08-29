import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const { Types: ProjectTypes, Creators: ProjectActions } = createActions(
  {
    fetchList: [],
    fetchListSuccess: ['data'],
    fetchListError: null,
    createProjectSuccess: ['project'],
    fetchOne: ['id'],
    fetchOneSuccess: ['data'],
    fetchOneError: null,
  },
  { prefix }
);

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  createProject: createRoutine(`${prefix}CREATE_PROJECT`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {},
});

const fetchListSuccess = (state = INITIAL_STATE, { data }) => state.set('projects', data);

const createProjectSuccess = (state = INITIAL_STATE, { project }) => state.merge('projects', project);

const fetchOneSuccess = (state = INITIAL_STATE, { data }) => state.set('project', data);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
  [ProjectTypes.CREATE_PROJECT_SUCCESS]: createProjectSuccess,
  [ProjectTypes.FETCH_ONE_SUCCESS]: fetchOneSuccess,
});
