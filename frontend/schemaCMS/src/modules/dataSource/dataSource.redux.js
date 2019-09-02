import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_SOURCE/';

export const DataSourceRoutines = {
  create: createRoutine(`${prefix}CREATE`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
});

export const reducer = createReducer(INITIAL_STATE, {});
