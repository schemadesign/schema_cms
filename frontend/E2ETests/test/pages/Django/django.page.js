import { camelize } from 'humps';
import { waitForText } from '../../helpers/waitFor';
import { createSelectors, extractUserRole } from '../../helpers/utils';
import { setValue, clickElement } from '../../helpers/actions';
import { USERS } from '../Constants/credentials.constants';
import { DELETE, INVITED_ADMIN, RANDOM, VALID } from '../Constants/general.constants';
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

const navigateToDjangoUsersPage = () => () => browser.url(PAGE_URL.djangoUsers);

const setUserRoleInDjango = Django => userRole => {
  clickElement(Django.roleDropdown());
  clickElement(Django[`${extractUserRole(userRole)}Role`]());
};

const setUserNameInDjango = Django => userRole => {
  setValue(Django.firstNameInput(), USERS[camelize(userRole)].firstName.valid.app.django);
  setValue(Django.lastNameInput(), USERS[camelize(userRole)].lastName.valid.app.django);
};

const setUserEmailInDjango = Django => userRole =>
  setValue(
    Django.emailInput(),
    USERS[userRole].login[userRole === camelize(INVITED_ADMIN) ? RANDOM : VALID].app.django
  );

const inviteUserFromDjango = Django => userRole => {
  hideDebugToolBar(Django);
  navigateToDjangoUsersPage(Django)();
  clickElement(Django.inviteUserLink());
  setUserEmailInDjango(Django)(camelize(userRole));
  setUserNameInDjango(Django)(camelize(userRole));
  setUserRoleInDjango(Django)(userRole);
  clickElement(Django.saveBtn());
};

const searchForInvitedUser = Django => userRole => {
  setValue(Django.searchInput(), USERS[userRole].login.random.app.django);
  clickElement(Django.searchBtn());
  waitForText(Django.userEmail(), USERS[userRole].login.random.app.django);
};

const selectFoundUser = Django => () => clickElement(Django.userCheckbox());

const openActionsDropdown = Django => () => clickElement(Django.actionsDropdown());

const selectDropdownAction = Django => action => clickElement(Django[`${action}SelectedUser`]());

const performSelectedAction = Django => () => clickElement(Django.performActionBtn());

const deleteInvitedUser = Django => () => {
  open(Django)();
  logInToDjango(Django)();
  navigateToDjangoUsersPage(Django)();
  searchForInvitedUser(Django)();
  selectFoundUser(Django)();
  openActionsDropdown(Django)();
  selectDropdownAction(Django)(DELETE);
  performSelectedAction(Django)();
};

const getFunctions = Django => ({
  open: open(Django),
  logInToDjango: logInToDjango(Django),
  navigateToUsersPage: navigateToDjangoUsersPage(),
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
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
