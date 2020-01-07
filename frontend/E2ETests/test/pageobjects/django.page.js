import fs from 'fs';
import Page from './page';
import { clickElement, waitForElement, waitForText } from '../utils/utils';
import { localDjangoLoginPage } from '../constants/django.constants';
import { ADMIN, EDITOR } from '../constants/login.constants';

const FIRSTNAME = 'John';
const LASTNAME = 'Doe';
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

class DjangoPage extends Page {
  get username() {
    return $('#id_username');
  }

  get password() {
    return $('#id_password');
  }

  get loginBtn() {
    return $('[type="submit"]');
  }

  get users() {
    return $("[href='/admin/users/user/']");
  }

  get inviteUserLink() {
    return $("[href='/admin/users/user/invite-user/']");
  }

  get addUser() {
    return $("[href='/admin/users/user/add/']");
  }

  get email() {
    return $('#id_email');
  }

  get firstName() {
    return $('#id_first_name');
  }

  get lastName() {
    return $('#id_last_name');
  }

  get roleDropdown() {
    return $('#id_role');
  }

  get roleAdmin() {
    return $('[value="admin"]');
  }

  get roleEditor() {
    return $('[value="editor"]');
  }

  get saveBtn() {
    return $('[value="Save"]');
  }

  get successMsg() {
    return $('.success');
  }

  get usersListEmail() {
    return $('tbody > tr:nth-child(1) > td.field-email');
  }

  get usersListName() {
    return $('tbody > tr:nth-child(1) > th > a');
  }

  get permissionActive() {
    return $('#id_is_active');
  }

  get userExistsMsg() {
    return $('.errorlist > li');
  }

  get searchInput() {
    return $('#searchbar');
  }

  get userEmail() {
    return $('#result_list > tbody > tr:nth-child(1) > td.field-email');
  }

  get userCheckbox() {
    return $('tr > td.action-checkbox > input');
  }

  get actionsDropdown() {
    return $('#changelist-form > div.actions > label > select');
  }

  get deleteSelectedUsersAction() {
    return $('[value="delete_selected"]');
  }

  get performActionBtn() {
    return $('[title="Run the selected action"]');
  }

  get confirmDeletingUser() {
    return $('[value="Yes, I\'m sure"]');
  }

  open() {
    browser.url(localDjangoLoginPage);
    waitForElement(this, 'loginBtn');
  }

  login() {
    waitForElement(this, 'username');
    this.username.setValue(creds.django.username);
    waitForElement(this, 'password');
    this.password.setValue(creds.django.password);
    clickElement(this, 'loginBtn');
  }

  goToUsers() {
    waitForElement(this, 'users');
    this.users.click();
  }

  setAdminRole() {
    waitForElement(this, 'roleDropdown');
    this.roleDropdown.click();
    waitForElement(this, 'roleAdmin');
    this.roleAdmin.click();
  }

  setEditorRole() {
    waitForElement(this, 'roleDropdown');
    this.roleDropdown.click();
    waitForElement(this, 'roleEditor');
    this.roleAdmin.click();
  }

  setName() {
    waitForElement(this, 'firstName');
    this.firstName.setValue(FIRSTNAME);
    waitForElement(this, 'lastName');
    this.lastName.setValue(LASTNAME);
  }

  inviteUser(role) {
    if (role === ADMIN) {
      this.goToUsers();
      waitForElement(this, 'inviteUserLink');
      this.inviteUserLink.click();
      waitForElement(this, 'email');
      this.email.setValue(creds.inviteUser.email);
      this.setName();
      this.setAdminRole();
      this.saveBtn.click();
    }
    if (role === EDITOR) {
      this.goToUsers();
      waitForElement(this, 'email');
      this.email.setValue(creds.inviteUser.email);
      this.setName();
      this.setEditorRole();
      this.saveBtn.click();
    }
  }

  searchForInvitedUser() {
    waitForElement(this, 'searchInput');
    this.searchInput.setValue(creds.inviteUser.email);
    browser.keys('\uE007');
    waitForText(this, 'userEmail', `${creds.inviteUser.email}`);
  }

  deleteInvitedUser() {
    this.open();
    this.login();
    this.goToUsers();
    this.searchForInvitedUser();
    waitForElement(this, 'userCheckbox');
    this.userCheckbox.click();
    waitForElement(this, 'actionsDropdown');
    this.actionsDropdown.click();
    waitForElement(this, 'deleteSelectedUsersAction');
    this.deleteSelectedUsersAction.click();
    waitForElement(this, 'performActionBtn');
    this.performActionBtn.click();
  }
}
export default new DjangoPage();
