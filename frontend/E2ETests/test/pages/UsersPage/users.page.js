import { cond, propEq } from 'ramda';
import { camelize } from 'humps';
import TopHeader from '../Components/TopHeader/topHeader.component';
import Menu from '../Components/Menu/menu.component';
import { createSelectors, extractUserRole } from '../../helpers/utils';
import { clickElement, setValue } from '../../helpers/actions';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../../helpers/expect';
import {
  ADD_USER_PAGE,
  USERS_PAGE,
  EMPTY_INPUT_ERROR,
  FIRST_NAME_STATE,
  LAST_NAME_STATE,
  EMAIL_STATE,
  TOO_SHORT_FIRST_NAME_ERROR,
  INVALID_EMAIL_ERROR,
  TOO_SHORT_LAST_NAME_ERROR,
} from './users.constants';
import { EMPTY, INVALID, RANDOM, TOO_SHORT, VALID } from '../Constants/general.constants';
import { isTextDisplayed } from '../../helpers/check';
import { USERS } from '../Constants/credentials.constants';

const singleSelectors = {
  addUserBtn: '#addUserBtn',
  firstNameInput: '#firstName',
  lastNameInput: '#lastName',
  emailInput: '#email',
  roleDropdown: '#fieldProjectStatusLabel',
  adminRole: '#select-item-0',
  editorRole: '#select-item-1',
  firstNameErrorText: 'form > div:nth-child(1) > div:nth-child(2)',
  lastNameErrorText: 'form > div:nth-child(2) > div:nth-child(2)',
  emailErrorText: 'form > div:nth-child(3) > div:nth-child(2)',
  backBtn: '#inviteUserBackBtn',
  inviteBtn: '#inviteUserSubmitBtn',
};

const multiSelectors = {};

const navigateToUsersPage = () => () => {
  TopHeader.openMenu();
  Menu.expectMenuToBeDisplayed();
  clickElement(Menu.usersOption());
  Menu.waitForMenuToHide();
};

const setUserRole = Users => userRole => {
  clickElement(Users.roleDropdown());
  clickElement(Users[`${extractUserRole(userRole)}Role`]());
};

const setFirstName = Users => value => setValue(Users.firstNameInput(), value);

const setLastName = Users => value => setValue(Users.lastNameInput(), value);

const setEmail = Users => value => setValue(Users.emailInput(), value);

const inviteUserFromApp = Users => (
  userRole,
  appType,
  firstNameState = VALID,
  lastNameState = VALID,
  emailState = RANDOM
) => {
  navigateToUsersPage(Users)();
  expectPageToHaveTitle(USERS_PAGE);
  expectPageToHaveUrl(USERS_PAGE);
  clickElement(Users.addUserBtn());
  expectPageToHaveUrl(ADD_USER_PAGE);
  setFirstName(Users)(USERS[camelize(userRole)].firstName[camelize(firstNameState)].app[camelize(appType)]);
  setLastName(Users)(USERS[camelize(userRole)].lastName[camelize(lastNameState)].app[camelize(appType)]);
  setEmail(Users)(USERS[camelize(userRole)].login[camelize(emailState)].app[camelize(appType)]);
  setUserRole(Users)(userRole);
  clickElement(Users.inviteBtn());
};

const isEmptyFirstNameTextDisplayed = Users => () => isTextDisplayed(Users.firstNameErrorText(), EMPTY_INPUT_ERROR);

const isEmptyLastNameTextDisplayed = Users => () => isTextDisplayed(Users.lastNameErrorText(), EMPTY_INPUT_ERROR);

const isEmptyEmailTextDisplayed = Users => () => isTextDisplayed(Users.emailErrorText(), EMPTY_INPUT_ERROR);

const isTooShortFirstNameTextDisplayed = Users => () =>
  isTextDisplayed(Users.firstNameErrorText(), TOO_SHORT_FIRST_NAME_ERROR);

const isTooShortLastNameTextDisplayed = Users => () =>
  isTextDisplayed(Users.lastNameErrorText(), TOO_SHORT_LAST_NAME_ERROR);

const isInvalidEmailTextDisplayed = Users => () => isTextDisplayed(Users.emailErrorText(), INVALID_EMAIL_ERROR);

const validateUserInputs = Users =>
  cond([
    [propEq(FIRST_NAME_STATE, EMPTY), isEmptyFirstNameTextDisplayed(Users)],
    [propEq(LAST_NAME_STATE, EMPTY), isEmptyLastNameTextDisplayed(Users)],
    [propEq(EMAIL_STATE, EMPTY), isEmptyEmailTextDisplayed(Users)],
    [propEq(FIRST_NAME_STATE, TOO_SHORT), isTooShortFirstNameTextDisplayed(Users)],
    [propEq(LAST_NAME_STATE, TOO_SHORT), isTooShortLastNameTextDisplayed(Users)],
    [propEq(EMAIL_STATE, INVALID), isInvalidEmailTextDisplayed(Users)],
  ]);

const getFunctions = Users => ({
  navigateToUsersPage: navigateToUsersPage(Users),
  inviteUserFromApp: inviteUserFromApp(Users),
  validateUserInputs: validateUserInputs(Users),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
