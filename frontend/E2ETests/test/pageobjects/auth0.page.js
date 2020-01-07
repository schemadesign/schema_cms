import fs from 'fs';
import Page from './page';
import GmailPage from './gmail.page';
import { AUTH0_LOGIN_PAGE, AUTH0_USERS } from '../constants/auth0.constants';
import { clickElement, waitForElement, waitForText } from '../utils/utils';

const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

class Auth0Page extends Page {
  get loginWithGoogle() {
    return $('.auth0-lock-social-buttons-container > button:nth-child(2)');
  }

  get dashboard() {
    return $('#manhattan > div');
  }

  get searchInput() {
    return $('[placeholder="Search for users"]');
  }

  get menuBtn() {
    return $('tr > td > div > button');
  }

  get deleteUserBtn() {
    return $('tr > td > div > div > ul > li:last-child');
  }

  get confirmDeleteUserBtn() {
    return $('footer > div > span:first-child');
  }

  get user() {
    return $('td > div > div:nth-child(2) > div > div:nth-child(1) > a > span');
  }

  open() {
    browser.url(AUTH0_LOGIN_PAGE);
  }

  login() {
    clickElement(this, 'loginWithGoogle');
    waitForElement(GmailPage, 'email');
    GmailPage.email.setValue(creds.auth0.email);
    clickElement(GmailPage, 'emailNextBtn');
    waitForElement(GmailPage, 'password');
    GmailPage.password.setValue(creds.auth0.password);
    clickElement(GmailPage, 'passwordNextBtn');
    waitForElement(this, 'dashboard');
  }

  goToUsers() {
    browser.url(AUTH0_USERS);
  }

  searchForInvitedUser() {
    waitForElement(this, 'searchInput');
    this.searchInput.setValue(creds.inviteUser.email);
    browser.keys('\uE007');
    waitForText(this, 'user', `${creds.inviteUser.email}`);
  }

  deleteInvitedUser() {
    this.open();
    this.login();
    this.goToUsers();
    this.searchForInvitedUser();
    clickElement(this, 'menuBtn');
    clickElement(this, 'deleteUserBtn');
    clickElement(this, 'confirmDeleteUserBtn');
  }
}
export default new Auth0Page();
