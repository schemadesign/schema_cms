import { cond, equals } from 'ramda';
import { pascalize } from 'humps';
import { createSelectors, generateRandomString, getTranslateXvalueFromMatrix } from '../../../helpers/utils';
import { clickElement, setValue } from '../../../helpers/actions';
import {
  AVAILABLE,
  CONTENT,
  DATASET,
  EXISTING,
  MIXED,
  MULTI,
  SINGLE,
  TAG_TEMPLATE_NAME_STATE,
  UNAVAILABLE,
} from './tagTemplates.constants';
import { TOO_LONG, TRANSFORM, VALID } from '../../Constants/general.constants';
import { waitForElement } from '../../../helpers/waitFor';

const singleSelectors = {
  nameInput: '#name',
  nameValidationError: '#nameError',
  contentCheckbox: '[for="content"] > svg',
  datasetCheckbox: '[for="dataset"] > svg',
  tagsCounter: '#elementsCounter',
  addTagBtn: '#addTagBtn',
  availabilitySwitch: '[for="isAvailable"] > div > div',
  choiceSwitch: '[for="isSingleSelect"] > div > div',
  deleteTagTemplateBtn: '#removeTagCategory',
  cancelBtn: '#cancelBtn',
  saveBtn: '#saveBtn',
  tagTemplateRemovalModal: '[aria-label="Confirm Removal"]',
  tagTemplateRemovalConfirmBtn: '#confirmRemovalBtn',
};

const multiSelectors = {
  deleteTagBtn: '[id*="deleteTagBtn"]',
};

const isDatasetSelected = CreateTagTemplate => () =>
  CreateTagTemplate.datasetCheckbox().getAttribute('stroke') === '#000';

const isContentSelected = CreateTagTemplate => () =>
  CreateTagTemplate.contentCheckbox().getAttribute('stroke') === '#000';

const isMixedSelected = CreateTagTemplate => () =>
  isDatasetSelected(CreateTagTemplate)() && isContentSelected(CreateTagTemplate)();

const selectDatasetApplicability = CreateTagTemplate => () => {
  if (!isDatasetSelected(CreateTagTemplate)()) {
    clickElement(CreateTagTemplate.datasetCheckbox());
    return expect(isDatasetSelected(CreateTagTemplate)()).toBe(true);
  }
  return expect(isDatasetSelected(CreateTagTemplate)()).toBe(true);
};

const selectContentApplicability = CreateTagTemplate => () => {
  if (!isContentSelected(CreateTagTemplate)()) {
    clickElement(CreateTagTemplate.contentCheckbox());
    return expect(isContentSelected(CreateTagTemplate)()).toBe(true);
  }
  return expect(isContentSelected(CreateTagTemplate)()).toBe(true);
};

const selectMixedApplicability = CreateTagTemplate => () => {
  if (!isMixedSelected(CreateTagTemplate)()) {
    selectDatasetApplicability(CreateTagTemplate)();
    selectContentApplicability(CreateTagTemplate)();
    expect(isMixedSelected(CreateTagTemplate)()).toBe(true);
  } else if (isContentSelected(CreateTagTemplate)()) {
    selectDatasetApplicability(CreateTagTemplate)();
    expect(isMixedSelected(CreateTagTemplate)()).toBe(true);
  }

  selectContentApplicability(CreateTagTemplate)();
  return expect(isMixedSelected(CreateTagTemplate)()).toBe(true);
};

const selectApplicability = CreateTagTemplate =>
  cond([
    [equals(DATASET), () => selectDatasetApplicability(CreateTagTemplate)()],
    [equals(CONTENT), () => selectContentApplicability(CreateTagTemplate)()],
    [equals(MIXED), () => selectMixedApplicability(CreateTagTemplate)()],
  ]);

