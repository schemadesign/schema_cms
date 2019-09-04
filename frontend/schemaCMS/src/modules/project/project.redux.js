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
    fetchOneError: ['error'],
    unmountOne: null,
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

const createProjectSuccess = (state = INITIAL_STATE, { project }) => {
  return state.merge({ projects: state.projects.concat(project) });
};

const fetchOneSuccess = (state = INITIAL_STATE, { data }) => state.set('project', data);

const fetchOneError = (state = INITIAL_STATE, { error }) => state.set('project', error);

const unmountOne = (state = INITIAL_STATE) => state.set('project', INITIAL_STATE.project);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
  [ProjectTypes.CREATE_PROJECT_SUCCESS]: createProjectSuccess,
  [ProjectTypes.FETCH_ONE_SUCCESS]: fetchOneSuccess,
  [ProjectTypes.FETCH_ONE_ERROR]: fetchOneError,
  [ProjectTypes.UNMOUNT_ONE]: unmountOne,
});
