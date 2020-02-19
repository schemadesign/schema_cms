import { Given, When, Then } from 'cucumber';
import { clickElement, waitForElement, waitForTitle } from '../utils/utils';
import ProjectsPage from '../pageobjects/projects.page';
import ProjectDetailsPage from '../pageobjects/projectDetails.page';
import {
  DATA_SOURCES_LABEL,
  USERS_LABEL,
  LAST_UPDATE_LABEL,
  STATUS_LABEL,
  OWNER_LABEL,
  TITLE_LABEL,
  DESCRIPTION_LABEL,
  API_PATH_LABEL,
  CHARTS_LABEL,
  PAGES_LABEL,
  PAGE_TITLE,
} from '../constants/projectDetails.constants';

Given('I have entered project details page', () => {
  ProjectsPage.projectName = ProjectsPage.projectTitle.getText();
  clickElement(ProjectsPage, 'projectTitle');
  waitForElement(ProjectDetailsPage.TopHeader, 'projectName');
  waitForTitle(PAGE_TITLE);

  expect(ProjectDetailsPage.TopHeader.projectName.getText()).to.equal(ProjectsPage.projectName);
  expect(browser.getTitle()).to.equal(PAGE_TITLE);
});

When('I choose to see project details', () => {
  ProjectsPage.projectName = ProjectsPage.projectTitle.getText();
  clickElement(ProjectsPage, 'projectTitle');
});

Then('I am on project details page', () => {
  waitForElement(ProjectDetailsPage.TopHeader, 'projectName');

  expect(ProjectDetailsPage.TopHeader.projectName.getText()).to.equal(ProjectsPage.projectName);
});

Then(/^I can see project details page with all its content$/, function() {
  waitForElement(ProjectDetailsPage, 'dataSourcesTile');
  waitForElement(ProjectDetailsPage, 'dataSourcesTileLabel');
  waitForElement(ProjectDetailsPage, 'dataSourcesTileAmount');
  waitForElement(ProjectDetailsPage, 'usersTile');
  waitForElement(ProjectDetailsPage, 'usersTileLabel');
  waitForElement(ProjectDetailsPage, 'usersTileAmount');
  waitForElement(ProjectDetailsPage, 'chartsTile');
  waitForElement(ProjectDetailsPage, 'chartsTileLabel');
  waitForElement(ProjectDetailsPage, 'chartsTileAmount');
  waitForElement(ProjectDetailsPage, 'lastUpdateLabel');
  waitForElement(ProjectDetailsPage, 'statusLabel');
  waitForElement(ProjectDetailsPage, 'ownerLabel');
  waitForElement(ProjectDetailsPage, 'titleLabel');
  waitForElement(ProjectDetailsPage, 'descriptionLabel');
  waitForElement(ProjectDetailsPage, 'apiPathLabel');
  waitForElement(ProjectDetailsPage, 'deleteProjectBtn');
  waitForElement(ProjectDetailsPage, 'backBtn');

  assert(ProjectDetailsPage.usersTile.isDisplayed(), 'Users tile is not displayed');
  assert(ProjectDetailsPage.usersTileAmount.isDisplayed(), 'Users amount is not displayed');
  expect(ProjectDetailsPage.usersTileLabel.getText()).to.equal(USERS_LABEL);

  assert(ProjectDetailsPage.dataSourcesTile.isDisplayed(), 'Data Sources tile is not displayed');
  assert(ProjectDetailsPage.dataSourcesTileAmount.isDisplayed(), 'Data Sources amount is not displayed');
  expect(ProjectDetailsPage.dataSourcesTileLabel.getText()).to.equal(DATA_SOURCES_LABEL);

  assert(ProjectDetailsPage.chartsTile.isDisplayed(), 'Charts tile is not displayed');
  assert(ProjectDetailsPage.chartsTileAmount.isDisplayed(), 'Charts amount is not displayed');
  expect(ProjectDetailsPage.chartsTileLabel.getText()).to.equal(CHARTS_LABEL);

  assert(ProjectDetailsPage.pagesTile.isDisplayed(), 'Pages tile is not displayed');
  assert(ProjectDetailsPage.pagesTileAmount.isDisplayed(), 'Pages amount is not displayed');
  expect(ProjectDetailsPage.pagesTileLabel.getText()).to.equal(PAGES_LABEL);

  expect(ProjectDetailsPage.statusLabel.getText()).to.equal(STATUS_LABEL);
  expect(ProjectDetailsPage.statusValue.getText()).to.not.be.null;

  expect(ProjectDetailsPage.lastUpdateLabel.getText()).to.equal(LAST_UPDATE_LABEL);
  expect(ProjectDetailsPage.lastUpdateValue.getText()).to.not.be.null;

  expect(ProjectDetailsPage.ownerLabel.getText()).to.equal(OWNER_LABEL);
  expect(ProjectDetailsPage.ownerValue.getText()).to.not.be.null;

  expect(ProjectDetailsPage.titleLabel.getText()).to.equal(TITLE_LABEL);
  expect(ProjectDetailsPage.titleValue.getText()).to.not.be.null;

  expect(ProjectDetailsPage.descriptionLabel.getText()).to.equal(DESCRIPTION_LABEL);
  expect(ProjectDetailsPage.descriptionValue.getText()).to.not.be.null;

  expect(ProjectDetailsPage.apiPathLabel.getText()).to.equal(API_PATH_LABEL);
  expect(ProjectDetailsPage.apiPathValue.getText()).to.not.be.null;

  assert(ProjectDetailsPage.backBtn.isDisplayed(), 'Back button is not displayed');
});

Then(/^tabs are displayed$/, function() {
  waitForElement(ProjectDetailsPage.Tabs, 'settings');
  waitForElement(ProjectDetailsPage.Tabs, 'sources');
  waitForElement(ProjectDetailsPage.Tabs, 'users');
  waitForElement(ProjectDetailsPage.Tabs, 'pages');

  assert(ProjectDetailsPage.Tabs.settings.isDisplayed(), 'Settings tab is not displayed');
  assert(ProjectDetailsPage.Tabs.sources.isDisplayed(), 'Sources tab is not displayed');
  assert(ProjectDetailsPage.Tabs.users.isDisplayed(), 'Settings tab is not displayed');
  assert(ProjectDetailsPage.Tabs.pages.isDisplayed(), 'Settings tab is not displayed');
});
