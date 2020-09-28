import { Given, When, Then } from 'cucumber';
import { camelize } from 'humps';
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
import { ADMIN, ALT, INVITED_ADMIN, RANDOM, VALID } from '../pages/Constants/general.constants';
import { EMAIL_BODY_TEXT, INVITATION_QUERY, URL_REGEX } from '../GmailAPI/gmail.api.constants';
import {
  CHANGE_PASSWORD_HEADER_TEXT,
  CHANGE_PASSWORD_SUCCESSFUL_MESSAGE,
  RESET_PASSWORD_PAGE,
} from '../pages/ResetPassword/resetPassword.constants';
import { USER_STATUS, DJANGO_SUCCESSFUL_INVITATION_MSG } from '../pages/Django/django.constants';

Given('Super Admin is logged in admin panel', () => {
  Django.open();
  Django.logInToDjango();
  expect(browser).toHaveTitle(PAGE_TITLE.djangoHomepage);
  return browser.call(async () => {
    const auth = await getAuth();
    await deleteEmails(auth, INVITATION_QUERY, await getEmails(auth, INVITATION_QUERY));
  });
});

Then('I receive(d) an email with the invitation link', () =>
  browser.call(async () => {
    const auth = await getAuth();
    await waitForEmail(auth, INVITATION_QUERY);
    const emailText = await getEmailText(auth, await getEmailId(auth, INVITATION_QUERY));
    await expect(EMAIL_BODY_TEXT.test(emailText)).toEqual(true);
    const emailLink = await getLinksFromEmail(emailText, URL_REGEX);
    await browser.url(emailLink[0]);
  })
);

When('Super Admin( have) invite(d) me to Schema CMS as an {string}', userRole => {
  Django.hideDebugToolBar();
  Django.inviteUserFromDjango(userRole);
});

When('I set new password as an {string}', userRole => {
  waitForUrl(PAGE_URL[RESET_PASSWORD_PAGE]);
  waitForText(ResetPassword.header(), CHANGE_PASSWORD_HEADER_TEXT);
  ResetPassword.setPassword(camelize(userRole), VALID);
  expect(ResetPassword.successMsg()).toHaveText(CHANGE_PASSWORD_SUCCESSFUL_MESSAGE);
});

Then('Super Admin can see confirmation that I was added as an {string}', role => {
  expect(Django.successMsg()).toHaveText(DJANGO_SUCCESSFUL_INVITATION_MSG(camelize(`invited ${role}`)));
});

Then('I appear in the list of users as an {string}', userRole => {
  clickElement(Django.saveBtn());
  Django.searchForInvitedUser(camelize(`invited ${userRole}`));
  waitForElement(Django.usersListEmail());
  expect(Django.usersListEmail()).toHaveText(USERS[camelize(`invited ${userRole}`)].login.random);
});

Then('my user status as an {string} is set to {string}', (userRole, status) => {
  if (browser.getTitle() !== PAGE_TITLE.djangoSelectUserToChange) {
    Django.open();
  }
  Django.navigateToUsersPage();
  Django.searchForInvitedUser(camelize(`invited ${userRole}`));
  expect(Django.permissionIcon()).toHaveAttribute(ALT, USER_STATUS[status]);
});

Then('I can see message that {string} with this email already exists', userRole => {
  expect(Django.userExistsMsg()).toHaveText(
    `The user with email "${USERS[camelize(userRole)].login.valid}" already exists`
  );
});

Then('I can log in to Schema CMS', () => {
  browser.refresh();
  Login.logIn(INVITED_ADMIN, RANDOM, VALID);
  expectPageToHaveUrl(HOMEPAGE);
  expectPageToHaveTitle(HOMEPAGE);
});
