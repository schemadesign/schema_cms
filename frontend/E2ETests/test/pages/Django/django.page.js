import { waitForText } from '../../helpers/waitFor';
import { createSelectors } from '../../helpers/utils';
import { setValue, clickElement } from '../../helpers/actions';
import { USERS, DJANGO } from '../Constants/credentials.constants';
import { DELETE } from '../Constants/general.constants';
import { DJANGO_FIRST_NAME, DJANGO_LAST_NAME } from './django.constants';
import PAGE_URL from '../Constants/pageURL.constants';

const singleSelectors = {
  userNameInput: '#id_username',
  passwordInput: '#id_password',
  inviteUserLink: "[href='/admin/users/user/invite-user/']",
  addUserBtn: "[href='/admin/users/user/add/']",
  emailInput: '#id_email',
  firstNameInput: '#id_first_name',
  lastNameInput: '#id_last_name',
  roleDropdown: '#id_role',
  adminRole: '#id_role > [value="admin"]',
  editorRole: '[value="editor"]',
  saveBtn: '[value="Save"]',
  logInBtn: '[value="Log in"]',
  successMsg: '.success',
  usersListEmail: 'tbody > tr:nth-child(1) > th.field-email',
  usersListName: 'tbody > tr:nth-child(1) > th > a',
  permissionIcon: '[src*="/static/admin/img/icon"]',
  userExistsMsg: '.errorlist > li',
  searchInput: '#searchbar',
  searchBtn: '[value="Search"]',
  userEmail: '#result_list > tbody > tr:nth-child(1) > th.field-email',
  userCheckbox: 'tr > td.action-checkbox > input',
  actionsDropdown: '#changelist-form > div.actions > label > select',
  deleteSelectedUser: '[value="delete_selected"]',
  activateSelectedUser: '[value="activate_users"]',
  deactivateSelectedUser: '[value="deactivate_users"]',
  performActionBtn: '[title="Run the selected action"]',
  confirmUserDeletion: '[value="Yes, I\'m sure"]',
};

const multiSelectors = {
  usersLink: '.model-user > td',
};

const open = () => () => browser.url(PAGE_URL.django);

const logInToDjango = Django => () => {
  setValue(Django.userNameInput(), DJANGO.userName);
  setValue(Django.passwordInput(), DJANGO.password);
  clickElement(Django.logInBtn());
};

const navigateToUsersPage = () => () => browser.url(PAGE_URL.djangoUsers);

const setUserRoleInDjango = Django => role => {
  clickElement(Django.roleDropdown());
  clickElement(Django[role]());
};

const setAdminRoleInDjango = Django => () => {
  clickElement(Django.roleDropdown());
  clickElement(Django.adminRole());
};

const setEditorRoleInDjango = Django => () => {
  clickElement(Django.roleDropdown());
  clickElement(Django.editorRole());
};

const setUserNameInDjango = Django => () => {
  setValue(Django.firstNameInput(), DJANGO_FIRST_NAME);
  setValue(Django.lastNameInput(), DJANGO_LAST_NAME);
};

const setUserEmailInDjango = Django => (email = USERS.invited.login.random) => setValue(Django.emailInput(), email);

const inviteUserFromDjango = Django => (role, email) => {
  navigateToUsersPage(Django)();
  clickElement(Django.inviteUserLink());
  setUserEmailInDjango(Django)(email);
  setUserNameInDjango(Django)();
  setUserRoleInDjango(Django)(role);
  clickElement(Django.saveBtn());
};

const searchForInvitedUser = Django => () => {
  setValue(Django.searchInput(), USERS.invited.login.random);
  clickElement(Django.searchBtn());
  waitForText(Django.userEmail(), USERS.invited.login.random);
};

const selectFoundUser = Django => () => clickElement(Django.userCheckbox());

const openActionsDropdown = Django => () => clickElement(Django.actionsDropdown());

const selectDropdownAction = Django => action => clickElement(Django[`${action}SelectedUser`]());

const performSelectedAction = Django => () => clickElement(Django.performActionBtn());

const deleteInvitedUser = Django => () => {
  open(Django)();
  logInToDjango(Django)();
  navigateToUsersPage(Django)();
  searchForInvitedUser(Django)();
  selectFoundUser(Django)();
  openActionsDropdown(Django)();
  selectDropdownAction(Django)(DELETE);
  performSelectedAction(Django)();
};

const getFunctions = Django => ({
  open: open(Django),
  logInToDjango: logInToDjango(Django),
  navigateToUsersPage: navigateToUsersPage(Django),
  setAdminRoleInDjango: setAdminRoleInDjango(Django),
  setEditorRoleInDjango: setEditorRoleInDjango(Django),
  setUserNameInDjango: setUserNameInDjango(Django),
  setUserEmailInDjango: setUserEmailInDjango(Django),
  setUserRoleInDjango: setUserRoleInDjango(Django),
  inviteUserFromDjango: inviteUserFromDjango(Django),
  searchForInvitedUser: searchForInvitedUser(Django),
  selectFoundUser: selectFoundUser(Django),
  openActionsDropdown: openActionsDropdown(Django),
  selectDropdownAction: selectDropdownAction(Django),
  performSelectedAction: performSelectedAction(Django),
  deleteInvitedUser: deleteInvitedUser(Django),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
