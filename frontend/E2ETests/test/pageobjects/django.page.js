import Page from './page';
import {
  djangoLoginPage,
  FIRST_NAME,
  LAST_NAME,
  USERS_PAGE_URL
} from '../constants/django.constants';
import { setValue, clickElement, waitForText } from '../utils/utils';
import { USERS, DJANGO } from '../constants/credentials.constants';

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
    return $$('.model-user > td')[1];
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

  get adminRole() {
    return $('#id_role > [value="admin"]');
  }

  get editorRole() {
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

  get permissionIcon() {
    return $('[src*="/static/admin/img/icon"]');
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

  get deleteSelectedUser() {
    return $('[value="delete_selected"]');
  }

  get activateSelectedUser() {
    return $('[value="activate_users"]');
  }

  get deactivateSelectedUser() {
    return $('[value="deactivate_users"]');
  }

  get performActionBtn() {
    return $('[title="Run the selected action"]');
  }

  get confirmDeletingUser() {
    return $('[value="Yes, I\'m sure"]');
  }

  open() {
    browser.url(djangoLoginPage);
  }

  login() {
    setValue(this, 'username', DJANGO.username);
    setValue(this, 'password', DJANGO.password);
    clickElement(this, 'loginBtn');
  }

  goToUsers() {
    browser.url(USERS_PAGE_URL);
  }

  setUserRole(role) {
    clickElement(this, 'roleDropdown');
    `this.${role}Role.waitForClickable()`;
    clickElement(this, `${role}Role`);
  }

  setName() {
    setValue(this, 'firstName', FIRST_NAME);
    setValue(this, 'lastName', LAST_NAME);
  }

  setEmail(email = USERS.invited.login.random) {
    setValue(this, 'email', email);
  }

  useInviteUserLink() {
    browser.pause(1000);
    clickElement(this, 'inviteUserLink');
  }

  submitInvitingUser() {
    clickElement(this, 'saveBtn');
  }

  inviteUser(role, email) {
    this.goToUsers();
    this.useInviteUserLink();
    this.setEmail(email);
    this.setName();
    this.setUserRole(role);
    this.submitInvitingUser();
  }

  searchForInvitedUser() {
    setValue(this, 'searchInput', USERS.invited.login.random);
    browser.keys('\uE007');
    waitForText(this, 'userEmail', USERS.invited.login.random);
  }

  selectUser() {
    clickElement(this, 'userCheckbox');
  }

  openActionsDropdown() {
    clickElement(this, 'actionsDropdown');
  }

  chooseDropdownAction(action) {
    clickElement(this, `${action}SelectedUser`);
  }

  performDropdownAction() {
    clickElement(this, 'performActionBtn');
  }

  deleteInvitedUser() {
    this.open();
    this.login();
    this.goToUsers();
    this.searchForInvitedUser();
    this.selectUser();
    this.openActionsDropdown();
    this.chooseDropdownAction('delete');
    this.performDropdownAction();
  }
}
export default new DjangoPage();
