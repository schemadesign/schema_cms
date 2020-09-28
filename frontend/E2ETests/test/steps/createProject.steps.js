import { Given, When, Then } from 'cucumber';
import TopHeader from '../pages/Components/TopHeader/topHeader.component';
import CreateProject from '../pages/CreateProject/createProject.page';
import Homepage from '../pages/Homepage/homepage.page';
import { waitForElement, waitForText } from '../helpers/waitFor';
import { clickElement, setValue } from '../helpers/actions';
import {
  CREATE_PROJECT_URL,
  CREATE_PROJECT,
  CREATE_PROJECT_EMPTY_FIELD_ERROR,
  CREATE_PROJECT_TITLE_TOO_LONG_ERROR,
  CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR,
  CREATE_PROJECT_INVALID_DOMAIN_ERROR,
} from '../pages/CreateProject/createProject.constants';

Given('I cho(o)se to create new project as an {string}', userRole => {
  clickElement(Homepage.createProjectBtn());
  expect(browser).toHaveUrl(CREATE_PROJECT_URL);
  CreateProject.expectCreateProjectPageToMatchDesign(userRole);
  TopHeader.expectTopHeaderToBeDisplayed();
});

When('required fields are empty', () => {
  expect(CreateProject.titleInput()).toHaveValue('');
  expect(CreateProject.descriptionInput()).toHaveValue('');
});

When('I select {string} status from dropdown', status => {
  CreateProject.setProjectStatus(status);
});

When('I create new project', () => {
  browser.refresh();
  CreateProject.createProject();
  clickElement(CreateProject.finishBtn());
});

When('I edit the data', () => {
  CreateProject.createProject();
  setValue(CreateProject.titleInput(), CREATE_PROJECT.title.edited);
  setValue(CreateProject.descriptionInput(), CREATE_PROJECT.description.edited);
  setValue(CreateProject.domainInput(), CREATE_PROJECT.domain.edited);
});

When(/^I enter title and description longer than required$/, () => {
  setValue(CreateProject.titleInput(), CREATE_PROJECT.title.tooLong);
  setValue(CreateProject.descriptionInput(), CREATE_PROJECT.description.tooLong);
  clickElement(CreateProject.domainInput());
  clickElement(CreateProject.finishBtn());
});

Then('{string} status is displayed', status => {
  expect(CreateProject.statusDropdown()).toHaveText(status);
});

Then('created project is at the top of the list', () => {
  waitForText(Homepage.projectTitle(), CREATE_PROJECT.title.valid);
  expect(Homepage.projectTitle()).toHaveText(CREATE_PROJECT.title.valid);
});

Then('new data in fields is displayed', () => {
  expect(CreateProject.titleInput()).toHaveValue(CREATE_PROJECT.title.edited);
  expect(CreateProject.descriptionInput()).toHaveValue(CREATE_PROJECT.description.edited);
  expect(CreateProject.domainInput()).toHaveValue(CREATE_PROJECT.domain.edited);
});

Then('validation message about empty fields is displayed', () => {
  waitForElement(CreateProject.titleErrorText());
  waitForElement(CreateProject.descriptionErrorText());

  expect(CreateProject.titleErrorText()).toHaveText(CREATE_PROJECT_EMPTY_FIELD_ERROR);
  expect(CreateProject.descriptionErrorText()).toHaveText(CREATE_PROJECT_EMPTY_FIELD_ERROR);
});

Then('validation message about title being too long is displayed', () => {
  waitForElement(CreateProject.titleErrorText());
  expect(CreateProject.titleErrorText()).toHaveText(CREATE_PROJECT_TITLE_TOO_LONG_ERROR);
});

Then('validation message about description being too long is displayed', () => {
  waitForElement(CreateProject.descriptionErrorText());
  expect(CreateProject.descriptionErrorText()).toHaveText(CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR);
});

Then('Finish button is not active', () => {
  expect(CreateProject.finishBtn()).toBeDisabled();
});

When('I enter an invalid domain', () => {
  setValue(CreateProject.domainInput(), CREATE_PROJECT.domain.invalid);
  clickElement(CreateProject.titleInput());
});

Then('validation message about invalid domain is displayed', () => {
  expect(CreateProject.domainErrorText()).toHaveText(CREATE_PROJECT_INVALID_DOMAIN_ERROR);
});
