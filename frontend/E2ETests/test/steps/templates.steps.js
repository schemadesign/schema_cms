import { camelize, pascalize } from 'humps';
import { Given, When, Then } from 'cucumber';
import Templates from '../pages/Templates/templates.page';
import CreateTagTemplate from '../pages/Templates/Tags/createTagTemplate.page';
import CreateBlockTemplate from '../pages/Templates/Blocks/createBlockTemplate.page';
import BlockTemplates from '../pages/Templates/Blocks/blockTemplates.page';
import TagTemplates from '../pages/Templates/Tags/tagTemplates.page';
import { clearValue, clickElement, setValue } from '../helpers/actions';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../helpers/expect';
import {
  AVAILABLE,
  DATASET,
  SINGLE,
  TAG_NAME_ERROR,
  TAG_TEMPLATE_NAME_ERROR,
  TAG_TEMPLATES,
} from '../pages/Templates/Tags/tagTemplates.constants';
import {
  BLOCK_TEMPLATE_STATES,
  BLOCK_TEMPLATES,
  STANDARD_ELEMENT_TYPES,
} from '../pages/Templates/Blocks/blockTemplates.constants';
import { STANDARD } from '../pages/Constants/general.constants';
import { toTitleCase } from '../helpers/utils';

Given('I chose to see a list of {string} templates', templateName => {
  Templates.navigateToTemplatePage(templateName);
});

Given('I chose to edit a {string} tag template', tagTemplateName => {
  CreateTagTemplate.openTagTemplateByName(tagTemplateName);
});

When(
  'I create(d) {int} {string} choice {string} tag(s) which is/are {string} for editors',
  (numOfTags, choiceType, applicability, availability) => {
    TagTemplates.templateName = `${pascalize(applicability)} ${pascalize(choiceType)} ${pascalize(availability)}`;
    TagTemplates.numOftags = CreateTagTemplate.getTagsCounter(numOfTags);
    clickElement(TagTemplates.addTagTemplateBtn());
    CreateTagTemplate.createTagTemplate(TagTemplates.templateName, numOfTags, choiceType, applicability, availability);
  }
);

Then('created tag template is displayed on the tag templates page', () => {
  expectPageToHaveUrl(TAG_TEMPLATES);
  expectPageToHaveTitle(TAG_TEMPLATES);
  expect($(`#tag-category-${camelize(TagTemplates.templateName)}`)).toHaveText(TagTemplates.templateName);
  expect($(`#tagContainer-${TagTemplates.templateName} > div:nth-child(2)`)).toHaveText(TagTemplates.numOftags);
});

When('I want to create a tag template with {string} name', inputState => {
  clickElement(TagTemplates.addTagTemplateBtn());
  CreateTagTemplate.createTagTemplate(camelize(inputState));
});

Then('I can see a warning that tag template name is {string}', inputState => {
  expect(CreateTagTemplate.nameValidationError()).toHaveText(TAG_TEMPLATE_NAME_ERROR[camelize(inputState)]);
});

Then('button for creating block template is inactive', () => {
  expect(CreateBlockTemplate.saveBtn()).toBeDisabled();
});

Then('button for creating tag template is inactive', () => {
  expect(CreateTagTemplate.saveBtn()).toBeDisabled();
});

Then('I want to create a tag template with {string} tag name', tagNameState => {
  CreateTagTemplate.numOfTags = 2;
  const templateName = `${pascalize(DATASET)} ${pascalize(SINGLE)} ${pascalize(AVAILABLE)}`;

  clickElement(TagTemplates.addTagTemplateBtn());
  CreateTagTemplate.createTagTemplate(
    templateName,
    CreateTagTemplate.numOfTags,
    SINGLE,
    DATASET,
    AVAILABLE,
    camelize(tagNameState)
  );
});

Then('I can see a warning that tag name is {string}', tagNameState => {
  expect($('#tagValidationError-0')).toHaveText(TAG_NAME_ERROR[camelize(tagNameState)]);
  expect($(`#tagValidationError-${[CreateTagTemplate.numOfTags - 1]}`)).toHaveText(
    TAG_NAME_ERROR[camelize(tagNameState)]
  );
});

Then('I can see a warning that tag template with that name already exists', () => {
  expect(CreateTagTemplate.nameValidationError()).toHaveText(TAG_TEMPLATE_NAME_ERROR.existing);
});

When('I leave tag templates page', () => {
  clickElement(TagTemplates.backBtn());
});

When(
  'I edit tag template to have {int} {string} choice {string} tag(s) {string} for editors',
  (numOfTags, choiceType, applicability, availability) => {
    TagTemplates.templateName = `${pascalize(applicability)} ${pascalize(choiceType)} ${pascalize(availability)}`;
    TagTemplates.numOftags = CreateTagTemplate.getTagsCounter(numOfTags);
    CreateTagTemplate.createTagTemplate(TagTemplates.templateName, numOfTags, choiceType, applicability, availability);
  }
);

