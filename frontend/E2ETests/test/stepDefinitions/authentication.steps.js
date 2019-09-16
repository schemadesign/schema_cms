import { Given } from 'cucumber';
import { When } from 'cucumber';
import { Then } from 'cucumber';
import { After } from 'cucumber';
import LoginPage from './../pageobjects/login.page.js';
import ProjectsPage from './../pageobjects/projects.page.js';
import GmailPage from './../pageobjects/gmail.page.js';

After(function() {
    browser.reloadSession();
});

Given('I am on Login page', function () {
    LoginPage.open();
    LoginPage.waitForLoginPageToLoad();
    
    expect(browser.getTitle()).to.equal('Sign In with Auth0');
});

Given('I provided valid email to recover my password', function() {
    LoginPage.resetPassword();
});

Given('I used reset link sent to me', function() {
    GmailPage.open();
    GmailPage.login();
    GmailPage.useResetLink();
});

Given('I am on page for creating new password', function() {
    LoginPage.waitForChangePasswordToLoad();

    expect(browser.getTitle()).to.equal('Change your password');
});


When('I log in as {string} with valid login and password', function (userRole) {
    LoginPage.loginByRole(userRole);
});

When('I log in with {string} login and {string} password', function (loginState, passwordState) {
    LoginPage.login(loginState, passwordState);
});

When('I provide valid email to recover my password', function() {
    LoginPage.resetPassword();
});

When('I provide invalid email to recover my password', function() {
    LoginPage.resetPasswordWithInvalidEmail();
});

When('I provide matching passwords', function() {
    LoginPage.setNewPassword();
});

When('I provide passwords that don\'t match', function() {
    LoginPage.setInvalidPassword();
});

Then('I am on Projects page', function () {
    ProjectsPage.waitForProjectsPageToLoad();

    expect(browser.getUrl()).to.equal('http://localhost:3000/project/list'); 
});

Then('I am informed about invalid login or password', function () {
    LoginPage.waitForCredsErrorToLoad();
    
    assert(LoginPage.wrongCredsError.isDisplayed(), 'Validation message is not displayed');
    expect(LoginPage.wrongCredsError.getText()).to.equal('WRONG EMAIL OR PASSWORD.');
});

Then('I am informed about empty login and password', function () {
    assert(LoginPage.emptyLoginError.isDisplayed(), 'Validation message is not displayed');
    assert(LoginPage.emptyPasswordError.isDisplayed(), 'Validation message is not displayed');
    expect(LoginPage.emptyLoginError.getText()).to.equal('Can\'t be blank');
    expect(LoginPage.emptyPasswordError.getText()).to.equal('Can\'t be blank');
});

Then('I am informed about empty login', function () {
    assert(LoginPage.emptyLoginError.isDisplayed(), 'Validation message is not displayed');
    expect(LoginPage.emptyLoginError.getText()).to.equal('Can\'t be blank');
});

Then('I am informed about empty password', function () {
    assert(LoginPage.emptyPasswordError.isDisplayed(), 'Validation message is not displayed');
    expect(LoginPage.emptyPasswordError.getText()).to.equal('Can\'t be blank');
});

Then('I am informed that reset link was sent to me', function() {
    LoginPage.waitForSuccessMsgToLoad();
    
    expect(LoginPage.successMsg.getText()).to.equal
    ('WE\'VE JUST SENT YOU AN EMAIL TO RESET YOUR PASSWORD.');
});

Then('I receive an email with the reset link', function() {
    GmailPage.open();
    GmailPage.login();
    GmailPage.firstEmail.click();

    expect(GmailPage.resetUrl.getText()).to.match(/schemadesign.auth0.com\/lo\/reset/);

    GmailPage.deleteResetEmail();
});

Then('I am informed that my new password is created', function() {
    expect(LoginPage.changePasswordSuccessMsg.getText()).to.equal
    ('Your password has been reset successfully.');
});

Then('I am able to log in using new password', function() {
    LoginPage.loginWithNewPassword();
    ProjectsPage.waitForProjectsPageToLoad();

    expect(browser.getUrl()).to.equal('http://localhost:3000/project/list');

    GmailPage.deleteResetEmail();
});

Then('I am informed that my new password wasn\'t created', function() {
    LoginPage.waitForChangePasswordFailMsgToLoad();
    
    expect(LoginPage.changePasswordFailMsg.getText()).to.equal
    ('Please ensure the password and the confirmation are the same.');
});

Then('I don\'t receive an email with the reset link', function() {
    GmailPage.open();
    GmailPage.login();

    assert(GmailPage.firstEmail.getText() !== 'Reset your password', 'Reset email was found in mailbox');
});

Then('the new password is not created', function() {
    LoginPage.open();
    LoginPage.waitForLoginPageToLoad();
    LoginPage.loginWithNewInvalidPassword();
    LoginPage.waitForCredsErrorToLoad();

    expect(LoginPage.wrongCredsError.getText()).to.equal('WRONG EMAIL OR PASSWORD.');
    
    GmailPage.deleteResetEmail();
});

Then('I am not able to log in using old password', function() {
    LoginPage.waitForLoginPageToLoad();
    LoginPage.loginWithOldPassword();
    LoginPage.waitForCredsErrorToLoad();

    assert(LoginPage.wrongCredsError.isDisplayed(), 'Validation message is not displayed');
    expect(LoginPage.wrongCredsError.getText()).to.equal('WRONG EMAIL OR PASSWORD.');
});