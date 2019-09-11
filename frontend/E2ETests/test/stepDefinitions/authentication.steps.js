import { Given } from 'cucumber';
import { When } from 'cucumber';
import { Then } from 'cucumber';
import { Before } from 'cucumber';
import { After } from 'cucumber';
import LoginPage from './../pageobjects/login.page.js';
import ProjectsPage from './../pageobjects/projects.page.js';

/*Before (function() {

});
*/
After(function() {
    browser.reloadSession();
});



Given('I am on Login page', function () {
    LoginPage.open();
    LoginPage.waitForLoginPageToLoad();
    
    expect(browser.getTitle()).to.equal('Sign In with Auth0');
});


 

When('I log in as {string} with valid login and password', function (role) {
    LoginPage.login(role);
});

When('I log in with {string} login and {string} password', function (param1, param2) {
    LoginPage.login(param1, param2);
});




Then('I am on Projects page', function () {
    ProjectsPage.waitForProjectsPageToLoad();

    expect(browser.getUrl()).to.equal('http://localhost:3000/project/list'); 
});

Then('I am informed about invalid login or password', function () {
    LoginPage.waitForCredsErrorToLoad();
    
    assert(LoginPage.wrongCredsError.isDisplayed(), 'Validation message is not displayed');
    expect(LoginPage.wrongCredsError.getText()).to.equal('WRONG EMAIL OR PASSWORD.')
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