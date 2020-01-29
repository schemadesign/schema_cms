import { Given, When, Then } from 'cucumber';
import {
  RESET_PAGE,
  CHANGE_PASSWORD_TITLE,
  CHANGE_PASSWORD_MESSAGE,
  CHANGE_PASSWORD_HEADER_TEXT,
} from '../constants/resetPassword.constants';
import { PROJECTS_PAGE_URL } from '../constants/projectsPage.constants';
import { ADMIN, VALID, INVALID, URL_LINK, INVITED } from '../constants/gmail.constants';
import {
  LOGIN_PAGE_TITLE,
  AUTH0_WRONG_CREDS_ERROR,
  AUTH0_EMPTY_INPUT_ERROR,
  RESET_LINK_SENT_MSG,
} from '../constants/login.constants';
import { ASSERT_EMPTY_VALIDATION_MESSAGE } from '../constants/config.constants';
import { clickElement, waitForElement, waitForText, waitForTitle } from '../utils/utils';
import LoginPage from '../pageobjects/login.page';
import ProjectsPage from '../pageobjects/projects.page';
import GmailPage from '../pageobjects/gmail.page';

Given('I am on Login page', () => {
  LoginPage.open();
  waitForTitle(LOGIN_PAGE_TITLE);

  expect(browser.getTitle()).to.equal(LOGIN_PAGE_TITLE);
});

Given('I used reset link sent to me', () => {
  GmailPage.open();
  GmailPage.login(ADMIN, VALID);
  GmailPage.useResetLink();
});

Given('I am on page for creating new password', () => {
  browser.switchWindow(RESET_PAGE);
  waitForText(LoginPage, 'changePasswordHeader', CHANGE_PASSWORD_HEADER_TEXT);

  expect(browser.getTitle()).to.equal(CHANGE_PASSWORD_TITLE);
});

Given('I have logged in as an {word} with {word} login and {word} password', (userRole, loginState, passwordState) => {
  LoginPage.login(userRole, loginState, passwordState);
});

When('I log in as {word} with {word} login and {word} password', (userRole, loginState, passwordState) => {
  LoginPage.login(userRole, loginState, passwordState);
});

When('I log in with {string} login and {string} password', (loginState, passwordState) => {
  LoginPage.login(loginState, passwordState);
});

When('I( have) provide(d) {word} email to recover my password', passwordState => {
  LoginPage.resetPassword(passwordState);
});

When('I provide matching passwords', () => {
  LoginPage.setPassword(VALID);
});

When("I provide passwords that don't match", () => {
  LoginPage.setPassword(INVALID);
});

Then('I am informed about invalid login or password', () => {
  waitForElement(LoginPage, 'wrongCredsError');

  assert(LoginPage.wrongCredsError.isDisplayed(), ASSERT_EMPTY_VALIDATION_MESSAGE);
  expect(LoginPage.wrongCredsError.getText()).to.equal(AUTH0_WRONG_CREDS_ERROR);
});

Then('I am informed about empty login and password', () => {
  assert(LoginPage.emptyLoginError.isDisplayed(), ASSERT_EMPTY_VALIDATION_MESSAGE);
  assert(LoginPage.emptyPasswordError.isDisplayed(), ASSERT_EMPTY_VALIDATION_MESSAGE);
  expect(LoginPage.emptyLoginError.getText()).to.equal(AUTH0_EMPTY_INPUT_ERROR);
  expect(LoginPage.emptyPasswordError.getText()).to.equal(AUTH0_EMPTY_INPUT_ERROR);
});

Then('I am informed about empty login', () => {
  assert(LoginPage.emptyLoginError.isDisplayed(), ASSERT_EMPTY_VALIDATION_MESSAGE);
  expect(LoginPage.emptyLoginError.getText()).to.equal(AUTH0_EMPTY_INPUT_ERROR);
});

Then('I am informed about empty password', () => {
  assert(LoginPage.emptyPasswordError.isDisplayed(), ASSERT_EMPTY_VALIDATION_MESSAGE);
  expect(LoginPage.emptyPasswordError.getText()).to.equal(AUTH0_EMPTY_INPUT_ERROR);
});

Then('I am informed that reset link was sent to me', () => {
  waitForElement(LoginPage, 'successMsg');

  expect(LoginPage.successMsg.getText()).to.equal(RESET_LINK_SENT_MSG);
});

Then(/^(I|invited user) receive(d)* an email with the (reset|invitation) link$/, function(arg1, arg2, emailType) {
  GmailPage.open();
  GmailPage.login(ADMIN, VALID);
  GmailPage.searchForEmail(emailType);
  clickElement(GmailPage, 'firstUnreadEmail');
  waitForElement(GmailPage, `${emailType}Url`);

  expect(`GmailPage.${emailType}Url.getText()`).to.match(URL_LINK[emailType]);
});

Then(/^I am informed that my new password is( not)* created$/, function(messageType) {
  expect(`LoginPage.resetPassword${messageType}CreatedMsg.getText()`).to.equal(CHANGE_PASSWORD_MESSAGE[messageType]);
});

Then('I am able to log in using new password', () => {
  LoginPage.open();
  LoginPage.login(INVITED, VALID, VALID);
  waitForElement(ProjectsPage, 'addProjectBtn');

  expect(browser.getUrl()).to.equal(PROJECTS_PAGE_URL);
});

Then("I don't receive an email with the reset link", () => {
  GmailPage.open();
  GmailPage.login(ADMIN, INVALID);

  assert(GmailPage.firstEmail.getText() !== 'Reset your password', 'Reset email was found in mailbox');
});

Then('the new password is not created', () => {
  LoginPage.open();
  waitForElement(LoginPage, 'loginBtn');
  LoginPage.loginWithPassword(INVALID);

  expect(LoginPage.wrongCredsError.getText()).to.equal(AUTH0_WRONG_CREDS_ERROR);
});
