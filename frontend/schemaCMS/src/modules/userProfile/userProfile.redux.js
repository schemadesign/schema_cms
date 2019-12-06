import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { ROLES } from './userProfile.constants';

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
  isAdmin: false,
});

const updateUser = (state = INITIAL_STATE, { payload }) =>
  state
    .set('user', payload)
    .set('isFetched', true)
    .set('isAdmin', payload.role === ROLES.ADMIN);

const fetchUserFailure = state => state.set('user', {}).set('isFetched', true);

const clearUserDetails = state =>
  state
    .set('user', {})
    .set('isFetched', false)
    .set('isAdmin', false);

export const reducer = createReducer(INITIAL_STATE, {
  [UserProfileRoutines.fetchUserDetails.SUCCESS]: updateUser,
  [UserProfileRoutines.updateMe.SUCCESS]: updateUser,
  [UserProfileRoutines.fetchUserDetails.FAILURE]: fetchUserFailure,
  [UserProfileTypes.CLEAR_USER_DETAILS]: clearUserDetails,
});
