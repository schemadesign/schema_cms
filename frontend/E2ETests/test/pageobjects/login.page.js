import Page from './page';
import { setValue, clickElement } from '../utils/utils';
import { USERS, RESET_PASSWORD } from '../constants/credentials.constants';

class LoginPage extends Page {
  get username() {
    return $('#\\31-email');
  }

  get password() {
    return $('.auth0-lock-input-show-password input');
  }

  get forgotPassword() {
    return $('.auth0-lock-alternative-link');
  }

  get loginBtn() {
    return $('.auth0-lock-submit > span');
  }

  get loginWithGoogleBtn() {
    return $('auth0-lock-social-Btn');
  }

  get emptyLoginError() {
    return $('#auth0-lock-error-msg-email');
  }

  get emptyPasswordError() {
    return $('#auth0-lock-error-msg-password');
  }

  get wrongCredsError() {
    return $('.fadeInUp span');
  }

  get resetPasswordHeader() {
    return $("[title='Reset your password']");
  }

  get resetPasswordBtn() {
    return $("[aria-label='Send email']");
  }

  get successMsg() {
    return $('.auth0-global-message-success');
  }

  get newPassword() {
    return $('[placeholder="your new password"]');
  }

  get confirmNewPassword() {
    return $("[placeholder='confirm your new password']");
  }

  get submitNewPassword() {
    return $("[type='submit']");
  }

  get changePasswordHeader() {
    return $('.auth0-lock-name');
  }

  get resetPasswordCreatedMsg() {
    return $('span:nth-child(5) > div > div > p');
  }

  get resetPasswordNotCreatedMsg() {
    return $('span:nth-child(2) > div > span');
  }

  open() {
    super.open('');
  }

  login(userRole, loginState, passwordState) {
    setValue(this, 'username', USERS[userRole].login[loginState]);
    setValue(this, 'password', USERS[userRole].password[passwordState].enter);
    clickElement(this, 'loginBtn');
  }

  loginWithPassword(passwordType) {
    setValue(this, 'username', RESET_PASSWORD.email.valid);
    setValue(this, 'password', RESET_PASSWORD.password[passwordType].enter);
    clickElement(this, 'loginBtn');
  }

  resetPassword(emailType) {
    clickElement(this, 'forgotPassword');
    setValue(this, 'username', RESET_PASSWORD.email[emailType]);
    clickElement(this, 'resetPasswordBtn');
  }

  setPassword(passwordType) {
    setValue(this, 'newPassword', USERS.invited.password[passwordType].enter);
    setValue(
      this,
      'confirmNewPassword',
      USERS.invited.password[passwordType].confirm
    );
    clickElement(this, 'submitNewPassword');
  }
}
export default new LoginPage();
