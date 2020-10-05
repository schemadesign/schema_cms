import { camelize, pascalize } from 'humps';
import { Given, When, Then } from 'cucumber';
import Templates from '../pages/Templates/templates.page';
import CreateTagTemplate from '../pages/Templates/Tags/createTagTemplate.page';
import Tags from '../pages/Templates/Tags/tags.page';
import { clickElement } from '../helpers/actions';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../helpers/expect';
import {
  AVAILABLE,
  DATASET,
  SINGLE,
  TAG_NAME_ERROR,
  TAG_TEMPLATE_NAME_ERROR,
  TAG_TEMPLATES,
} from '../pages/Templates/Tags/tags.constants';

Given('I chose to see a list of {string} templates', templateName => {
  Templates.navigateToTemplatePage(templateName);
});

Given('I chose to edit a {string} tag template', tagTemplateName => {
  CreateTagTemplate.openTagTemplateByName(tagTemplateName);
});

When(
  'I create(d) {int} {string} choice {string} tag(s) which is/are {string} for editors',
  (numOfTags, choiceType, applicability, availability) => {
    Tags.templateName = `${pascalize(applicability)} ${pascalize(choiceType)} ${pascalize(availability)}`;
    Tags.numOftags = CreateTagTemplate.getTagsCounter(numOfTags);
    clickElement(Tags.addTagTemplateBtn());
    CreateTagTemplate.createTagTemplate(Tags.templateName, numOfTags, choiceType, applicability, availability);
  }
);

Then('created tag template is displayed on the tag templates page', () => {
  expectPageToHaveUrl(TAG_TEMPLATES);
  expectPageToHaveTitle(TAG_TEMPLATES);
  expect($(`#tag-category-${camelize(Tags.templateName)}`)).toHaveText(Tags.templateName);
  expect(Tags.tagsCounter()).toHaveText(Tags.numOftags);
});

When('I want to create a tag template with {string} name', inputState => {
  clickElement(Tags.addTagTemplateBtn());
  CreateTagTemplate.createTagTemplate(camelize(inputState));
});

Then('I can see a warning that tag template name is {string}', inputState => {
  expect(CreateTagTemplate.nameValidationError()).toHaveText(TAG_TEMPLATE_NAME_ERROR[camelize(inputState)]);
});

Then('Submit button is inactive', () => {
  expect(CreateTagTemplate.saveBtn()).toBeDisabled();
});

Then('I want to create a tag template with {string} tag name', tagNameState => {
  CreateTagTemplate.numOfTags = 2;
  const templateName = `${pascalize(DATASET)} ${pascalize(SINGLE)} ${pascalize(AVAILABLE)}`;

  clickElement(Tags.addTagTemplateBtn());
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
  clickElement(Tags.backBtn());
});

When(
  'I edit tag template to have {int} {string} choice {string} tag(s) {string} for editors',
  (numOfTags, choiceType, applicability, availability) => {
    Tags.templateName = `${pascalize(applicability)} ${pascalize(choiceType)} ${pascalize(availability)}`;
    Tags.numOftags = CreateTagTemplate.getTagsCounter(numOfTags);
    CreateTagTemplate.createTagTemplate(Tags.templateName, numOfTags, choiceType, applicability, availability);
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
