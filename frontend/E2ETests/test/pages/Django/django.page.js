import { camelize } from 'humps';
import { waitForText } from '../../helpers/waitFor';
import { createSelectors } from '../../helpers/utils';
import { setValue, clickElement } from '../../helpers/actions';
import { USERS } from '../Constants/credentials.constants';
import { DELETE, INVITED_ADMIN, RANDOM, VALID } from '../Constants/general.constants';
import { DJANGO_FIRST_NAME } from './django.constants';
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
  debugToolBar: '#djDebugToolBar',
  hideToolBarBtn: '#djHideToolBarButton',
};

const multiSelectors = {
  usersLink: '.model-user > td',
};

const open = () => () => browser.url(process.env[`DJANGO_${process.env.ENV}`]);

const logInToDjango = Django => () => {
  setValue(Django.userNameInput(), process.env[`DJANGO_${process.env.ENV}_LOGIN`]);
  setValue(Django.passwordInput(), process.env[`DJANGO_${process.env.ENV}_PASSWORD`]);
  clickElement(Django.logInBtn());
};

const isToolBarPresent = Django => () => Django.debugToolBar().isExisting();

const hideDebugToolBar = Django => () => {
  if (isToolBarPresent(Django)()) {
    clickElement(Django.hideToolBarBtn());
  }
};

const navigateToUsersPage = () => () => browser.url(PAGE_URL.djangoUsers);

const extractUserRole = () => str => (str.includes('existing') ? str.split('existing ')[1] : str.split('invited ')[1]);

const setUserRoleInDjango = Django => userRole => {
  clickElement(Django.roleDropdown());
  clickElement(Django[`${extractUserRole()(userRole)}Role`]());
};

const setUserNameInDjango = Django => userRole => {
  setValue(Django.firstNameInput(), DJANGO_FIRST_NAME[userRole]);
  setValue(Django.lastNameInput(), process.env.DJANGO_LAST_NAME);
};

const setUserEmailInDjango = Django => userRole =>
  setValue(Django.emailInput(), USERS[userRole].login[userRole === camelize(INVITED_ADMIN) ? RANDOM : VALID]);

const inviteUserFromDjango = Django => userRole => {
  navigateToUsersPage(Django)();
  clickElement(Django.inviteUserLink());
  setUserEmailInDjango(Django)(camelize(userRole));
  setUserNameInDjango(Django)(camelize(userRole));
  setUserRoleInDjango(Django)(userRole);
  clickElement(Django.saveBtn());
};

const searchForInvitedUser = Django => userRole => {
  setValue(Django.searchInput(), USERS[userRole].login.random);
  clickElement(Django.searchBtn());
  waitForText(Django.userEmail(), USERS[userRole].login.random);
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
  navigateToUsersPage: navigateToUsersPage(),
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
  hideDebugToolBar: hideDebugToolBar(Django),
  extractUserRole: extractUserRole(),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
