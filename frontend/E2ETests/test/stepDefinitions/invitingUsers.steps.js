import { Given, When, Then } from 'cucumber';
import fs from 'fs';
import { djangoHomeTitle } from '../constants/django.constants';
import { waitForElement } from '../utils/utils';
import { LINK_SENT, INVITATION_URL } from '../constants/gmail.constants';
import DjangoPage from '../pageobjects/django.page';
import Auth0Page from '../pageobjects/auth0.page';
import GmailPage from '../pageobjects/gmail.page';

const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

Given('I am logged in admin panel', () => {
  DjangoPage.open();
  DjangoPage.login();

  expect(browser.getTitle()).to.equal(djangoHomeTitle);
});

Given('Given Admin invited John Doe', () => {
  DjangoPage.inviteUser('admin');
});

Given('John Doe received an invitation email', () => {
  GmailPage.open();
  GmailPage.login(LINK_SENT);
  GmailPage.searchForInvitationEmail();
  GmailPage.firstUnreadEmail.click();
  waitForElement(GmailPage, 'invitationUrl');

  expect(GmailPage.invitationUrl.getText()).to.equal(INVITATION_URL);
});

When('I invite John Doe to SchemaCMS', () => {
  DjangoPage.inviteUser('admin');
});

When('John Doe uses an invitation email', () => {
  waitForElement(GmailPage, 'invitationUrl');
  GmailPage.invitationUrl.click();
  // TODO: add remaining logic when Mandrillo is configured
});

Then('I can see confirmation that user was added', () => {
  waitForElement(DjangoPage, 'successMsg');

  expect(DjangoPage.successMsg.getText()).to.equal(
    `The user "${DjangoPage.username.getValue()}" was added successfully. You may edit it again below.`
  );
});

Then('John Doe appears in the list of Users', () => {
  waitForElement(DjangoPage, 'saveBtn');
  DjangoPage.saveBtn.click();
  DjangoPage.searchForInvitedUser();
  waitForElement(DjangoPage, 'usersListEmail');

  expect(DjangoPage.usersListEmail.getText()).to.equal(creds.inviteUser.email);
});

Then('John Doe status is set to inactive', () => {
  waitForElement(DjangoPage, 'usersListName');
  DjangoPage.searchForInvitedUser();
  DjangoPage.usersListName.click();

  assert(!DjangoPage.permissionActive.isSelected(), 'Account is set to active');
});

Then('I can see message that user with this email already exists', () => {
  waitForElement(DjangoPage, 'userExistsMsg');

  expect(DjangoPage.userExistsMsg.getText()).to.equal(
    `The user with email "${creds.inviteUser.email}" already exists`
  );
});

Then('John Doe status is set to active in admin panel', () => {
  waitForElement(DjangoPage, 'usersListName');
  DjangoPage.searchForInvitedUser();
  DjangoPage.usersListName.click();

  assert(
    DjangoPage.permissionActive.isSelected(),
    'Account is set to inactive'
  );

  DjangoPage.deleteInvitedUser();
  Auth0Page.deleteInvitedUser();
});
