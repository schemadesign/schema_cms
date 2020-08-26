import SubHeader from '../Components/SubHeader/subHeader.component';
import { createSelectors, convertToCamelCase } from '../../helpers/utils';
import { clickElement, setValue } from '../../helpers/actions';
import { waitForElement } from '../../helpers/waitFor';
import { expectElemsToHaveAttribute, expectElemsToHaveText } from '../../helpers/expect';
import { VALID } from '../Constants/general.constants';
import {
  CREATE_PROJECT_ATTRIBUTE_VALUES,
  CREATE_PROJECT,
  CREATE_PROJECT_DEFAULT_STATUS,
  CREATE_PROJECT_ELEMENT_VALUES,
  ATTRIBUTE_VALUES,
} from './createProject.constants';

const { title, description, domain } = CREATE_PROJECT;

const singleSelectors = {
  domainInput: '#domain',
  statusList: '#fieldProjectStatus > div:nth-child(2)',
  inProgress: '#select-item-0',
  done: '#select-item-1',
  hold: '#select-item-2',
  published: '#select-item-3',
  titleErrorText: 'form > div:nth-child(1) > div:nth-child(2)',
  descriptionErrorText: 'form > div:nth-child(2) > div:nth-child(2)',
  domainErrorText: 'form > div:nth-child(3) > div:nth-child(2)',
};

const multiSelectors = {};

const textSelectors = {
  titleLabel: '[for="title"]',
  descriptionLabel: '[for="description"]',
  domainLabel: '[for="domain"]',
  ownerLabel: '[for="owner"]',
  ownerInput: '#owner',
  statusLabel: '#fieldProjectStatusLabel',
  statusDropdown: '#fieldProjectStatus',
  cancelBtn: '#cancelBtn',
  finishBtn: '#finishBtn',
};

const attributeSelectors = {
  titleInput: '#title',
  descriptionInput: '#description',
};

const convertedTextSelectors = createSelectors([textSelectors], []);
const convertedAttributeSelectors = createSelectors([attributeSelectors], []);

const setProjectStatus = CreateProject => (status = CREATE_PROJECT_DEFAULT_STATUS) => {
  clickElement(CreateProject.statusDropdown());
  waitForElement(CreateProject.statusList());
  clickElement(CreateProject[convertToCamelCase(status)]());
};

const createProject = CreateProject => (titleState = VALID, descriptionState = VALID, domainState = VALID) => {
  setValue(CreateProject.titleInput(), title[titleState]);
  setValue(CreateProject.descriptionInput(), description[descriptionState]);
  setValue(CreateProject.domainInput(), domain[domainState]);
  setProjectStatus(CreateProject)();
};

const expectCreateProjectPageToMatchDesign = () => () => {
  SubHeader.expectSubHeaderToMatchPageUrl(browser.getUrl());
  expectElemsToHaveText(convertedTextSelectors, CREATE_PROJECT_ELEMENT_VALUES);
  expectElemsToHaveAttribute(convertedAttributeSelectors, ATTRIBUTE_VALUES, CREATE_PROJECT_ATTRIBUTE_VALUES);
};

const getFunctions = CreateProject => ({
  setProjectStatus: setProjectStatus(CreateProject),
  createProject: createProject(CreateProject),
  expectCreateProjectPageToMatchDesign: expectCreateProjectPageToMatchDesign(CreateProject),
});

const convertedSelectors = createSelectors([singleSelectors, textSelectors, attributeSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
