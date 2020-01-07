import Page from './page.js';
import { waitForElement, waitForText } from './../utils/utils.js';
import { TIMEOUT } from './../constants/config.constants.js';
import {
  LINK_SENT,
  LINK_NOT_SENT,
  GMAIL,
  RESET_MAIL_TITLE,
  INVITATION_MAIL_TITLE
} from './../constants/gmail.constants.js';
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

class GmailPage extends Page {
  get email() {
    return $('#identifierId');
  }
  get emailNextBtn() {
    return $('#identifierNext');
  }
  get password() {
    return $("[type='password']");
  }
  get passwordNextBtn() {
    return $('#passwordNext');
  }
  get received() {
    return $("[href='https://mail.google.com/mail/u/0/#inbox']");
  }
  get firstEmail() {
    return $(
      'div > table:nth-child(1) > tbody:nth-child(2) > tr > td:nth-child(6) > div > div > div > span'
    );
  }
  get firstUnreadEmail() {
    return $('.bqe:nth-child(1)');
  }
  get resetUrl() {
    return $("td:last-child [href*='reset']");
  }
  get invitationUrl() {
    return $('');
  } //TODO: add selector when Mandrillo is configured
  get deleteEmailBtn() {
    return $("[act='10']");
  }
  get selectFirstEmail() {
    return $('tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > div');
  }
  get searchInput() {
    return $('table:first-child td > div > input');
  }

  open() {
    browser.url(GMAIL);
  }

  waitForResetLinkEmail() {
    while (!this.firstUnreadEmail.isDisplayed()) {
      browser.refresh();
    }
  }
  searchForInvitationEmail() {
    this.waitForNewEmail();
    waitForElement(this, 'searchInput');
    this.searchInput.setValue(creds.inviteUser.email);
    browser.keys('\uE007');
    waitForText(this, 'firstUnreadEmail', `${INVITATION_MAIL_TITLE}`.getText());
  }

  waitForNewEmail() {
    while (!this.firstUnreadEmail.isDisplayed()) {
      browser.refresh();
    }
  }

  waitForResetEmailToNotExist(timeout = TIMEOUT) {
    browser.waitUntil(
      () => {
        return this.firstEmail.getText() !== RESET_MAIL_TITLE;
      },
      timeout,
      "Reset email wasn't deleted"
    );
  }

  login(linkStatus) {
    if (linkStatus === LINK_SENT) {
      waitForElement(this, 'emailNextBtn');
      this.email.setValue(creds.gmail.email);
      this.emailNextBtn.click();
      waitForElement(this, 'password');
      this.password.setValue(creds.gmail.password);
      this.passwordNextBtn.click();
      waitForElement(this, 'received');
    }

    if (linkStatus === LINK_NOT_SENT) {
      waitForElement(this, 'emailNextBtn');
      this.email.setValue(creds.resetPassword.invalidEmail);
      this.emailNextBtn.click();
      waitForElement(this, 'password');
      this.password.setValue(creds.resetPassword.invalidPassword);
      this.passwordNextBtn.click();
      waitForElement(this, 'received');
    }
  }

  useResetLink() {
    this.waitForResetLinkEmail();
    this.firstUnreadEmail.click();
    waitForElement(this, 'resetUrl');
    this.resetUrl.click();
  }

  deleteResetEmail() {
    browser.reloadSession();
    this.open();
    this.login(LINK_SENT);
    if (this.firstEmail.getText() === RESET_MAIL_TITLE) {
      this.selectFirstEmail.click();
      this.deleteEmailBtn.moveTo();
      this.deleteEmailBtn.click();
      this.waitForResetEmailToNotExist();
      //I have to pause the browser for 7 seconds here because of bug in Gmail
      //otherwise deleted email will reappear and can brake other tests
      browser.pause(7000);
    }
  }
}

export default new GmailPage();
