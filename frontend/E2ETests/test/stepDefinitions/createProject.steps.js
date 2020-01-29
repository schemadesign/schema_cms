import { Given, When, Then } from 'cucumber';
import { clickElement, setValue, waitForElement } from '../utils/utils';
import CreateProjectPage from '../pageobjects/createProject.page';
import ProjectsPage from '../pageobjects/projects.page';
import {
  CREATE_PROJECT_URL,
  CREATE_PROJECT_HEADER_TITLE,
  CREATE_PROJECT_HEADER_SUBTITLE,
  CREATE_PROJECT_TITLE_LABEL,
  CREATE_PROJECT_TITLE_PLACEHOLDER,
  CREATE_PROJECT_DESCRIPTION_LABEL,
  CREATE_PROJECT_DESCRIPTION_PLACEHOLDER,
  CREATE_PROJECT_OWNER_LABEL,
  CREATE_PROJECT_STATUS_LABEL,
  CREATE_PROJECT_CANCEL_LABEL,
  CREATE_PROJECT_SUBMIT_LABEL,
  CREATE_PROJECT_VALID_TITLE,
  CREATE_PROJECT_EDITED_TITLE,
  CREATE_PROJECT_EDITED_DESCRIPTION,
  CREATE_PROJECT_EMPTY_FIELD_ERROR,
  CREATE_PROJECT_TITLE_TOO_LONG_ERROR,
  CREATE_PROJECT_DESCRIPTION_TOO_LONG,
  CREATE_PROJECT_DEFAULT_STATUS,
  CREATE_PROJECT_TITLE_TOO_LONG,
  CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR,
} from '../constants/createProject.constants';

Given('I cho(o)se to create new project', () => {
  clickElement(ProjectsPage, 'addProjectBtn');
  waitForElement(CreateProjectPage, 'finishBtn');

  expect(browser.getUrl()).to.equal(CREATE_PROJECT_URL);
});

Given('I filled out all required fields', () => {
  CreateProjectPage.completeRequiredFields();
});

When('required fields are empty', () => {
  waitForElement(CreateProjectPage, 'titleInput');
  waitForElement(CreateProjectPage, 'descriptionInput');

  expect(CreateProjectPage.titleInput.getValue()).to.equal('');
  expect(CreateProjectPage.descriptionInput.getValue()).to.equal('');
});

When('I select {string} from dropdown', status => {
  CreateProjectPage.selectStatus(status);
});

When('I submit the form to create new project', () => {
  clickElement(CreateProjectPage, 'finishBtn');
});

When('I edit the data', () => {
  waitForElement(CreateProjectPage, 'titleInput');
  CreateProjectPage.titleInput.setValue(CREATE_PROJECT_EDITED_TITLE);
  waitForElement(CreateProjectPage, 'descriptionInput');
  CreateProjectPage.descriptionInput.setValue(CREATE_PROJECT_EDITED_DESCRIPTION);
});

When(/^I enter title and description longer than required$/, function() {
  setValue(CreateProjectPage, 'titleInput', CREATE_PROJECT_TITLE_TOO_LONG);
  setValue(CreateProjectPage, 'descriptionInput', CREATE_PROJECT_DESCRIPTION_TOO_LONG);
  clickElement(CreateProjectPage, 'finishBtn');
});

Then('I am on Create New Project page', () => {
  waitForElement(CreateProjectPage, 'finishBtn');

  expect(browser.getUrl()).to.equal(CREATE_PROJECT_URL);
});

Then('{string} is displayed', status => {
  waitForElement(CreateProjectPage, 'statusDropdown');

  expect(CreateProjectPage.statusDropdown.getText()).to.equal(status);
});

Then('created project is at the top of the list', () => {
  waitForElement(ProjectsPage, 'projectTitle');
  expect(ProjectsPage.projectTitle.getText()).to.equal(CREATE_PROJECT_VALID_TITLE);
});

