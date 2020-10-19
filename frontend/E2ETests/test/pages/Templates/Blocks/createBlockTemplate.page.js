import { camelize } from 'humps';
import { cond, equals } from 'ramda';
import { createSelectors, getTranslateXvalueFromMatrix, toTitleCase } from '../../../helpers/utils';
import { clickElement, setValue } from '../../../helpers/actions';
import { EMPTY, TOO_LONG, TRANSFORM, VALID } from '../../Constants/general.constants';
import { AVAILABLE, EXISTING, UNAVAILABLE } from '../Tags/tagTemplates.constants';
import { CUSTOM_ELEMENT, CUSTOM_ELEMENT_TYPES, ELEMENT_TYPES, EXPAND_ELEMENTS } from './blockTemplates.constants';
import {
  expectInputNameToBeEmpty,
  expectInputNameToBeTooLong,
  expectInputNameToBeValid,
  expectInputNameToExist,
} from '../../../helpers/expect';
import { BLOCK_TEMPLATE, BLOCK_TEMPLATE_ELEMENT_NAME, BLOCK_TEMPLATE_NAME } from '../../Constants/validation.constants';

const singleSelectors = {
  templateNameInput: '#name',
  accordionToggle: '#accordionToggle',
  elementNameInput: '#elements\\.0\\.name',
  availabilitySwitch: '[for="isAvailable"] > div > div',
  saveBtn: '#createBlockTemplate',
  backBtn: '#cancelBtn',
  addElementBtn: '#createElement',
  addCustomElementBtn: '#addCustomElementBtnContainer button',
  deleteBlockTemplateBtn: '#removeBlock',
  confirmBlockTemplateRemovalBtn: '#confirmRemovalBtn',
  confirmRemovalModal: '[aria-label="Confirm Removal"]',
  templateNameError: '#nameError > div',
  elementNameError: '#elements\\.0\\.nameError > div',
  deleteElementBtn: '#removeElement-0',
};

const multiSelectors = {};

const isAccordionCollapsed = CreateBlockTemplate => () =>
  CreateBlockTemplate.accordionToggle().getText() === EXPAND_ELEMENTS;

