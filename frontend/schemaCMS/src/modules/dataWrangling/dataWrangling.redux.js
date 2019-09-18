import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_WRANGLING/';

export const DataWranglingRoutines = {
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  unmountOne: createRoutine(`${prefix}UNMOUNT_ONE`),
};

export const INITIAL_STATE = new Immutable({
  dataWrangling: {},
  dataWranglings: [],
});

const updateDataWrangling = (state = INITIAL_STATE, { payload }) => state.set('dataWrangling', payload);
const unmountDataWrangling = (state = INITIAL_STATE) => state.set('dataWrangling', INITIAL_STATE.dataWrangling);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingRoutines.fetchOne.SUCCESS]: updateDataWrangling,
  [DataWranglingRoutines.unmountOne.TRIGGER]: unmountDataWrangling,
});
