import { createActions, createReducer } from 'reduxsauce';
import { createRoutine } from 'redux-saga-routines';
import Immutable from 'seamless-immutable';

export const { Types: UserAuthTypes, Creators: UserAuthActions } = createActions(
  {
    userDetailsFetchSuccess: ['data'],
    userDetailsFetchError: null,
    logout: null,
    logoutSuccess: null,
  },
  { prefix: 'USER_AUTH/' }
);

export const UserAuthRoutines = {
  resetPassword: createRoutine(`${prefix}RESET_PASSWORD`),
  resendVerificationEmail: createRoutine(`${prefix}RESEND_VERIFICATION_EMAIL`),x
};

export const INITIAL_STATE = new Immutable({
  user: {},
  isAuthenticated: false,
  isFetched: false,
  isPractice: false,
});

const fetchUserSuccess = state => state.set('isAuthenticated', true).set('isFetched', true);

const fetchUserFailure = state => state.set('isAuthenticated', false).set('isFetched', true);

const logoutSuccess = state => state.set('isAuthenticated', false).set('isFetched', true);

const HANDLERS = {
  [UserAuthTypes.USER_DETAILS_FETCH_SUCCESS]: fetchUserSuccess,
  [UserAuthTypes.USER_DETAILS_FETCH_ERROR]: fetchUserFailure,
  [UserAuthTypes.LOGOUT_SUCCESS]: logoutSuccess,
};

export const reducer = createReducer(INITIAL_STATE, HANDLERS);
