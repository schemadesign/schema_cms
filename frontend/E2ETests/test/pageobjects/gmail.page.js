import Page from './page';
import {
  waitForElement,
  waitForText,
  setValue,
  clickElement
} from '../utils/utils';
import { GMAIL_URL, EMAIL_TYPE } from '../constants/gmail.constants';
import { GMAIL } from '../constants/credentials.constants';

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
    return $('td:last-child [href*="reset"]');
  }

  get invitationUrl() {
    return $('[role="listitem"]:last-of-type [href*="reset"]');
  }

  get deleteEmailBtn() {
    return $("[act='10']");
  }

  get firstEmailCheckbox() {
    return $('tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > div');
  }

  get searchInput() {
    return $('table:first-child td > div > input');
  }

  open() {
    browser.url(GMAIL_URL);
  }

  searchForEmail(emailType) {
    this.waitForNewEmail();
    setValue(this, 'searchInput', EMAIL_TYPE[emailType]);
    browser.keys('\uE007');
    waitForText(this, 'firstUnreadEmail', `${EMAIL_TYPE[emailType]}`);
  }

  waitForNewEmail() {
    while (!this.firstUnreadEmail.isDisplayed()) {
      browser.refresh();
    }
  }

  setEmail(userRole, linkStatus) {
    setValue(this, 'email', GMAIL[userRole].email[linkStatus]);
  }

  submitEmail() {
    clickElement(this, 'emailNextBtn');
  }

  setPassword(userRole, linkStatus) {
    setValue(this, 'password', GMAIL[userRole].password[linkStatus]);
  }

  submitPassword() {
    clickElement(this, 'passwordNextBtn');
  }

  login(userRole, linkStatus) {
    this.setEmail(userRole, linkStatus);
    this.submitEmail();
    this.setPassword(userRole, linkStatus);
    this.submitPassword();
    waitForElement(this, 'received');
  }

  useResetLink() {
    this.waitForNewEmail();
    clickElement(this, 'firstUnreadEmail');
    clickElement(this, 'resetUrl');
  }
}

export default new GmailPage();
