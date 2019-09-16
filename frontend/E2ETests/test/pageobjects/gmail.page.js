import Page from './page.js';
import { AssertionError } from 'assert';
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

class GmailPage extends Page {

    get email() { return $('#identifierId'); }
    get emailNextBtn() { return $('#identifierNext'); }
    get password() { return $("[type='password']"); }
    get passwordNextBtn() { return $('#passwordNext'); }
    get received() { return $("[href='https://mail.google.com/mail/u/0/#inbox']")}
    get firstEmail() { return $('div > table:nth-child(1) > tbody:nth-child(2) > tr > td:nth-child(6) > div > div > div > span'); }
    get resetUrl() { return $("[href*='reset']"); }
    get deleteEmailBtn() { return $("[act='10']"); }
    get selectFirstEmail() { return $('tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > div'); }

    open() {
        browser.url('https://www.gmail.com');
    }

    waitForLoginPageToLoad() {
        browser.waitUntil(() => {
           return this.emailNextBtn.isDisplayed()
        },10000, 'Login page not displayed after 10 seconds');
    }

    waitForPasswordPageToLoad() {
        browser.waitUntil(() => {
            return this.password.isDisplayed()
        },10000, 'Password page not load after 10 seconds');
    }

    waitForReceivedToLoad() {
        browser.waitUntil(() => {
            return this.received.isDisplayed();
        }, 10000, 'Received not visible after 10 seconds');
    }

    waitForResetUrlToLoad() {
        browser.waitUntil(() => {
            return this.resetUrl.isDisplayed();
        }, 10000, 'Reset URl not displayed after 10 seconds');
    }

    waitForResetLinkEmail() {     
        while(this.firstEmail.getText() !== 'Reset your password') {
            browser.refresh();
        };
    }

    waitForDeleteBtnToLoad() {
        browser.waitUntil(() => {
            return this.deleteEmailBtn.isDisplayed();
        }, 20000, 'Delete email button not visible after 10 seconds');
    }

    waitForResetEmailToNotExist() {
        browser.waitUntil(() => {
            return this.firstEmail.getText() !== 'Reset your password';
        }, 5000, 'Reset email wasn\'t deleted');
    }

    login() {
        this.waitForLoginPageToLoad();
        this.email.setValue(creds.gmail.email);
        this.emailNextBtn.click();
        this.waitForPasswordPageToLoad();
        this.password.setValue(creds.gmail.password);
        this.passwordNextBtn.click();
        this.waitForReceivedToLoad();
    }

    useResetLink() {
        this.waitForResetLinkEmail();
        this.firstEmail.click();
        this.waitForResetUrlToLoad();
        this.resetUrl.click();
    }

    deleteResetEmail() {
        browser.reloadSession();
        this.open();
        this.login();
        this.waitForResetLinkEmail();
        this.selectFirstEmail.click();
        this.deleteEmailBtn.moveTo();
        this.deleteEmailBtn.click();
        this.waitForResetEmailToNotExist();

        assert(this.firstEmail.getText() !== 'Reset your password', 'Reset email wasn\'t deleted');
    }
}

export default new GmailPage();