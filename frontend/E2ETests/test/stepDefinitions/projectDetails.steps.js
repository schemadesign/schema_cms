import { Given, When, Then } from 'cucumber';
import { waitForElement } from './../utils/utils.js';
import ProjectsPage from '../pageobjects/projects.page.js';
import ProjectDetailsPage from '../pageobjects/projectDetails.page.js';
import {
    DATA_SOURCES_LABEL,
    USERS_LABEL,
    LAST_UPDATE_LABEL,
    STATUS_LABEL,
    OWNER_LABEL,
    TITLE_LABEL,
    DESCRIPTION_LABEL,
    API_PATH_LABEL
} from '../constants/projectDetails.constants.js';


Given('I have entered project details page', () => {
    waitForElement(ProjectsPage, 'projectTitle');
    ProjectsPage.projectTitle.click();
    waitForElement(ProjectDetailsPage.Header, 'subtitle');

    expect(browser.getTitle()).to.equal(`${ProjectDetailsPage.Header.subtitle.getText()} - SchemaCMS`);
});


When('I choose to see project details', () => {
    waitForElement(ProjectsPage, 'projectTitle');
    ProjectsPage.projectTitle.click();
});


Then('I am on project details page', () => {
    waitForElement(ProjectDetailsPage.Header, 'subtitle');

    expect(browser.getTitle()).to.equal(`${ProjectDetailsPage.Header.subtitle.getText()} - SchemaCMS`);
});

Then('Project Name is displayed', () => {
    waitForElement(ProjectDetailsPage.Header, 'subtitle');

    assert(ProjectDetailsPage.Header.subtitle.isDisplayed(), 'Project title is not displayed');
});

Then('Data Sources tile is displayed', () => {
    waitForElement(ProjectDetailsPage, 'dataSourcesTile');

    assert(ProjectDetailsPage.dataSourcesTile.isDisplayed(), 'Data Sources tile is not displayed');
    assert(ProjectDetailsPage.dataSourcesAmount.isDisplayed(), 'Data Sources amount is not displayed');
    expect(ProjectDetailsPage.dataSourcesLabel.getText()).to.equal(DATA_SOURCES_LABEL);
});

Then('Users tile is displayed', () => {
    waitForElement(ProjectDetailsPage, 'usersTile');

    assert(ProjectDetailsPage.usersTile.isDisplayed(), 'Users tile is not displayed');
    assert(ProjectDetailsPage.usersAmount.isDisplayed(), 'Users amount is not displayed');
    expect(ProjectDetailsPage.usersLabel.getText()).to.equal(USERS_LABEL);
});

Then('Last Update is displayed', () => {
    waitForElement(ProjectDetailsPage, 'lastUpdateLabel');

    expect(ProjectDetailsPage.lastUpdateLabel.getText()).to.equal(LAST_UPDATE_LABEL);
    expect(ProjectDetailsPage.lastUpdateValue.getText()).to.not.be.null;
});

Then('Status is displayed', () => {
    waitForElement(ProjectDetailsPage, 'statusLabel');

    expect(ProjectDetailsPage.statusLabel.getText()).to.equal(STATUS_LABEL);
    expect(ProjectDetailsPage.statusValue.getText()).to.not.be.null;
});

Then('Owner is displayed', () => {
    waitForElement(ProjectDetailsPage, 'ownerLabel');

    expect(ProjectDetailsPage.ownerLabel.getText()).to.equal(OWNER_LABEL);
    expect(ProjectDetailsPage.ownerValue.getText()).to.not.be.null;
});

Then('Title is displayed', () => {
    waitForElement(ProjectDetailsPage, 'titleLabel');

    expect(ProjectDetailsPage.titleLabel.getText()).to.equal(TITLE_LABEL);
    expect(ProjectDetailsPage.titleValue.getText()).to.not.be.null;
});

Then('Description is displayed', () => {
    waitForElement(ProjectDetailsPage, 'descriptionLabel');

    expect(ProjectDetailsPage.descriptionLabel.getText()).to.equal(DESCRIPTION_LABEL);
    expect(ProjectDetailsPage.descriptionValue.getText()).to.not.be.null;
});

Then('API path is displayed', () => {
    waitForElement(ProjectDetailsPage, 'apiPathLabel');

    expect(ProjectDetailsPage.apiPathLabel.getText()).to.equal(API_PATH_LABEL);
    expect(ProjectDetailsPage.apiPathValue.getText()).to.not.be.null;
});

Then('Back button is displayed', () => {
    waitForElement(ProjectDetailsPage, 'backBtn');

    assert(ProjectDetailsPage.backBtn.isDisplayed(), 'Back button is not displayed');
});