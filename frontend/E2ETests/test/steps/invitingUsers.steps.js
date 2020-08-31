import { Given, When, Then } from 'cucumber';
import Django from '../pages/Django/django.page';
import Login from '../pages/Login/login.page';
import ResetPassword from '../pages/ResetPassword/resetPassword.page';
import PAGE_URL from '../pages/Constants/pageURL.constants';
import { clickElement } from '../helpers/actions';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../helpers/expect';
import { waitForElement, waitForText, waitForUrl } from '../helpers/waitFor';
import {
  deleteEmails,
  getAuth,
  getEmailId,
  getEmails,
  getEmailText,
  getLinksFromEmail,
  waitForEmail,
} from '../GmailAPI/gmail.api';
import PAGE_TITLE from '../pages/Constants/pageTitle.constants';
import { USERS } from '../pages/Constants/credentials.constants';
import { HOMEPAGE } from '../pages/Homepage/homepage.constants';
import { ALT, INVITED, RANDOM, VALID } from '../pages/Constants/general.constants';
import { EMAIL_BODY_TEXT, INVITATION_QUERY, URL_REGEX } from '../GmailAPI/gmail.api.constants';
import {
  CHANGE_PASSWORD_HEADER_TEXT,
  CHANGE_PASSWORD_SUCCESSFUL_MESSAGE,
  RESET_PASSWORD_PAGE,
} from '../pages/ResetPassword/resetPassword.constants';
import { USER_STATUS, DJANGO_SUCCESSFUL_INVITATION_MSG, DJANGO_ADMIN_ROLE } from '../pages/Django/django.constants';

Given('I am logged in admin panel', () => {
  Django.open();
  Django.logInToDjango();

  expect(browser).toHaveTitle(PAGE_TITLE.djangoHomepage);
});

Then('invited user receive(d) an email with the invitation link', () => {
  browser.call(async () => {
    const auth = await getAuth();
    await waitForEmail(auth, INVITATION_QUERY);
    const emailText = await getEmailText(auth, await getEmailId(auth, INVITATION_QUERY));
    await expect(EMAIL_BODY_TEXT.test(emailText)).toEqual(true);
  });
});

When('I( have) invite(d) new user to Schema CMS', () => {
  browser.call(async () => {
    const auth = await getAuth();
    await deleteEmails(auth, INVITATION_QUERY, await getEmails(auth, INVITATION_QUERY));
  });
  Django.inviteUserFromDjango(DJANGO_ADMIN_ROLE);
});

When('I invite existing user to Schema CMS', () => {
  Django.inviteUserFromDjango(DJANGO_ADMIN_ROLE, USERS.existing.login.valid);
});

When('invited user sets new password', () => {
  browser.call(async () => {
    const auth = await getAuth();
    await waitForEmail(auth, INVITATION_QUERY);
    const emailText = await getEmailText(auth, await getEmailId(auth, INVITATION_QUERY));
    const emailLink = await getLinksFromEmail(emailText, URL_REGEX);
    await browser.url(emailLink[0]);
  });
  waitForUrl(PAGE_URL[RESET_PASSWORD_PAGE]);
  waitForText(ResetPassword.header(), CHANGE_PASSWORD_HEADER_TEXT);
  ResetPassword.setPassword(INVITED, VALID);
  expect(ResetPassword.successMsg()).toHaveText(CHANGE_PASSWORD_SUCCESSFUL_MESSAGE);
});

Then('I can see confirmation that user was added', () => {
  expect(Django.successMsg()).toHaveText(DJANGO_SUCCESSFUL_INVITATION_MSG);
});

Then('invited user appears in the list of Users', () => {
  clickElement(Django.saveBtn());
  Django.searchForInvitedUser();
  waitForElement(Django.usersListEmail());
  expect(Django.usersListEmail()).toHaveText(USERS.invited.login.random);
});

Then('invited user status is set to {string}', status => {
  if (browser.getTitle() !== PAGE_TITLE.djangoSelectUserToChange) {
    Django.open();
  }
  Django.navigateToUsersPage();
  Django.searchForInvitedUser();
  expect(Django.permissionIcon()).toHaveAttribute(ALT, USER_STATUS[status]);
});

Then('I can see message that user with this email already exists', () => {
  expect(Django.userExistsMsg()).toHaveText(`The user with email "${USERS.existing.login.valid}" already exists`);
});
Then(/^invited user can log in to Schema CMS$/, () => {
  browser.refresh();
  Login.logIn(INVITED, RANDOM, VALID);
  expectPageToHaveUrl(HOMEPAGE);
  expectPageToHaveTitle(HOMEPAGE);
});
