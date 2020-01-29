import { Given, When, Then } from 'cucumber';
import { djangoHomeTitle, USER_STATUS, SELECT_USER_TO_CHANGE_PAGE_TITLE } from '../constants/django.constants';
import { USERS } from '../constants/credentials.constants';
import { clickElement, waitForElement, waitForText } from '../utils/utils';
import { ADMIN, VALID, INVITED, INVITE, URL_LINK, RANDOM } from '../constants/gmail.constants';
import DjangoPage from '../pageobjects/django.page';
import GmailPage from '../pageobjects/gmail.page';
import { CHANGE_PASSWORD_HEADER_TEXT, CHANGE_PASSWORD_MESSAGE, RESET_PAGE } from '../constants/resetPassword.constants';
import LoginPage from '../pageobjects/login.page';
import ProjectsPage from '../pageobjects/projects.page';
import { PROJECTS_PAGE_URL } from '../constants/projectsPage.constants';

Given('I am logged in admin panel', () => {
  DjangoPage.open();
  DjangoPage.login();

  expect(browser.getTitle()).to.equal(djangoHomeTitle);
});

Given('Given Admin invited John Doe', () => {
  DjangoPage.inviteUser('admin');
});

Given('invited user received invitation email', () => {
  GmailPage.open();
  GmailPage.login(ADMIN, VALID);
  GmailPage.searchForEmail(INVITE);
  clickElement(GmailPage, 'firstUnreadEmail');
  waitForElement(GmailPage, 'invitationUrl');

  expect(GmailPage.invitationUrl.getText()).to.match(URL_LINK.invitation);
});

When('I( have) invite(d) new user to SchemaCMS', () => {
  DjangoPage.inviteUser('admin');
});

When('I invite existing user to SchemaCMS', () => {
  DjangoPage.inviteUser('admin', USERS.existing.login.valid);
});

When('invited user sets new password', () => {
  clickElement(GmailPage, 'invitationUrl');
  browser.switchWindow(RESET_PAGE);
  waitForText(LoginPage, 'changePasswordHeader', CHANGE_PASSWORD_HEADER_TEXT);
  LoginPage.setPassword(VALID);
  expect(LoginPage.resetPasswordCreatedMsg.getText()).to.equal(CHANGE_PASSWORD_MESSAGE.created);
});

Then('I can see confirmation that user was added', () => {
  waitForElement(DjangoPage, 'successMsg');
  waitForElement(DjangoPage, 'username');

  expect(DjangoPage.successMsg.getText()).to.equal(
    `The user "${DjangoPage.username.getValue()}" was added successfully. You may edit it again below.`
  );
});

Then('invited user appears in the list of Users', () => {
  waitForElement(DjangoPage, 'saveBtn');
  DjangoPage.saveBtn.click();
  DjangoPage.searchForInvitedUser();
  waitForElement(DjangoPage, 'usersListEmail');

  expect(DjangoPage.usersListEmail.getText()).to.equal(USERS.invited.login.random);
});

Then('invited user status is set to {word}', status => {
  if (browser.getTitle() !== SELECT_USER_TO_CHANGE_PAGE_TITLE) {
    DjangoPage.open();
  }

  DjangoPage.goToUsers();
  waitForElement(DjangoPage, 'usersListName');
  DjangoPage.searchForInvitedUser();

  assert(DjangoPage.permissionIcon.getAttribute('alt') === USER_STATUS[status], `Account is not set to ${status}`);
});

Then('I can see message that user with this email already exists', () => {
  waitForElement(DjangoPage, 'userExistsMsg');

  expect(DjangoPage.userExistsMsg.getText()).to.equal(
    `The user with email "${USERS.existing.login.valid}" already exists`
  );
});
Then(/^invited user can log in to SchemaCMS$/, function() {
  browser.refresh();
  LoginPage.login(INVITED, RANDOM, VALID);
  waitForElement(ProjectsPage, 'addProjectBtn');

  expect(browser.getUrl()).to.equal(PROJECTS_PAGE_URL);
});
