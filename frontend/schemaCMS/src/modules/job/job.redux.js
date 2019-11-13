import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'JOB/';

export const JobRoutines = {
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
  updateOne: createRoutine(`${PREFIX}UPDATE_ONE`),
  fetchJobList: createRoutine(`${PREFIX}FETCH_LIST`),
  fetchPreview: createRoutine(`${PREFIX}FETCH_PREVIEW`),
};

export const INITIAL_STATE = new Immutable({
  job: {},
  jobList: [],
  jobPreview: {},
});

const setJob = (state = INITIAL_STATE, { payload }) => state.set('job', payload);
const setJobList = (state = INITIAL_STATE, { payload }) => state.set('jobList', payload);
const setJobPreview = (state = INITIAL_STATE, { payload }) => state.set('jobPreview', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [JobRoutines.fetchOne.SUCCESS]: setJob,
  [JobRoutines.updateOne.SUCCESS]: setJob,
  [JobRoutines.fetchJobList.SUCCESS]: setJobList,
  [JobRoutines.fetchPreview.SUCCESS]: setJobPreview,
});