Then('new data in fields is displayed', () => {
  waitForElement(CreateProjectPage, 'titleInput');
  expect(CreateProjectPage.titleInput.getValue()).to.equal(CREATE_PROJECT_EDITED_TITLE);

  waitForElement(CreateProjectPage, 'descriptionInput');
  expect(CreateProjectPage.descriptionInput.getValue()).to.equal(CREATE_PROJECT_EDITED_DESCRIPTION);
});

Then('validation message about empty fields is displayed', () => {
  waitForElement(CreateProjectPage, 'titleErrorMsg');
  waitForElement(CreateProjectPage, 'descriptionErrorMsg');

  expect(CreateProjectPage.titleErrorMsg.getText()).to.equal(CREATE_PROJECT_EMPTY_FIELD_ERROR);
  expect(CreateProjectPage.descriptionErrorMsg.getText()).to.equal(CREATE_PROJECT_EMPTY_FIELD_ERROR);
});

Then('validation message about title being too long is displayed', () => {
  waitForElement(CreateProjectPage, 'titleErrorMsg');
  expect(CreateProjectPage.titleErrorMsg.getText()).to.equal(CREATE_PROJECT_TITLE_TOO_LONG_ERROR);
});

Then('validation message about description being too long is displayed', () => {
  waitForElement(CreateProjectPage, 'descriptionErrorMsg');
  expect(CreateProjectPage.descriptionErrorMsg.getText()).to.equal(CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR);
});

Then(/^all elements of Create New Project page are displayed properly$/, function() {
  waitForElement(CreateProjectPage.SubHeader, 'title');
  waitForElement(CreateProjectPage.SubHeader, 'subtitle');
  waitForElement(CreateProjectPage, 'titleInput');
  waitForElement(CreateProjectPage, 'titleInput');
  waitForElement(CreateProjectPage, 'descriptionInput');
  waitForElement(CreateProjectPage, 'descriptionInput');
  waitForElement(CreateProjectPage, 'ownerInput');
  waitForElement(CreateProjectPage, 'statusDropdown');
  waitForElement(CreateProjectPage, 'statusDropdown');
  waitForElement(CreateProjectPage, 'cancelBtn');
  waitForElement(CreateProjectPage, 'finishBtn');

  expect(CreateProjectPage.finishBtn.getText()).to.equal(CREATE_PROJECT_SUBMIT_LABEL);
  expect(CreateProjectPage.cancelBtn.getText()).to.equal(CREATE_PROJECT_CANCEL_LABEL);
  expect(CreateProjectPage.statusDropdown.getText()).to.equal(CREATE_PROJECT_DEFAULT_STATUS);
  expect(CreateProjectPage.statusLabel.getText()).to.equal(CREATE_PROJECT_STATUS_LABEL);
  expect(CreateProjectPage.ownerLabel.getText()).to.equal(CREATE_PROJECT_OWNER_LABEL);
  expect(CreateProjectPage.descriptionInput.getAttribute('placeholder')).to.equal(
    CREATE_PROJECT_DESCRIPTION_PLACEHOLDER
  );
  expect(CreateProjectPage.descriptionLabel.getText()).to.equal(CREATE_PROJECT_DESCRIPTION_LABEL);
  expect(CreateProjectPage.titleInput.getAttribute('placeholder')).to.equal(CREATE_PROJECT_TITLE_PLACEHOLDER);
  expect(CreateProjectPage.SubHeader.title.getText()).to.equal(CREATE_PROJECT_HEADER_TITLE);
  expect(CreateProjectPage.titleLabel.getText()).to.equal(CREATE_PROJECT_TITLE_LABEL);
  expect(CreateProjectPage.SubHeader.subtitle.getText()).to.equal(CREATE_PROJECT_HEADER_SUBTITLE);
});

Then(/^Finish button is not active$/, function() {
  waitForElement(CreateProjectPage, 'finishBtn');

  assert(CreateProjectPage.finishBtn.isEnabled() === false, 'Finish button is enabled');
});
