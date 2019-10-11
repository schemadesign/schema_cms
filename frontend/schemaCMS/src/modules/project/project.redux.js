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
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {},
  isFetched: false,
});

const updateList = (state = INITIAL_STATE, { payload }) => state.set('projects', payload).set('isFetched', true);

const createProjectSuccess = (state = INITIAL_STATE, { payload }) =>
  state.merge({ projects: state.projects.concat(payload) }).set('isFetched', true);

const updateOne = (state = INITIAL_STATE, { payload }) => state.set('project', payload).set('isFetched', true);

const unmountOne = (state = INITIAL_STATE) => state.set('project', INITIAL_STATE.project).set('isFetched', false);

const onFailure = (state = INITIAL_STATE) => state.set('project', INITIAL_STATE.project).set('isFetched', true);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectRoutines.fetchList.SUCCESS]: updateList,
  [ProjectRoutines.fetchOne.SUCCESS]: updateOne,
  [ProjectRoutines.fetchOne.FAILURE]: onFailure,
  [ProjectRoutines.unmountOne.TRIGGER]: unmountOne,
  [ProjectRoutines.createProject.SUCCESS]: createProjectSuccess,
});
