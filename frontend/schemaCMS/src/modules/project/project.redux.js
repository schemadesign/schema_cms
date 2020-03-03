import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  removeOne: createRoutine(`${prefix}REMOVE`),
  createProject: createRoutine(`${prefix}CREATE_PROJECT`),
  removeEditor: createRoutine(`${prefix}REMOVE_EDITOR`),
  addEditor: createRoutine(`${prefix}ADD_EDITOR`),
  fetchEditors: createRoutine(`${prefix}FETCH_EDITORS`),
  setProject: createRoutine(`${prefix}SET_PROJECT`),
  clearProject: createRoutine(`${prefix}CLEAR_PROJECT`),
  editProject: createRoutine(`${prefix}EDIT_PROJECT`),
  fetchTemplates: createRoutine(`${prefix}TEMPLATES`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  project: {
    id: null,
  },
  editors: [],
  templates: {
    blocks: 0,
    pages: 0,
    filters: 0,
    states: 0,
  },
});

const updateList = (state = INITIAL_STATE, { payload }) => state.set('projects', payload);

const createProjectSuccess = (state = INITIAL_STATE, { payload }) =>
  state.merge({ projects: state.projects.concat(payload) });

const setProject = (state = INITIAL_STATE, { payload }) => state.set('project', payload);
const clearProject = (state = INITIAL_STATE) => state.set('project', INITIAL_STATE.project);

const setEditors = (state = INITIAL_STATE, { payload }) => state.set('editors', payload);
const fetchTemplates = (state = INITIAL_STATE, { payload }) => state.set('templates', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectRoutines.fetchList.SUCCESS]: updateList,
  [ProjectRoutines.fetchOne.SUCCESS]: setProject,
  [ProjectRoutines.editProject.SUCCESS]: setProject,
  [ProjectRoutines.createProject.SUCCESS]: createProjectSuccess,
  [ProjectRoutines.fetchEditors.SUCCESS]: setEditors,
  [ProjectRoutines.setProject.TRIGGER]: setProject,
  [ProjectRoutines.clearProject.TRIGGER]: clearProject,
  [ProjectRoutines.fetchTemplates.SUCCESS]: fetchTemplates,
});
