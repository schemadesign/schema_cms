import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

const prefix = 'USER_AUTH/';

export const { Types: UserAuthTypes, Creators: UserAuthActions } = createActions(
  {
    getJwtToken: ['uid', 'token'],
    getJwtTokenSuccess: ['jwt'],
    logout: null,
    logoutSuccess: null,
    resetPassword: null,
  },
  { prefix: prefix }
);

export const INITIAL_STATE = new Immutable({
  isAuthenticated: false,
  jwtToken: null,
});

const getJwtTokenSuccess = (state, { jwt }) => {
  return state.set('isAuthenticated', true).set('jwtToken', jwt);
};

const logoutSuccess = state => state.set('isAuthenticated', false).set('jwtToken', null);

const HANDLERS = {
  [UserAuthTypes.LOGOUT_SUCCESS]: logoutSuccess,
  [UserAuthTypes.GET_JWT_TOKEN_SUCCESS]: getJwtTokenSuccess,
};

export const reducer = createReducer(INITIAL_STATE, HANDLERS);
