import { Given, When, Then } from 'cucumber';
import { waitForElement } from './../utils/utils.js';
import CreateProjectPage from './../pageobjects/createProject.page.js';
import ProjectsPage from './../pageobjects/projects.page.js';
import ProjectDetailsPage from '../pageobjects/projectDetails.page.js';
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
    CREATE_PROJECT_TITLE_TOO_SHORT_ERROR,
    CREATE_PROJECT_TITLE_TOO_LONG_ERROR,
    CREATE_PROJECT_DESCRIPTION_TOO_LONG,
    CREATE_PROJECT_DEFAULT_STATUS,
    CREATE_PROJECT_TITLE_TOO_SHORT,
    CREATE_PROJECT_TITLE_TOO_LONG,
    CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR
} from './../constants/createProject.constants.js';



Given('I chose to create new project', () => {
    waitForElement(ProjectsPage, 'addProjectBtn');
    ProjectsPage.addProjectBtn.click();
    waitForElement(CreateProjectPage, 'finishBtn');

    expect(browser.getUrl()).to.equal(CREATE_PROJECT_URL);
});

Given('I filled out all required fields', () => {
    CreateProjectPage.completeRequiredFields();
});

Given('required fields are empty', () => {
    waitForElement(CreateProjectPage, 'titleInput');
    waitForElement(CreateProjectPage, 'descriptionInput');

    expect(CreateProjectPage.titleInput.getValue()).to.equal('');
    expect(CreateProjectPage.descriptionInput.getValue()).to.equal('');
});

Given('title is too short', () => {
    waitForElement(CreateProjectPage, 'titleInput');
    CreateProjectPage.titleInput.setValue(CREATE_PROJECT_TITLE_TOO_SHORT);
});

Given('title is too long', () => {
    waitForElement(CreateProjectPage, 'titleInput');
    CreateProjectPage.titleInput.setValue(CREATE_PROJECT_TITLE_TOO_LONG);
});

Given('description is too long', () => {
    waitForElement(CreateProjectPage, 'descriptionInput');
    CreateProjectPage.descriptionInput.setValue(CREATE_PROJECT_DESCRIPTION_TOO_LONG);
});


When('I select {string} from dropdown', (status) => {
    CreateProjectPage.selectStatus(status);
});

When('I submit the form to create new project', () => {
    waitForElement(CreateProjectPage, 'finishBtn');
    CreateProjectPage.finishBtn.click();
});

When('I edit the data', () => {
    waitForElement(CreateProjectPage, 'titleInput');
    CreateProjectPage.titleInput.setValue(CREATE_PROJECT_EDITED_TITLE),
    waitForElement(CreateProjectPage, 'descriptionInput');
    CreateProjectPage.descriptionInput.setValue(CREATE_PROJECT_EDITED_DESCRIPTION);
});


Then('I am on Create New Project page', () => {
    waitForElement(CreateProjectPage, 'finishBtn');

    expect(browser.getUrl()).to.equal(CREATE_PROJECT_URL);
});

Then('title of header is Create New Project', () => {
    waitForElement(CreateProjectPage.Header, 'title');

    expect(CreateProjectPage.Header.title.getText()).to.equal(CREATE_PROJECT_HEADER_TITLE);
});

Then('subtitle of header is Project Info', () => {
    waitForElement(CreateProjectPage.Header, 'subtitle');

    expect(CreateProjectPage.Header.subtitle.getText()).to.equal(CREATE_PROJECT_HEADER_SUBTITLE);
});

Then('Title field is displayed', () => {
    waitForElement(CreateProjectPage, 'titleInput');

    expect(CreateProjectPage.titleLabel.getText()).to.equal(CREATE_PROJECT_TITLE_LABEL);
});

Then('title placeholder is displayed', () => {
    waitForElement(CreateProjectPage, 'titleInput');

    expect(CreateProjectPage.titleInput.getAttribute('placeholder')).to.equal(CREATE_PROJECT_TITLE_PLACEHOLDER);
});