const createTagNames = () => (numOfTags, tagName, nameState) => {
  const names = new Array(numOfTags).fill(tagName);

  const generateNames = cond([
    [equals(VALID), () => names.map((item, index) => `${item} ${index + 1}`)],
    [equals(TOO_LONG), () => names.map((item, index) => `${item} ${generateRandomString(151)}${index + 1}`)],
    [equals(EXISTING), () => names.map(item => `${item}`)],
  ]);

  return generateNames(nameState);
};

const deleteAllTags = CreateTagTemplate => () => CreateTagTemplate.deleteTagBtn().forEach(item => clickElement(item));

const addTag = CreateTagTemplate => (numOfTags, tagName, nameState) => {
  const names = createTagNames()(numOfTags, tagName, nameState);
  deleteAllTags(CreateTagTemplate)();

  names.forEach((item, index) => {
    clickElement(CreateTagTemplate.addTagBtn());
    setValue($(`#tags-${index}`), item);
  });
};

const waitForMultiChoice = CreateTagTemplate => () =>
  browser.waitUntil(
    () => getTranslateXvalueFromMatrix(CreateTagTemplate.choiceSwitch().getCSSProperty(TRANSFORM).value) === 0
  );

const waitForSingleChoice = CreateTagTemplate => () =>
  browser.waitUntil(
    () => getTranslateXvalueFromMatrix(CreateTagTemplate.choiceSwitch().getCSSProperty(TRANSFORM).value) === 20
  );

