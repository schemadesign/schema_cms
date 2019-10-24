import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'JOB/';

export const JobRoutines = {
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
};

export const INITIAL_STATE = new Immutable({
  job: {},
});

const fetchOne = (state = INITIAL_STATE, { payload }) => state.set('job', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [JobRoutines.fetchOne.SUCCESS]: fetchOne,
});