Then('Description field is displayed', () => {
    waitForElement(CreateProjectPage, 'descriptionInput');

    expect(CreateProjectPage.descriptionLabel.getText()).to.equal(CREATE_PROJECT_DESCRIPTION_LABEL);
});

Then('Description placeholder is displayed', () => {
    waitForElement(CreateProjectPage, 'descriptionInput');

    expect(CreateProjectPage.descriptionInput.getAttribute('placeholder')).to.equal(CREATE_PROJECT_DESCRIPTION_PLACEHOLDER);
});

Then('Owner field is displayed', () => {
    waitForElement(CreateProjectPage, 'ownerInput');

    expect(CreateProjectPage.ownerLabel.getText()).to.equal(CREATE_PROJECT_OWNER_LABEL);
});

Then('Status dropdown is displayed', () => {
    waitForElement(CreateProjectPage, 'statusDropdown');

    expect(CreateProjectPage.statusLabel.getText()).to.equal(CREATE_PROJECT_STATUS_LABEL);
});

Then('default status is displayed', () => {
    waitForElement(CreateProjectPage, 'statusDropdown');

    expect(CreateProjectPage.statusDropdown.getText()).to.equal(CREATE_PROJECT_DEFAULT_STATUS);
});

Then('Cancel button is displayed', () => {
    waitForElement(CreateProjectPage, 'cancelBtn');

    expect(CreateProjectPage.cancelBtn.getText()).to.equal(CREATE_PROJECT_CANCEL_LABEL);
});

Then('Submit button is displayed', () => {
    waitForElement(CreateProjectPage, 'finishBtn');

    expect(CreateProjectPage.finishBtn.getText()).to.equal(CREATE_PROJECT_SUBMIT_LABEL);
});

Then('{string} is displayed', (status) => {
    waitForElement(CreateProjectPage, 'statusDropdown');

    expect(CreateProjectPage.statusDropdown.getText()).to.equal(status);
});

Then('created project is at the top of the list', () => {
    expect(ProjectsPage.projectTitle.getText()).to.equal(CREATE_PROJECT_VALID_TITLE);

    ProjectsPage.chooseFirstProject();
    ProjectDetailsPage.openMenu();
    ProjectDetailsPage.deleteProject();
});

Then('new data in fields is displayed', () => {
    waitForElement(CreateProjectPage, 'titleInput');
    expect(CreateProjectPage.titleInput.getValue()).to.equal(CREATE_PROJECT_EDITED_TITLE);

    waitForElement(CreateProjectPage, 'descriptionInput');
    expect(CreateProjectPage.descriptionInput.getValue()).to.equal(CREATE_PROJECT_EDITED_DESCRIPTION);
});

Then('validation message about empty fields is displayed', () => {
    waitForElement(CreateProjectPage, 'titleErrorMsg');
    expect(CreateProjectPage.titleErrorMsg.getText()).to.equal(CREATE_PROJECT_EMPTY_FIELD_ERROR);

    waitForElement(CreateProjectPage, 'descriptionErrorMsg');
    expect(CreateProjectPage.descriptionErrorMsg.getText()).to.equal(CREATE_PROJECT_EMPTY_FIELD_ERROR);
});

Then('validation message about title being too short is displayed', () => {
    waitForElement(CreateProjectPage, 'titleErrorMsg');
    expect(CreateProjectPage.titleErrorMsg.getText()).to.equal(CREATE_PROJECT_TITLE_TOO_SHORT_ERROR);
});

Then('validation message about title being too long is displayed', () => {
    waitForElement(CreateProjectPage, 'titleErrorMsg');
    expect(CreateProjectPage.titleErrorMsg.getText()).to.equal(CREATE_PROJECT_TITLE_TOO_LONG_ERROR);
});

Then('validation message about description being too long is displayed', () => {
    waitForElement(CreateProjectPage, 'descriptionErrorMsg');
    expect(CreateProjectPage.descriptionErrorMsg.getText()).to.equal(CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR);
});