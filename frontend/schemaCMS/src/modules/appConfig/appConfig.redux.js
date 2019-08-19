import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

export const { Types: AppConfigTypes, Creators: AppConfigActions } = createActions(
  {
    noop: null, // TODO: remove this action
  },
  { prefix: 'APP_CONFIG/' }
);

export const INITIAL_STATE = new Immutable({});

export const reducer = createReducer(INITIAL_STATE, {});