Then(
  '{string} tag template is saved with {int} {string} choice {string} tag(s) {string} for editors',
  (tagTemplateName, numOfTags, choiceType, applicability, availability) => {
    CreateTagTemplate.openTagTemplateByName(tagTemplateName);
    CreateTagTemplate.expectTagTemplateToHaveProperData(
      tagTemplateName,
      numOfTags,
      choiceType,
      applicability,
      availability
    );
  }
);

When('I delete a tag template called {string}', tagTemplateName => {
  CreateTagTemplate.openTagTemplateByName(tagTemplateName);
  CreateTagTemplate.deleteTagTemplate();
});

Then('{string} tag template is not on the list of tag templates', tagTemplateName => {
  expectPageToHaveUrl(TAG_TEMPLATES);
  expect($(`#tag-category-${camelize(tagTemplateName)}`)).not.toExist();
});

When('I create block template with {string}', templateName => {
  BlockTemplates.numOfElements = BlockTemplates.getElementsCounter(STANDARD_ELEMENT_TYPES);
  clickElement(BlockTemplates.addBlockTemplateBtn());
  CreateBlockTemplate.createBlockTemplate(STANDARD_ELEMENT_TYPES.join(','), AVAILABLE, templateName);
});

When('I save/create(d) block template with {string} element(s) {string} for editors', (elementTypes, availability) => {
  const elements = elementTypes.split(',');
  BlockTemplates.numOfElements = BlockTemplates.getElementsCounter(elements);
  clickElement(BlockTemplates.addBlockTemplateBtn());
  // CreateBlockTemplate.deleteAllElements();
  // clearValue(CreateBlockTemplate.templateNameInput());
  clickElement(CreateBlockTemplate.addElementBtn());
  CreateBlockTemplate.createBlockTemplate(elementTypes, availability, toTitleCase(elementTypes));
});

When(
  'I want to create block template with {string} name and {string} element name and {string} element',
  (templateNameState, elementNameState, elementType) => {
    clickElement(BlockTemplates.addBlockTemplateBtn());
    // CreateBlockTemplate.expandAccordion();
    // CreateBlockTemplate.selectElement(elementName, STANDARD);
    // setValue(CreateBlockTemplate.templateNameInput(), BLOCK_TEMPLATE_STATES[camelize(templateNameState)]);
    // // setValue(CreateBlockTemplate.elementNameInput(), BLOCK_TEMPLATE_STATES[camelize(elementNameState)]);
    // CreateBlockTemplate.setAvailable();
    // CreateBlockTemplate.createBlockTemplate(
    //   elementType,
    //   AVAILABLE,
    //   BLOCK_TEMPLATE_STATES[camelize(templateNameState)],
    //   BLOCK_TEMPLATE_STATES[camelize(elementNameState)]
    // );
    setValue(CreateBlockTemplate.templateNameInput(), BLOCK_TEMPLATE_STATES[camelize(templateNameState)]);
    CreateBlockTemplate.addElement(elementType, BLOCK_TEMPLATE_STATES[camelize(elementNameState)]);
    CreateBlockTemplate.setAvailability(AVAILABLE);
  }
);

Then('block template called {string} is displayed on the block templates page', blockTemplateName => {
  const templateName = $(`#blockTemplateTitle-${camelize(blockTemplateName)}`);
  const elementsCounter = $(`#blockTemplateCard-${camelize(blockTemplateName)} > div:nth-child(2)`);

  expectPageToHaveUrl(BLOCK_TEMPLATES);
  expectPageToHaveTitle(BLOCK_TEMPLATES);
  expect(templateName).toHaveText(toTitleCase(blockTemplateName));
  expect(elementsCounter).toHaveText(BlockTemplates.numOfElements);
});

Then('I can see that block template name is {string}', nameState => {
  CreateBlockTemplate.validateTemplateName(camelize(nameState));
});

Then('I can see that element name is {string}', nameState => {
  CreateBlockTemplate.validateElementName(camelize(nameState));
});

When('I delete a block template called {string}', templateName => {
  BlockTemplates.openBlockTemplateByName(templateName);
  CreateBlockTemplate.deleteBlockTemplate();
});

Then('block template called {string} is no longer on the list of block templates', templateName => {
  expectPageToHaveUrl(BLOCK_TEMPLATES);
  expect($(`#blockTemplateTitle-${camelize(templateName)}`)).not.toExist();
});

Given('I chose to edit block template called {string}', templateName => {
  BlockTemplates.openBlockTemplateByName(templateName);
});

Then(
  'block template called {string} is saved with {string} and {string} elements {string} for editors',
  (templateName, elementType1, elementType2, availability) => {
    clickElement(CreateBlockTemplate.backBtn());
    browser.refresh();
    BlockTemplates.openBlockTemplateByName(templateName);
    const elements = [pascalize(elementType1), pascalize(elementType2)];
    CreateBlockTemplate.expectBlockTemplateToHaveProperData(elements, availability, templateName);
  }
);

Then('block template with {string} is displayed on the block templates page', templateName => {
  expectPageToHaveUrl(BLOCK_TEMPLATES);
  BlockTemplates.openBlockTemplateByName(toTitleCase(templateName));
  CreateBlockTemplate.expectBlockTemplateToHaveProperData(STANDARD_ELEMENT_TYPES, AVAILABLE, templateName);
});
