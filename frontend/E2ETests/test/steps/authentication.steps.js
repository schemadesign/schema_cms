import { Given, When, Then } from 'cucumber';
import { camelize } from 'humps';
import Login from '../pages/Login/login.page';
import ResetPassword from '../pages/ResetPassword/resetPassword.page';
import Profile from '../pages/Profile/profile.page';
import TopHeader from '../pages/Components/TopHeader/topHeader.component';
import PAGE_URL from '../pages/Constants/pageURL.constants';
import { AUTH0_WRONG_CREDS_ERROR, LOGIN_PAGE } from '../pages/Login/loginPage.constants';
import { RESET_PASSWORD_QUERY, URL_REGEX } from '../GmailAPI/gmail.api.constants';
import { INVALID, INVITED, RANDOM, RESET, VALID } from '../pages/Constants/general.constants';
import { USERS } from '../pages/Constants/credentials.constants';
import { HOMEPAGE } from '../pages/Homepage/homepage.constants';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../helpers/expect';
import {
  deleteEmails,
  getAuth,
  getEmailId,
  getEmails,
  getEmailText,
  getLinksFromEmail,
  waitForEmail,
} from '../GmailAPI/gmail.api';
import {
  CHANGE_PASSWORD_SUCCESSFUL_MESSAGE,
  CHANGE_PASSWORD_ERROR_MSG,
} from '../pages/ResetPassword/resetPassword.constants';
import { clickElement } from '../helpers/actions';

Given('I am on Login page', () => {
  Login.open();
  expectPageToHaveTitle(LOGIN_PAGE);
  expectPageToHaveUrl(LOGIN_PAGE);
});

Given('I used reset link sent to me', () =>
  browser.call(async () => {
    const auth = await getAuth();
    await waitForEmail(auth, RESET_PASSWORD_QUERY);
    const emailText = await getEmailText(auth, await getEmailId(auth, RESET_PASSWORD_QUERY));
    const emailLink = await getLinksFromEmail(emailText, URL_REGEX);
    await browser.url(emailLink[0]);
  })
);

Given(
  'I( have) log(ged) in as an {string} user with {string} login and {string} password',
  (userRole, loginState, passwordState) => {
    Login.logIn(camelize(userRole), camelize(loginState), passwordState);
  }
);

Given('I have logged out', () => {
  TopHeader.logOut();
});

When('I( have) provide(d) {string} email to recover my password', passwordState => {
  browser.call(async () => {
    const auth = await getAuth();
    await deleteEmails(auth, RESET_PASSWORD_QUERY, await getEmails(auth, RESET_PASSWORD_QUERY));
  });

  ResetPassword.resetPassword(RESET, passwordState);
});

When('I provide matching passwords', () => {
  browser.refresh();
  ResetPassword.setPassword(RESET, VALID);
});

When("I provide passwords that don't match", () => {
  ResetPassword.setPassword(RESET, INVALID);
});

Then('I am not logged in', () => {
  expectPageToHaveUrl(LOGIN_PAGE);
  expectPageToHaveTitle(LOGIN_PAGE);
  expect(browser.getUrl()).not.toMatch(PAGE_URL[HOMEPAGE]);
});

Then('I am informed that my new password is created', () => {
  expect(ResetPassword.successMsg()).toHaveText(CHANGE_PASSWORD_SUCCESSFUL_MESSAGE);
});

Then('I am informed that my new password is not created', () => {
  expect(ResetPassword.errorMsg()).toHaveText(CHANGE_PASSWORD_ERROR_MSG);
});

Then('I am able to log in using {string} password', passwordType => {
  Login.open();
  Login.logIn(passwordType, VALID, VALID);
  expectPageToHaveUrl(HOMEPAGE);
  expectPageToHaveTitle(HOMEPAGE);
});

Then('the new password is not created', () => {
  Login.open();
  Login.logIn(RESET, VALID, INVALID);

  expect(Login.wrongCredentialsErrorMsg()).toHaveText(AUTH0_WRONG_CREDS_ERROR);
});

Then('I see that login is {string} and password is {string}', (loginState, passwordState) => {
  Login.validateLoginInputs({ loginState, passwordState });
});

Then(
  'my personal information as an {string} {string} from/in {string} is displayed in the profile',
  (userRole, userType, appType) => {
    const combinedUserRole = camelize(`${userType} ${userRole}`);
    TopHeader.openProfile();

    expect(Profile.lastNameValue()).toHaveValue(USERS[combinedUserRole].lastName.valid.app[camelize(appType)]);

    expect(Profile.firstNameValue()).toHaveValue(USERS[combinedUserRole].firstName.valid.app[camelize(appType)]);

    expect(Profile.emailValue()).toHaveValue(
      USERS[combinedUserRole].login[combinedUserRole.includes(INVITED) ? RANDOM : VALID].app[camelize(appType)]
    );

    expect(Profile.roleValue()).toHaveValue(userRole.split(' ').pop());
    clickElement(TopHeader.logo());
  }
);
