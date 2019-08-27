import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'PROJECT/';

export const { Types: ProjectTypes, Creators: ProjectActions } = createActions(
  {
    fetchList: [],
    fetchListSuccess: ['data'],
    fetchListError: null,
    toggleMenu: [],
  },
  { prefix }
);

export const ProjectRoutines = {
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
};

export const INITIAL_STATE = new Immutable({
  projects: [],
  isMenuOpen: false,
});

const fetchListSuccess = (state = INITIAL_STATE, { data }) => state.set('projects', data);
const toggleMenu = (state = INITIAL_STATE) => state.set('isMenuOpen', !state.isMenuOpen);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectTypes.FETCH_LIST_SUCCESS]: fetchListSuccess,
  [ProjectTypes.TOGGLE_MENU]: toggleMenu,
});
