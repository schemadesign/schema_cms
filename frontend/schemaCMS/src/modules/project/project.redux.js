import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  unmountOne: createRoutine(`${prefix}UNMOUNT_ONE`),
  removeOne: createRoutine(`${prefix}REMOVE`),
  createProject: createRoutine(`${prefix}CREATE_PROJECT`),
  removeEditor: createRoutine(`${prefix}REMOVE_EDITOR`),
  addEditor: createRoutine(`${prefix}ADD_EDITOR`),
  fetchEditors: createRoutine(`${prefix}FETCH_EDITORS`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {},
  editors: [],
});

const updateList = (state = INITIAL_STATE, { payload }) => state.set('projects', payload);

const createProjectSuccess = (state = INITIAL_STATE, { payload }) =>
  state.merge({ projects: state.projects.concat(payload) });

const updateOne = (state = INITIAL_STATE, { payload }) => state.set('project', payload);

const setEditors = (state = INITIAL_STATE, { payload }) => state.set('editors', payload);

const unmountOne = (state = INITIAL_STATE) => state.set('project', INITIAL_STATE.project);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectRoutines.fetchList.SUCCESS]: updateList,
  [ProjectRoutines.fetchOne.SUCCESS]: updateOne,
  [ProjectRoutines.unmountOne.TRIGGER]: unmountOne,
  [ProjectRoutines.createProject.SUCCESS]: createProjectSuccess,
  [ProjectRoutines.fetchEditors.SUCCESS]: setEditors,
});
