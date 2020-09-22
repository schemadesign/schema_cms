import { createSelectors } from '../../helpers/utils';
import { clickElement, setValue } from '../../helpers/actions';
import { USERS } from '../Constants/credentials.constants';
import { DJANGO } from '../Django/django.constants';

const singleSelectors = {
  resetLink: '.auth0-lock-alternative',
  emailInput: '[name="email"]',
  header: '.auth0-lock-name',
  passwordInput: '[placeholder="your new password"]',
  confirmPasswordInput: '[placeholder="confirm your new password"]',
  submitBtn: '.auth0-lock-submit',
  successMsg: '.auth0-lock-confirmation-content p',
  errorMsg: '.fadeInUp',
};

const multiSelectors = {};

const resetPassword = ResetPassword => (userRole, emailType, appType = DJANGO) => {
  clickElement(ResetPassword.resetLink());
  setValue(ResetPassword.emailInput(), USERS[userRole].login[emailType].app[appType]);
  clickElement(ResetPassword.submitBtn());
};

const setPassword = ResetPassword => (userRole, passwordType) => {
  setValue(ResetPassword.passwordInput(), USERS[userRole].password[passwordType].enter);
  setValue(ResetPassword.confirmPasswordInput(), USERS[userRole].password[passwordType].confirm);
  clickElement(ResetPassword.submitBtn());
};

const getFunctions = ResetPassword => ({
  resetPassword: resetPassword(ResetPassword),
  setPassword: setPassword(ResetPassword),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
