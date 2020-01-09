import { Given, When, Then } from 'cucumber';
import {
  TopHeader_TITLE,
  TopHeader_SUBTITLE,
  HOMEPAGE
} from '../constants/homepage.constants';
import ProjectsPage from '../pageobjects/projects.page';
import { waitForElement, waitForUrl } from '../utils/utils';

Given('I have opened menu', () => {
  ProjectsPage.TopHeader.menuBtn.click();
});

Given('I am on homepage', () => {
  waitForElement(ProjectsPage, 'addProjectBtn');

  expect(browser.getUrl()).to.equal(HOMEPAGE);
});

When('I click on Menu button', () => {
  waitForElement(ProjectsPage.TopHeader, 'menuBtn');
  ProjectsPage.TopHeader.menuBtn.click();
});

When('I close menu', () => {
  waitForElement(ProjectsPage.Menu, 'closeBtn');
  ProjectsPage.Menu.closeBtn.click();
});

When('I choose to create a project', () => {
  waitForElement(ProjectsPage, 'addProjectBtn');
  ProjectsPage.addProjectBtn.click();
});

Then('I am on Projects page', () => {
  waitForUrl(HOMEPAGE);

  expect(browser.getUrl()).to.equal(HOMEPAGE);
});

Then('title of TopHeader is Projects', () => {
  waitForElement(ProjectsPage.TopHeader, 'title');

  expect(ProjectsPage.TopHeader.title.getText()).to.equal(TopHeader_TITLE);
});

Then('subtitle of TopHeader is Overview', () => {
  waitForElement(ProjectsPage.TopHeader, 'subtitle');

  expect(ProjectsPage.TopHeader.subtitle.getText()).to.equal(
    TopHeader_SUBTITLE
  );
});

Then('Menu button is displayed', () => {
  waitForElement(ProjectsPage.TopHeader, 'menuBtn');

  assert(
    ProjectsPage.TopHeader.menuBtn.isDisplayed(),
    'Menu btn is not displayed'
  );
});

Then("it's visible when project was created", () => {
  waitForElement(ProjectsPage, 'creationDate');

  assert(
    ProjectsPage.creationDate.isDisplayed(),
    'Creation date is not displayed'
  );
});

Then('Status of the project is displayed', () => {
  waitForElement(ProjectsPage, 'status');

  assert(ProjectsPage.status.isDisplayed(), 'Status is not displayed');
});

Then('Owner of the project is displayed', () => {
  waitForElement(ProjectsPage, 'owner');

  assert(ProjectsPage.owner.isDisplayed(), 'Owner is not displayed');
});

Then('Title of the project is displayed', () => {
  waitForElement(ProjectsPage, 'projectTitle');

  assert(
    ProjectsPage.projectTitle.isDisplayed(),
    'Project title is not displayed'
  );
});

Then('Subtitle of the project is displayed', () => {
  waitForElement(ProjectsPage, 'projectDesc');

  assert(
    ProjectsPage.projectDesc.isDisplayed(),
    'Project description is not displayed'
  );
});

Then('API path of the project is displayed', () => {
  waitForElement(ProjectsPage, 'apiPath');

  assert(ProjectsPage.apiPath.isDisplayed(), 'API path is not displayed');
});

Then('Create new project button is displayed', () => {
  waitForElement(ProjectsPage, 'addProjectBtn');

  assert(
    ProjectsPage.addProjectBtn.isDisplayed(),
    'Add project button is not displayed'
  );
});

Then('I can see the Close button', () => {
  waitForElement(ProjectsPage.Menu, 'closeBtn');

  assert(
    ProjectsPage.Menu.closeBtn.isDisplayed(),
    'Close menu button is not displayed'
  );
});

Then('I can see Log Out option', () => {
  waitForElement(ProjectsPage.Menu, 'logoutBtn');

  assert(
    ProjectsPage.Menu.logoutBtn.isDisplayed(),
    'Log Out button is not displayed'
  );
});

Then('menu is closed', () => {
  waitForElement(ProjectsPage.TopHeader, 'menuBtn');

  assert(
    !ProjectsPage.Menu.closeBtn.isDisplayed(),
    "Menu is visible while it shouldn't"
  );
});
