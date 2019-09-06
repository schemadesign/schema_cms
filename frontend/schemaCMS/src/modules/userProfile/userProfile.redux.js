import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'USER_PROFILE/';

export const { Types: UserProfileTypes, Creators: UserProfileActions } = createActions(
  {
    fetchUserDetailsSuccess: ['data'],
    updateMeSuccess: ['data'],
    fetchUserDetailsError: null,
    updateMeError: null,
    clearUserDetails: null,
  },
  { prefix }
);

export const UserProfileRoutines = {
  fetchUserDetails: createRoutine(`${prefix}_FETCH_USER_DETAILS`),
  updateMe: createRoutine(`${prefix}_UPDATE_ME`),
  resetPassword: createRoutine(`${prefix}RESET_PASSWORD`),
  resendVerificationEmail: createRoutine(`${prefix}RESEND_VERIFICATION_EMAIL`),
};

export const INITIAL_STATE = new Immutable({
  user: {},
  isFetched: false,
});

const fetchUserSuccess = (state = INITIAL_STATE, { data }) => state.set('user', data).set('isFetched', true);

const fetchUserFailure = state => state.set('user', {}).set('isFetched', true);

const clearUserDetails = state => state.set('user', {}).set('isFetched', false);

export const reducer = createReducer(INITIAL_STATE, {
  [UserProfileTypes.FETCH_USER_DETAILS_SUCCESS]: fetchUserSuccess,
  [UserProfileTypes.UPDATE_ME_SUCCESS]: fetchUserSuccess,
  [UserProfileTypes.FETCH_USER_DETAILS_ERROR]: fetchUserFailure,
  [UserProfileTypes.CLEAR_USER_DETAILS]: clearUserDetails,
});
