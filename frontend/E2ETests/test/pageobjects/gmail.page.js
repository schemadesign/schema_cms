import Page from './page.js';
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));
const TIMEOUT = 10000;
const SENT = 'linkSent';
const NOT_SENT = 'linkNotSent';

class GmailPage extends Page {

    get email() { return $('#identifierId'); }
    get emailNextBtn() { return $('#identifierNext'); }
    get password() { return $("[type='password']"); }
    get passwordNextBtn() { return $('#passwordNext'); }
    get received() { return $("[href='https://mail.google.com/mail/u/0/#inbox']")}
    get firstEmail() { return $('div > table:nth-child(1) > tbody:nth-child(2) > tr > td:nth-child(6) > div > div > div > span'); }
    get firstUnreadEmail() { return $('.bqe:nth-child(1)'); }
    get resetUrl() { return $("td:last-child [href*='reset']"); }
    get deleteEmailBtn() { return $("[act='10']"); }
    get selectFirstEmail() { return $('tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > div'); }

    open() {
        browser.url('https://www.gmail.com');
    }

    waitForElement(name, timeout = TIMEOUT) {
        browser.waitUntil(() => this[name].isDisplayed(),timeout, `${name} not load after 10 seconds`);
    }

    waitForText(name, text, timeout = TIMEOUT) {
        browser.waitUntil(() => this[name].getText() === text, timeout, `Text of ${name} doesn't equal ${text}`);
    }

    waitForResetLinkEmail() {     
        while(!this.firstUnreadEmail.isDisplayed()) {
            browser.refresh();
        };
    }

    waitForResetEmailToNotExist(timeout = TIMEOUT) {
        browser.waitUntil(() => {
            return this.firstEmail.getText() !== 'Reset your password';
        }, timeout, 'Reset email wasn\'t deleted');
    }
    
    login(linkStatus) {
        if(linkStatus === SENT) {
            this.waitForElement('emailNextBtn');
            this.email.setValue(creds.gmail.email);
            this.emailNextBtn.click();
            this.waitForElement('password');
            this.password.setValue(creds.gmail.password);
            this.passwordNextBtn.click();
            this.waitForElement('received');
        }
        
        if(linkStatus === NOT_SENT) {
            this.waitForElement('emailNextBtn');
            this.email.setValue(creds.resetPassword.invalidEmail);
            this.emailNextBtn.click();
            this.waitForElement('passwordNextBtn');
            this.password.setValue(creds.resetPassword.invalidPassword);
            this.passwordNextBtn.click();
            this.waitForElement('received');
        }
    }

    useResetLink() {
        this.waitForResetLinkEmail();
        this.firstUnreadEmail.click();
        this.waitForElement('resetUrl');
        this.resetUrl.click();
    }

    deleteResetEmail() {
        browser.reloadSession();
        this.open();
        this.login('linkSent');
        if(this.firstEmail.getText() === 'Reset your password'){
            this.selectFirstEmail.click();
            this.deleteEmailBtn.moveTo();
            this.deleteEmailBtn.click();
            this.waitForResetEmailToNotExist();
            //I have to pause the browser for 7 seconds here because of bug in Gmail
            //otherwise deleted email will reappear and can brake other tests
            browser.pause(7000);

            assert(this.firstEmail.getText() !== 'Reset your password', 'Reset email wasn\'t deleted');
        }
    }
}

export default new GmailPage();