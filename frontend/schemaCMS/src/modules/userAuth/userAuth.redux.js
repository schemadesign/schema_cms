import { createActions, createReducer } from 'reduxsauce';
import { createRoutine } from 'redux-saga-routines';
import Immutable from 'seamless-immutable';

export const { Types: UserAuthTypes, Creators: UserAuthActions } = createActions(
  {
    fetchUserDetailsSuccess: ['data'],
    fetchUserDetailsError: null,
    logout: null,
    logoutSuccess: null,
  },
  { prefix: 'USER_AUTH/' }
);

export const UserAuthRoutines = {
  fetchUserDetails: createRoutine(`${prefix}_FETCH_USER_DETAILS`),
  resetPassword: createRoutine(`${prefix}RESET_PASSWORD`),
  resendVerificationEmail: createRoutine(`${prefix}RESEND_VERIFICATION_EMAIL`),
};

export const INITIAL_STATE = new Immutable({
  user: {},
  isAuthenticated: false,
  isFetched: false,
  isPractice: false,
});

const fetchUserSuccess = (state = INITIAL_STATE, { data }) => state.set('isAuthenticated', true)
  .set('isFetched', true)
  .set('user', data);

const fetchUserFailure = state => state.set('isAuthenticated', false).set('isFetched', true);

const logoutSuccess = state => state.set('isAuthenticated', false).set('isFetched', true);

const HANDLERS = {
  [UserAuthTypes.FETCH_USER_DETAILS_SUCCESS]: fetchUserSuccess,
  [UserAuthTypes.FETCH_USER_DETAILS_ERROR]: fetchUserFailure,
  [UserAuthTypes.LOGOUT_SUCCESS]: logoutSuccess,
};

export const reducer = createReducer(INITIAL_STATE, HANDLERS);