const waitForAvailable = CreateTagTemplate => () =>
  browser.waitUntil(
    () => getTranslateXvalueFromMatrix(CreateTagTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 20
  );

const waitForUnavailable = CreateTagTemplate => () =>
  browser.waitUntil(
    () => getTranslateXvalueFromMatrix(CreateTagTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 0
  );

const isSingleChoice = CreateTagTemplate => () =>
  getTranslateXvalueFromMatrix(CreateTagTemplate.choiceSwitch().getCSSProperty(TRANSFORM).value) === 20;

const isMultiChoice = CreateTagTemplate => () =>
  getTranslateXvalueFromMatrix(CreateTagTemplate.choiceSwitch().getCSSProperty(TRANSFORM).value) === 0;

const isUnavailable = CreateTagTemplate => () =>
  getTranslateXvalueFromMatrix(CreateTagTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 0;

const isAvailable = CreateTagTemplate => () =>
  getTranslateXvalueFromMatrix(CreateTagTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 20;

const setAvailable = CreateTagTemplate => () => {
  if (!isAvailable(CreateTagTemplate)()) {
    clickElement(CreateTagTemplate.availabilitySwitch());
    waitForAvailable(CreateTagTemplate)();
    return expect(isAvailable(CreateTagTemplate)()).toBe(true);
  }
  return expect(isAvailable(CreateTagTemplate)()).toBe(true);
};

const setUnavailable = CreateTagTemplate => () => {
  if (isAvailable(CreateTagTemplate)()) {
    clickElement(CreateTagTemplate.availabilitySwitch());
    waitForUnavailable(CreateTagTemplate)();
    return expect(isUnavailable(CreateTagTemplate)()).toBe(true);
  }
  return expect(isUnavailable(CreateTagTemplate)()).toBe(true);
};

const setAvailability = CreateTagTemplate => availability =>
  availability === AVAILABLE ? setAvailable(CreateTagTemplate)() : setUnavailable(CreateTagTemplate)();

const setMultiChoice = CreateTagTemplate => () => {
  if (isSingleChoice(CreateTagTemplate)()) {
    clickElement(CreateTagTemplate.choiceSwitch());
    waitForMultiChoice(CreateTagTemplate)();
    return expect(isMultiChoice(CreateTagTemplate)()).toBe(true);
  }
  return expect(isMultiChoice(CreateTagTemplate)()).toBe(true);
};

const setSingleChoice = CreateTagTemplate => () => {
  if (!isSingleChoice(CreateTagTemplate)()) {
    clickElement(CreateTagTemplate.choiceSwitch());
    waitForSingleChoice(CreateTagTemplate)();
    return expect(isSingleChoice(CreateTagTemplate)()).toBe(true);
  }
  return expect(isSingleChoice(CreateTagTemplate)()).toBe(true);
};

const setChoice = CreateTagTemplate => choiceType =>
  choiceType === SINGLE ? setSingleChoice(CreateTagTemplate)() : setMultiChoice(CreateTagTemplate)();

const createTagTemplate = CreateTagTemplate => (
  tagTemplateNameState,
  numOfTags = 3,
  choiceType = SINGLE,
  applicability = DATASET,
  availability = AVAILABLE,
  tagNameState = VALID
) => {
  const templateName = `${pascalize(applicability)} ${pascalize(choiceType)} ${pascalize(availability)}`;

  setValue(
    CreateTagTemplate.nameInput(),
    tagTemplateNameState === templateName ? templateName : TAG_TEMPLATE_NAME_STATE[tagTemplateNameState]
  );

  selectApplicability(CreateTagTemplate)(applicability);
  addTag(CreateTagTemplate)(numOfTags, templateName, tagNameState);
  setChoice(CreateTagTemplate)(choiceType);
  setAvailability(CreateTagTemplate)(availability);
  clickElement(CreateTagTemplate.saveBtn());
};

const expectChoiceToBeSelected = CreateTagTemplate =>
  cond([
    [equals(SINGLE), () => expect(isSingleChoice(CreateTagTemplate)()).toBe(true)],
    [equals(MULTI), () => expect(isMultiChoice(CreateTagTemplate)()).toBe(true)],
  ]);

const expectAvailabilityToBeSelected = CreateTagTemplate =>
  cond([
    [equals(AVAILABLE), () => expect(isAvailable(CreateTagTemplate)()).toBe(true)],
    [equals(UNAVAILABLE), () => expect(isUnavailable(CreateTagTemplate)()).toBe(true)],
  ]);

const expectApplicabilityToBeSelected = CreateTagTemplate =>
  cond([
    [equals(DATASET), () => expect(isDatasetSelected(CreateTagTemplate)()).toBe(true)],
    [equals(CONTENT), () => expect(isContentSelected(CreateTagTemplate)()).toBe(true)],
    [equals(MIXED), () => expect(isMixedSelected(CreateTagTemplate)()).toBe(true)],
  ]);

const expectTagsToHaveProperNames = () => tagNames =>
  tagNames.forEach((item, index) => expect($(`#tags-${index}`)).toHaveValue(`${item}`));

const expectTagTemplateToHaveProperData = CreateTagTemplate => (
  tagTemplateName,
  numOfTags,
  choiceType,
  applicability,
  availability
) => {
  const tagNames = createTagNames(CreateTagTemplate)(numOfTags, tagTemplateName, VALID);
  expectTagsToHaveProperNames(CreateTagTemplate)(tagNames);
  expectApplicabilityToBeSelected(CreateTagTemplate)(applicability);
  expectAvailabilityToBeSelected(CreateTagTemplate)(availability);
  expectChoiceToBeSelected(CreateTagTemplate)(choiceType);
  expect(CreateTagTemplate.nameInput()).toHaveValue(tagTemplateName);
};

const deleteTagTemplate = CreateTagTemplate => () => {
  clickElement(CreateTagTemplate.deleteTagTemplateBtn());
  waitForElement(CreateTagTemplate.tagTemplateRemovalModal());
  clickElement(CreateTagTemplate.tagTemplateRemovalConfirmBtn());
};

const getFunctions = CreateTagTemplate => ({
  createTagTemplate: createTagTemplate(CreateTagTemplate),
  createTagNames: createTagNames(CreateTagTemplate),
  expectTagTemplateToHaveProperData: expectTagTemplateToHaveProperData(CreateTagTemplate),
  deleteTagTemplate: deleteTagTemplate(CreateTagTemplate),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
