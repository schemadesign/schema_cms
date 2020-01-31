import { Given, When, Then } from 'cucumber';
import { PROJECTS_PAGE_URL } from '../constants/projectsPage.constants';
import ProjectsPage from '../pageobjects/projects.page';
import { clickElement, waitForElement, waitForUrl } from '../utils/utils';

Given('I have opened menu', () => {
  clickElement(ProjectsPage.TopHeader, 'menuBtn');
});

When('I open menu', () => {
  clickElement(ProjectsPage.TopHeader, 'menuBtn');
});

When('I close menu', () => {
  clickElement(ProjectsPage.Menu, 'closeBtn');
});

Then('I am on Projects page', () => {
  waitForUrl(PROJECTS_PAGE_URL);

  expect(browser.getUrl()).to.equal(PROJECTS_PAGE_URL);
});

Then(/^I can see Projects page with all its elements$/, function() {
  waitForElement(ProjectsPage, 'creationDate');
  waitForElement(ProjectsPage, 'status');
  waitForElement(ProjectsPage, 'owner');
  waitForElement(ProjectsPage, 'projectTitle');
  waitForElement(ProjectsPage, 'projectDesc');
  waitForElement(ProjectsPage, 'apiPath');
  waitForElement(ProjectsPage, 'addProjectBtn');

  assert(ProjectsPage.creationDate.isDisplayed(), 'Creation date is not displayed');
  assert(ProjectsPage.status.isDisplayed(), 'Status is not displayed');
  assert(ProjectsPage.owner.isDisplayed(), 'Owner is not displayed');
  assert(ProjectsPage.projectTitle.isDisplayed(), 'Project title is not displayed');
  assert(ProjectsPage.projectDesc.isDisplayed(), 'Project description is not displayed');
  assert(ProjectsPage.apiPath.isDisplayed(), 'API path is not displayed');
  assert(ProjectsPage.addProjectBtn.isDisplayed(), 'Add project button is not displayed');
});
