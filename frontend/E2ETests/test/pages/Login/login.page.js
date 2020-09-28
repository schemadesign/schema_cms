import { cond, propEq, both } from 'ramda';
import { camelize } from 'humps';
import { clickElement, setValue } from '../../helpers/actions';
import { createSelectors } from '../../helpers/utils';
import { isTextDisplayed } from '../../helpers/check';
import { USERS } from '../Constants/credentials.constants';
import { EMPTY, INVALID, NOT_EXISTING, VALID } from '../Constants/general.constants';
import {
  AUTH0_WRONG_CREDS_ERROR,
  LOGIN_PAGE_EMPTY_INPUT_MSG,
  LOGIN_PAGE_INVALID_INPUT_MSG,
  LOGIN_STATE,
  PASSWORD_STATE,
} from './loginPage.constants';
import { DJANGO } from '../Django/django.constants';

const singleSelectors = {
  emailInput: '[name="email"]',
  passwordInput: '[name="password"]',
  submitBtn: '.auth0-lock-submit',
  loginWithGoogleBtn: 'auth0-lock-social-Btn',
  emptyEmailError: '#auth0-lock-error-msg-email',
  emptyPasswordError: '#auth0-lock-error-msg-password',
  wrongCredentialsErrorMsg: '.fadeInUp',
};

const multiSelectors = {};

const open = () => () => browser.url('/');

const logIn = Login => (userRole, loginState, passwordState, appType = DJANGO) => {
  setValue(Login.emailInput(), USERS[camelize(userRole)].login[camelize(loginState)].app[camelize(appType)]);
  setValue(Login.passwordInput(), USERS[camelize(userRole)].password[camelize(passwordState)].enter);
  clickElement(Login.submitBtn());
};

const isEmptyEmailErrorDisplayed = Login => () => isTextDisplayed(Login.emptyEmailError(), LOGIN_PAGE_EMPTY_INPUT_MSG);

const isInvalidEmailErrorDisplayed = Login => () =>
  isTextDisplayed(Login.emptyEmailError(), LOGIN_PAGE_INVALID_INPUT_MSG);

const isWrongCredsErrorDisplayed = Login => () =>
  isTextDisplayed(Login.wrongCredentialsErrorMsg(), AUTH0_WRONG_CREDS_ERROR);

const isEmptyPasswordErrorDisplayed = Login => () =>
  isTextDisplayed(Login.emptyPasswordError(), LOGIN_PAGE_EMPTY_INPUT_MSG);

const validateLoginInputs = Login =>
  cond([
    [both(propEq(LOGIN_STATE, INVALID), propEq(PASSWORD_STATE, INVALID)), isInvalidEmailErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, INVALID), propEq(PASSWORD_STATE, VALID)), isInvalidEmailErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, NOT_EXISTING), propEq(PASSWORD_STATE, INVALID)), isWrongCredsErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, NOT_EXISTING), propEq(PASSWORD_STATE, VALID)), isWrongCredsErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, NOT_EXISTING), propEq(PASSWORD_STATE, EMPTY)), isEmptyPasswordErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, VALID), propEq(PASSWORD_STATE, INVALID)), isWrongCredsErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, VALID), propEq(PASSWORD_STATE, EMPTY)), isEmptyPasswordErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, EMPTY), propEq(PASSWORD_STATE, VALID)), isEmptyEmailErrorDisplayed(Login)],
    [both(propEq(LOGIN_STATE, EMPTY), propEq(PASSWORD_STATE, INVALID)), isEmptyEmailErrorDisplayed(Login)],
    [
      both(propEq(LOGIN_STATE, EMPTY), propEq(PASSWORD_STATE, EMPTY)),
      both(isEmptyEmailErrorDisplayed(Login), isEmptyPasswordErrorDisplayed(Login)),
    ],
    [
      both(propEq(LOGIN_STATE, INVALID), propEq(PASSWORD_STATE, EMPTY)),
      both(isInvalidEmailErrorDisplayed(Login), isEmptyPasswordErrorDisplayed(Login)),
    ],
  ]);

const getFunctions = Login => ({
  open: open(Login),
  logIn: logIn(Login),
  validateLoginInputs: validateLoginInputs(Login),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
