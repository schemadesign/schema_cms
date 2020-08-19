import { createSelectors } from '../../helpers/utils';

const singleSelectors = {
  firstNameLabel: '[for="firstName"]',
  firstNameValue: '#firstName',
  lastNameLabel: '[for="lastName"]',
  lastNameValue: '#lastName',
  emailLabel: '[for="email"]',
  emailValue: '#email',
  roleLabel: '[for="role"]',
  roleValue: '#role',
  resetPasswordLink: '#resetPasswordLink',
  backBtn: '#settingsBackBtn',
  saveBtn: '#settingsSaveBtn',
};

const multiSelectors = {};

const getFunctions = Profile => ({});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
