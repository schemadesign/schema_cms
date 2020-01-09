import Page from './page';
import { waitForElement } from '../utils/utils';
import {
  ADMIN,
  EDITOR,
  VALID,
  INVALID,
  EMPTY
} from '../constants/login.constants';

const fs = require('fs');

const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

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

  get changePasswordSuccessMsg() {
    return $('span:nth-child(5) > div > div > p');
  }

  get changePasswordFailMsg() {
    return $('span:nth-child(2) > div > span');
  }

  open() {
    super.open('');
    waitForElement(this, 'loginBtn');
  }

  login(loginState, passwordState) {
    waitForElement(this, 'loginBtn');
    if (loginState === INVALID && passwordState === INVALID) {
      this.username.setValue(creds.invalidLogin);
      this.password.setValue(creds.invalidPassword);
      this.loginBtn.click();
    }

    if (loginState === INVALID && passwordState === VALID) {
      this.username.setValue(creds.invalidLogin);
      this.password.setValue(creds.validPassword);
      this.loginBtn.click();
    }

    if (loginState === VALID && passwordState === INVALID) {
      this.username.setValue(creds.validLogin);
      this.password.setValue(creds.invalidPassword);
      this.loginBtn.click();
    }

    if (loginState === EMPTY && passwordState === EMPTY) {
      this.username.setValue('');
      this.password.setValue('');
      this.loginBtn.click();
    }

    if (loginState === EMPTY && passwordState === VALID) {
      this.username.setValue('');
      this.password.setValue(creds.validPassword);
      this.loginBtn.click();
    }

    if (loginState === VALID && passwordState === EMPTY) {
      this.username.setValue(creds.validLogin);
      this.password.setValue('');
      this.loginBtn.click();
    }
  }

  loginByRole(userRole) {
    waitForElement(this, 'loginBtn');
    if (userRole === ADMIN) {
      this.username.setValue(creds.admin.login);
      this.password.setValue(creds.admin.password);
      this.loginBtn.click();
    }

    if (userRole === EDITOR) {
      this.username.setValue(creds.editor.login);
      this.password.setValue(creds.editor.password);
      this.loginBtn.click();
    }
  }

  loginWithNewPassword() {
    browser.refresh();
    waitForElement(this, 'username');
    this.username.setValue(creds.resetPassword.validEmail);
    this.password.setValue(creds.setNewPassword.newPassword);
    this.loginBtn.click();
    this.updatePasswordsInFile();
  }

  loginWithOldPassword() {
    waitForElement(this, 'username');
    this.username.setValue(creds.resetPassword.validEmail);
    this.password.setValue(creds.resetPassword.oldPassword);
    this.loginBtn.click();
    waitForElement(this, 'wrongCredsError');
  }

  loginWithNewInvalidPassword() {
    waitForElement(this, 'username');
    this.username.setValue(creds.resetPassword.validEmail);
    this.password.setValue(creds.setNewPassword.confirmInvalidPassword);
    this.loginBtn.click();
    waitForElement(this, 'wrongCredsError');
  }

  loginWithGoogle() {
    waitForElement(this, 'loginBtn');
    this.loginWithGoogleBtn.click();
  }

  resetPassword() {
    waitForElement(this, 'forgotPassword');
    this.forgotPassword.click();
    waitForElement(this, 'username');
    this.username.setValue(creds.resetPassword.validEmail);
    this.resetPasswordBtn.click();
  }

  resetPasswordWithInvalidEmail() {
    waitForElement(this, 'forgotPassword');
    this.forgotPassword.click();
    waitForElement(this, 'username');
    this.username.setValue(creds.resetPassword.invalidEmail);
    this.resetPasswordBtn.click();
  }

  setNewPassword() {
    waitForElement(this, 'newPassword');
    this.newPassword.setValue(creds.setNewPassword.newPassword);
    this.confirmNewPassword.setValue(creds.setNewPassword.confirmNewPassword);
    this.submitNewPassword.click();
  }

  setInvalidPassword() {
    waitForElement(this, 'newPassword');
    this.newPassword.setValue(creds.setNewPassword.newPassword);
    this.confirmNewPassword.setValue(
      creds.setNewPassword.confirmInvalidPassword
    );
    this.submitNewPassword.click();
  }

  updatePasswordsInFile() {
    const { oldPassword } = creds.resetPassword;
    const { newPassword } = creds.setNewPassword;
    creds.resetPassword.oldPassword = newPassword;
    creds.setNewPassword.newPassword = oldPassword;
    creds.setNewPassword.confirmNewPassword = oldPassword;
    fs.writeFileSync('creds.json', JSON.stringify(creds, null, 2));
  }
}
export default new LoginPage();