const waitForAvailable = CreateBlockTemplate => () =>
  browser.waitUntil(
    () => getTranslateXvalueFromMatrix(CreateBlockTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 20
  );

const waitForUnavailable = CreateBlockTemplate => () =>
  browser.waitUntil(
    () => getTranslateXvalueFromMatrix(CreateBlockTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 0
  );

const isAvailable = CreateBlockTemplate => () =>
  getTranslateXvalueFromMatrix(CreateBlockTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 20;

const isUnavailable = CreateTagTemplate => () =>
  getTranslateXvalueFromMatrix(CreateTagTemplate.availabilitySwitch().getCSSProperty(TRANSFORM).value) === 0;

const setAvailable = CreateBlockTemplate => () => {
  if (!isAvailable(CreateBlockTemplate)()) {
    clickElement(CreateBlockTemplate.availabilitySwitch());
    waitForAvailable(CreateBlockTemplate)();
    return expect(isAvailable(CreateBlockTemplate)()).toBe(true);
  }
  return expect(isAvailable(CreateBlockTemplate)()).toBe(true);
};

const setUnavailable = CreateBlockTemplate => () => {
  if (isAvailable(CreateBlockTemplate)()) {
    clickElement(CreateBlockTemplate.availabilitySwitch());
    waitForUnavailable(CreateBlockTemplate)();
    return expect(isUnavailable(CreateBlockTemplate)()).toBe(true);
  }
  return expect(isUnavailable(CreateBlockTemplate)()).toBe(true);
};

const setAvailability = CreateBlockTemplate => availability =>
  availability === AVAILABLE ? setAvailable(CreateBlockTemplate)() : setUnavailable(CreateBlockTemplate)();

const deleteAllElements = CreateBlockTemplate => () => {
  while (
    CreateBlockTemplate.deleteElementBtn().isExisting() &&
    CreateBlockTemplate.elementNameInput().getValue() !== ''
  ) {
    clickElement(CreateBlockTemplate.deleteElementBtn());
  }
};

const selectCustomElement = CreateBlockTemplate => (elementTypeName, index) => {
  // const elementDropdown = $(`#custom-elementTypeSelect-${index}`);
  const elementDropdown = $(`div#elements\\.0\\.params\\.elements\\.${index}`);
  const elementNameInput = $(`#elements\\.0\\.params\\.elements\\.${index}\\.name`);
  const elementTypeSelect = $(
    `#custom-element-container-${index} #custom-element-${camelize(elementTypeName)}-${
      ELEMENT_TYPES[camelize(elementTypeName)]
    }`
  );

  clickElement(elementDropdown);
  elementTypeSelect.scrollIntoView();
  clickElement(elementTypeSelect);
  const elementTypeSelectName = elementDropdown.getText();
  setValue(elementNameInput, elementTypeSelectName);
  CreateBlockTemplate.addCustomElementBtn().waitForClickable();
};

const selectStandardElement = () => (elementTypeName, elementNameState) => {
  const elementNameInput = $('#elements\\.0\\.name');
  const elementDropdown = $('#standard-elementTypeSelect-0');
  const elementTypeSelect = $(
    `#standard-element-container-0 #standard-element-${camelize(elementTypeName)}-${
      ELEMENT_TYPES[camelize(elementTypeName)]
    }`
  );

  if (elementTypeName !== EMPTY) {
    clickElement(elementDropdown);
    elementTypeSelect.scrollIntoView();
    clickElement(elementTypeSelect);

    const elementTypeSelectName = elementDropdown.getText();

    if (elementNameState !== undefined) {
      return setValue(elementNameInput, elementNameState);
    }

    setValue(elementNameInput, elementTypeSelectName);
  }

  // if (elementType === CUSTOM) {
  //   if (elementNameState !== undefined) {
  //     return setValue(customElementNameInput, elementNameState);
  //   }
  //
  //   setValue(customElementNameInput, elementTypeSelectName);
  //   return CreateBlockTemplate.addCustomElementBtn().waitForClickable();
  // }

  // elementType === STANDARD
  //   ? setValue(standardElementNameInput, elementNameState)
  //   : setValue(customElementNameInput, elementNameState);

  return clickElement(elementDropdown);
};

const expandAccordion = CreateBlockTemplate => () => {
  if (isAccordionCollapsed(CreateBlockTemplate)()) {
    clickElement(CreateBlockTemplate.accordionToggle());
    return expect(isAccordionCollapsed(CreateBlockTemplate)()).toBe(false);
  }
  return expect(isAccordionCollapsed(CreateBlockTemplate)()).toBe(false);
};

const addElement = CreateBlockTemplate => (elementTypes, elementName) => {
  const elementTypesArr = elementTypes.split(',');
  expandAccordion(CreateBlockTemplate)();

  elementTypesArr.forEach(item => {
    clickElement(CreateBlockTemplate.addElementBtn());
    selectStandardElement(CreateBlockTemplate)(item, elementName);

    if (item === CUSTOM_ELEMENT) {
      CUSTOM_ELEMENT_TYPES.forEach((item, index) => {
        clickElement(CreateBlockTemplate.addCustomElementBtn());
        selectCustomElement(CreateBlockTemplate)(item, index);
      });
    }
  });
};

const createBlockTemplate = CreateBlockTemplate => (
  elementTypes,
  availability,
  blockTemplateName = elementTypes,
  elementName
) => {
  const templateName = toTitleCase(blockTemplateName);
  setValue(CreateBlockTemplate.templateNameInput(), templateName);
  addElement(CreateBlockTemplate)(elementTypes, elementName);
  setAvailability(CreateBlockTemplate)(availability);
  CreateBlockTemplate.saveBtn().waitForClickable();
  clickElement(CreateBlockTemplate.saveBtn());
};

const deleteBlockTemplate = CreateBlockTemplate => () => {
  clickElement(CreateBlockTemplate.deleteBlockTemplateBtn());
  clickElement(CreateBlockTemplate.confirmBlockTemplateRemovalBtn());
};

const expectAvailabilityToBeSelected = CreateBlockTemplate =>
  cond([
    [equals(AVAILABLE), () => expect(isAvailable(CreateBlockTemplate)()).toBe(true)],
    [equals(UNAVAILABLE), () => expect(isUnavailable(CreateBlockTemplate)()).toBe(true)],
  ]);

const expectBlockTemplateToHaveProperName = CreateBlockTemplate => templateName =>
  expect(CreateBlockTemplate.templateNameInput()).toHaveValue(templateName);

const expectElementsToHaveProperNamesAndTypes = () => elements =>
  elements.forEach((item, index, array) => {
    const elementName = $(`#elements\\.${array.length - index - 1}\\.name`);
    const elementType = $(`#standard-elementTypeSelect-${array.length - index - 1} div:nth-child(1)`);

    expect(elementName).toHaveValue(item);
    expect(elementType).toHaveText(item);

    if (item === CUSTOM_ELEMENT) {
      CUSTOM_ELEMENT_TYPES.forEach((item, index, array) => {
        const customElementName = $(`#elements\\.0\\.params\\.elements\\.${array.length - index - 1}\\.name`);
        const customElementType = $(`#custom-elementTypeSelect-${array.length - index - 1} div:nth-child(1)`);

        expect(customElementName).toHaveValue(item);
        expect(customElementType).toHaveText(item);
      });
    }
  });

const expectBlockTemplateToHaveProperData = CreateBlockTemplate => (
  elements,
  availability,
  blockTemplateName = elements
) => {
  const templateName = toTitleCase(blockTemplateName);
  expandAccordion(CreateBlockTemplate)();
  expectBlockTemplateToHaveProperName(CreateBlockTemplate)(templateName);
  expectElementsToHaveProperNamesAndTypes(CreateBlockTemplate)(elements);
  expectAvailabilityToBeSelected(CreateBlockTemplate)(availability);
};

const validateTemplateName = CreateBlockTemplate =>
  cond([
    [equals(VALID), () => expectInputNameToBeValid(CreateBlockTemplate.templateNameError())],
    [equals(EMPTY), () => expectInputNameToBeEmpty(CreateBlockTemplate.templateNameError())],
    [equals(TOO_LONG), () => expectInputNameToBeTooLong(CreateBlockTemplate.templateNameError(), BLOCK_TEMPLATE_NAME)],
    [equals(EXISTING), () => expectInputNameToExist(CreateBlockTemplate.templateNameError(), BLOCK_TEMPLATE)],
  ]);

const validateElementName = CreateBlockTemplate =>
  cond([
    [equals(VALID), () => expectInputNameToBeValid(CreateBlockTemplate.elementNameError())],
    [equals(EMPTY), () => expectInputNameToBeEmpty(CreateBlockTemplate.elementNameError())],
    [
      equals(TOO_LONG),
      () => expectInputNameToBeTooLong(CreateBlockTemplate.elementNameError(), BLOCK_TEMPLATE_ELEMENT_NAME),
    ],
  ]);

const getFunctions = CreateBlockTemplate => ({
  createBlockTemplate: createBlockTemplate(CreateBlockTemplate),
  deleteBlockTemplate: deleteBlockTemplate(CreateBlockTemplate),
  expectBlockTemplateToHaveProperData: expectBlockTemplateToHaveProperData(CreateBlockTemplate),
  expandAccordion: expandAccordion(CreateBlockTemplate),
  setAvailable: setAvailable(CreateBlockTemplate),
  validateTemplateName: validateTemplateName(CreateBlockTemplate),
  validateElementName: validateElementName(CreateBlockTemplate),
  addElement: addElement(CreateBlockTemplate),
  setAvailability: setAvailability(CreateBlockTemplate),
  deleteAllElements: deleteAllElements(CreateBlockTemplate),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
