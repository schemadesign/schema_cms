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
    unmountOne: null,
  },
  { prefix }
);

export const ProjectRoutines = {
  createProject: createRoutine(`${prefix}CREATE_PROJECT`),
  removeOne: createRoutine(`${prefix}REMOVE`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {},
});

const fetchListSuccess = (state = INITIAL_STATE, { data }) => {
  debugger;
  return state.set('projects', data);
};

const createProjectSuccess = (state = INITIAL_STATE, { project }) => {
  return state.merge({ projects: state.projects.concat(project) });
};

const fetchOneSuccess = (state = INITIAL_STATE, { data }) => state.set('project', data);

const fetchOneError = (state = INITIAL_STATE, { error }) => state.set('project', error);

const unmountOne = (state = INITIAL_STATE) => state.set('project', INITIAL_STATE.project);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
  [ProjectTypes.CREATE_PROJECT_SUCCESS]: createProjectSuccess,
  [ProjectRoutines.fetchOne.SUCCESS]: fetchOneSuccess,
  [ProjectRoutines.fetchOne.FAILURE]: fetchOneError,
  [ProjectTypes.UNMOUNT_ONE]: unmountOne,
});
