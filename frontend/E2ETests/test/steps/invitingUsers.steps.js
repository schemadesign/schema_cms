import { Given, When, Then } from 'cucumber';
import { camelize } from 'humps';
import Django from '../pages/Django/django.page';
import Login from '../pages/Login/login.page';
import ResetPassword from '../pages/ResetPassword/resetPassword.page';
import Users from '../pages/UsersPage/users.page';
import TopHeader from '../pages/Components/TopHeader/topHeader.component';
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
import { ALT, INVITED_ADMIN, RANDOM, VALID } from '../pages/Constants/general.constants';
import { EMAIL_BODY_TEXT, INVITATION_QUERY, URL_REGEX } from '../GmailAPI/gmail.api.constants';
import {
  CHANGE_PASSWORD_HEADER_TEXT,
  CHANGE_PASSWORD_SUCCESSFUL_MESSAGE,
  RESET_PASSWORD_PAGE,
} from '../pages/ResetPassword/resetPassword.constants';
import { USER_STATUS, DJANGO_SUCCESSFUL_INVITATION_MSG, DJANGO } from '../pages/Django/django.constants';
import { USER_EXISTS_ERROR } from '../pages/UsersPage/users.constants';

Given('django admin is logged in admin panel', () => {
  Django.open();
  Django.logInToDjango();
  expect(browser).toHaveTitle(PAGE_TITLE.djangoHomepage);

  return browser.call(async () => {
    const auth = await getAuth();
    await deleteEmails(auth, INVITATION_QUERY, await getEmails(auth, INVITATION_QUERY));
  });
});

Then('I receive(d) an email with the invitation link', () => {
  TopHeader.logOut();

  return browser.call(async () => {
    const auth = await getAuth();
    await waitForEmail(auth, INVITATION_QUERY);
    const emailText = await getEmailText(auth, await getEmailId(auth, INVITATION_QUERY));
    await expect(EMAIL_BODY_TEXT.test(emailText)).toEqual(true);
    const emailLink = await getLinksFromEmail(emailText, URL_REGEX);
    await browser.url(emailLink[0]);
  });
});

When('{string} admin invites me to Schema CMS as an {string}', (appType, userRole) => {
  return appType === DJANGO ? Django.inviteUserFromDjango(userRole) : Users.inviteUserFromApp(userRole, appType);
});

When('I set new password as an {string}', userRole => {
  waitForUrl(PAGE_URL[RESET_PASSWORD_PAGE]);
  waitForText(ResetPassword.header(), CHANGE_PASSWORD_HEADER_TEXT);
  ResetPassword.setPassword(camelize(userRole), VALID);
  expect(ResetPassword.successMsg()).toHaveText(CHANGE_PASSWORD_SUCCESSFUL_MESSAGE);

  return browser.call(async () => {
    const auth = await getAuth();
    await deleteEmails(auth, INVITATION_QUERY, await getEmails(auth, INVITATION_QUERY));
  });
});

Given('django admin can see confirmation that I was added as an {string}', role => {
  expect(Django.successMsg()).toHaveText(DJANGO_SUCCESSFUL_INVITATION_MSG(camelize(`invited ${role}`)));
});

Then('I appear in the list of users as an {string}', userRole => {
  clickElement(Django.saveBtn());
  Django.searchForInvitedUser(camelize(`invited ${userRole}`));
  waitForElement(Django.usersListEmail());
  expect(Django.usersListEmail()).toHaveText(USERS[camelize(`invited ${userRole}`)].login.random.app.django);
});

Then('my user status as an {string} is set to {string}', (userRole, status) => {
  if (browser.getTitle() !== PAGE_TITLE.djangoSelectUserToChange) {
    Django.open();
  }
  Django.navigateToUsersPage();
  Django.searchForInvitedUser(camelize(`invited ${userRole}`));
  expect(Django.permissionIcon()).toHaveAttribute(ALT, USER_STATUS[status]);
});

Then('I/Admin can see a message in {string} that {string} with this email already exists', (appType, userRole) => {
  expect(Django.userExistsMsg()).toHaveText(
    `The user with email ${USERS[camelize(userRole)].login.valid.app[camelize(appType)]} already exists.`
  );
});

Then('Admin can see a message in Schema CMS that user with this email already exists', () => {
  expect(Users.emailErrorText()).toHaveText(USER_EXISTS_ERROR);
});

Then('I can log in to Schema CMS as an {string} {string} from {string}', (userRole, userType, appType) => {
  browser.refresh();
  Login.logIn(camelize(`${userType} ${userRole}`), RANDOM, VALID, camelize(appType));
  expectPageToHaveUrl(HOMEPAGE);
  expectPageToHaveTitle(HOMEPAGE);
});

Given('I was/am invited to Schema CMS as an {string} by {string} admin', (userRole, appType) => {
  browser.call(async () => {
    const auth = await getAuth();
    await deleteEmails(auth, INVITATION_QUERY, await getEmails(auth, INVITATION_QUERY));
  });

  Users.inviteUserFromApp(userRole, appType);
  TopHeader.logOut();
});

When(
  '{string} admin leaves first name {string}, last name {string} and email {string}',
  (appType, firstNameState, lastNameState, emailState) => {
    Users.inviteUserFromApp(INVITED_ADMIN, appType, firstNameState, lastNameState, emailState);
  }
);

Then('first name is {string}', firstNameState => {
  Users.validateUserInputs({ firstNameState });
});

Then('last name is {string}', lastNameState => {
  Users.validateUserInputs({ lastNameState });
});

Then('email is {string}', emailState => {
  Users.validateUserInputs({ emailState });
});

Then('Invite button is inactive', () => {
  expect(Users.inviteBtn()).toBeDisabled();
});
