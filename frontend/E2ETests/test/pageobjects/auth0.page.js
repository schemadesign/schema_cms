import Page from './page.js';
import GmailPage from './gmail.page.js';
import { AUTH0_LOGIN_PAGE, AUTH0_USERS } from './../constants/auth0.constants.js';
import { waitForElement, waitForText } from './../utils/utils.js';
import fs from 'fs';
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

class Auth0Page extends Page {
    get loginWithGoogle() { return $('.auth0-lock-social-buttons-container > button:nth-child(2)'); }
    get dashboard() { return $('#manhattan > div'); }
    get searchInput() { return $('[placeholder="Search for users"]'); }
    get menuBtn() { return $('tr > td > div > button'); }
    get deleteUserBtn() { return $('tr > td > div > div > ul > li:last-child'); }
    get confirmDeleteUserBtn() { return $('footer > div > span:first-child'); }
    get user() { return $('td > div > div:nth-child(2) > div > div:nth-child(1) > a > span'); }

    
    open() {
        browser.url(AUTH0_LOGIN_PAGE);
    }

    login() {
        waitForElement(this, 'loginWithGoogle');
        this.loginWithGoogle.click();
        waitForElement(GmailPage, 'email');
        GmailPage.email.setValue(creds.auth0.email);
        waitForElement(GmailPage, 'emailNextBtn');
        GmailPage.emailNextBtn.click();
        waitForElement(GmailPage, 'password');
        GmailPage.password.setValue(creds.auth0.password);
        waitForElement(GmailPage, 'passwordNextBtn');
        GmailPage.passwordNextBtn.click();
        waitForElement(this, 'dashboard');
    }

    goToUsers() {
        browser.url(AUTH0_USERS);
    }

    searchForInvitedUser() {
        waitForElement(this, 'searchInput');
        this.searchInput.setValue(creds.inviteUser.email);
        browser.keys('\uE007');
        waitForText(this, 'user', `${creds.inviteUser.email}`);
    }

    deleteInvitedUser() {
        this.open();
        this.login();
        this.goToUsers();
        this.searchForInvitedUser();
        waitForElement(this, 'menuBtn');
        this.menuBtn.click();
        waitForElement(this, 'deleteUserBtn');
        this.deleteUserBtn.click();
        waitForElement(this, 'confirmDeleteUserBtn');
        this.confirmDeleteUserBtn.click();
    }
}
export default new Auth0Page();