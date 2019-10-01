import { Given, When, Then, After } from 'cucumber';
import { RESET_PAGE, CHANGE_PASSWORD_TITLE, CHANGE_PASSWORD_SUCCESS_MSG, PASSWORDS_NOT_MATCH_MSG } from './../constants/resetPassword.constants.js';
import { PROJECTS_PAGE } from './../constants/homepage.constants.js';
import { LINK_SENT, LINK_NOT_SENT, RESET_URL } from './../constants/gmail.constants.js';
import { LOGIN_PAGE_TITLE, AUTH0_WRONG_CREDS_ERROR, AUTH0_EMPTY_INPUT_ERROR, RESET_LINK_SENT_MSG } from './../constants/login.constants.js';
import { ASSERT_EMPTY_VALIDATION_MESSAGE } from './../constants/config.constants.js';
import { djangoHomeTitle } from './../constants/django.constants.js';
import { waitForElement, waitForText } from './../utils/utils.js';
import LoginPage from './../pageobjects/login.page.js';
import ProjectsPage from './../pageobjects/projects.page.js';
import GmailPage from './../pageobjects/gmail.page.js';
import DjangoPage from './../pageobjects/django.page.js';
import fs from 'fs';
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));


After(() => {
    browser.reloadSession();
});

Given('I am on Login page', () => {
    LoginPage.open();

    expect(browser.getTitle()).to.equal(LOGIN_PAGE_TITLE);
});

Given('I provided valid email to recover my password', () => {
    LoginPage.resetPassword();
});

Given('I used reset link sent to me', () => {
    GmailPage.open();
    GmailPage.login(LINK_SENT);
    GmailPage.useResetLink();
});

Given('I am on page for creating new password', () => {
    browser.switchWindow(RESET_PAGE);
    waitForText(LoginPage, 'changePasswordHeader', 'Change Password');

    expect(browser.getTitle()).to.equal(CHANGE_PASSWORD_TITLE);
});

Given('I have logged in as an {string}', (userRole) => {
    LoginPage.loginByRole(userRole);
});


When('I log in as {string} with valid login and password', (userRole) => {
    LoginPage.loginByRole(userRole);
});

When('I log in with {string} login and {string} password', (loginState, passwordState) => {
    LoginPage.login(loginState, passwordState);
});

When('I provide valid email to recover my password', () => {
    LoginPage.resetPassword();
});

When('I provide invalid email to recover my password', () => {
    LoginPage.resetPasswordWithInvalidEmail();
});

When('I provide matching passwords', () => {
    LoginPage.setNewPassword();
});

When('I provide passwords that don\'t match', () => {
    LoginPage.setInvalidPassword();
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

Then('I receive an email with the reset link', () => {
    GmailPage.open();
    GmailPage.login(LINK_SENT);
    GmailPage.firstEmail.click();

    expect(GmailPage.resetUrl.getText()).to.match(RESET_URL);

    GmailPage.deleteResetEmail();
});

Then('I am informed that my new password is created', () => {
    expect(LoginPage.changePasswordSuccessMsg.getText()).to.equal
    (CHANGE_PASSWORD_SUCCESS_MSG);
});

Then('I am able to log in using new password', () => {
    LoginPage.loginWithNewPassword();
    waitForElement(ProjectsPage, 'addProjectBtn');

    expect(browser.getUrl()).to.equal(PROJECTS_PAGE);

    GmailPage.deleteResetEmail();
});

Then('I am informed that my new password wasn\'t created', () => {
    waitForElement(LoginPage, 'changePasswordFailMsg');
    
    expect(LoginPage.changePasswordFailMsg.getText()).to.equal
    (PASSWORDS_NOT_MATCH_MSG);
});

Then('I don\'t receive an email with the reset link', () => {
    GmailPage.open();
    GmailPage.login(LINK_NOT_SENT);

    assert(GmailPage.firstEmail.getText() !== 'Reset your password', 'Reset email was found in mailbox');
});

Then('the new password is not created', () => {
    LoginPage.open();
    waitForElement(LoginPage, 'loginBtn');
    LoginPage.loginWithNewInvalidPassword();

    expect(LoginPage.wrongCredsError.getText()).to.equal(AUTH0_WRONG_CREDS_ERROR);
    
    GmailPage.deleteResetEmail();
});

Then('I am not able to log in using old password', () => {
    waitForElement(LoginPage, 'loginBtn');
    LoginPage.loginWithOldPassword();

    assert(LoginPage.wrongCredsError.isDisplayed(), ASSERT_EMPTY_VALIDATION_MESSAGE);
    expect(LoginPage.wrongCredsError.getText()).to.equal(AUTH0_WRONG_CREDS_ERROR);
});

