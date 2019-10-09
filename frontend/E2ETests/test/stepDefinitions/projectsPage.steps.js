import { Given, When, Then, After } from 'cucumber';
import { HEADER_TITLE, HEADER_SUBTITLE, PROJECTS_PAGE } from './../constants/homepage.constants.js';
import ProjectsPage from './../pageobjects/projects.page.js';
import { waitForElement } from './../utils/utils.js';



After(() => {
    browser.reloadSession();
});


Given('I have opened menu', () => {
    ProjectsPage.Header.menuBtn.click();
});

Given('I am on Projects page', () => {
    waitForElement(ProjectsPage, 'addProjectBtn');

    expect(browser.getUrl()).to.equal(PROJECTS_PAGE); 
});


When('I click on Menu button', () => {
    waitForElement(ProjectsPage.Header, 'menuBtn');
    ProjectsPage.Header.menuBtn.click();
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
    waitForElement(ProjectsPage, 'addProjectBtn');

    expect(browser.getUrl()).to.equal(PROJECTS_PAGE); 
});

Then('title of header is Projects', () => {
    waitForElement(ProjectsPage.Header, 'title');

    expect(ProjectsPage.Header.title.getText()).to.equal(HEADER_TITLE);
});

Then('subtitle of header is Overview', () => {
    waitForElement(ProjectsPage.Header, 'subtitle');

    expect(ProjectsPage.Header.subtitle.getText()).to.equal(HEADER_SUBTITLE);
});

Then('Menu button is displayed', () => {
    waitForElement(ProjectsPage.Header, 'menuBtn');

    assert(ProjectsPage.Header.menuBtn.isDisplayed(), 'Menu btn is not displayed');
});

Then('it\'s visible when project was created', () => {
    waitForElement(ProjectsPage, 'creationDate');

    assert(ProjectsPage.creationDate.isDisplayed(), 'Creation date is not displayed');
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

    assert(ProjectsPage.projectTitle.isDisplayed(), 'Project title is not displayed');
});

Then('Subtitle of the project is displayed', () => {
    waitForElement(ProjectsPage, 'projectDesc');

    assert(ProjectsPage.projectDesc.isDisplayed(), 'Project description is not displayed');
});

Then('API path of the project is displayed', () => {
    waitForElement(ProjectsPage, 'apiPath');

    assert(ProjectsPage.apiPath.isDisplayed(), 'API path is not displayed');
});

Then('Create new project button is displayed', () => {
    waitForElement(ProjectsPage, 'addProjectBtn');

    assert(ProjectsPage.addProjectBtn.isDisplayed(), 'Add project button is not displayed');
});

Then('I can see the Close button', () => {
    waitForElement(ProjectsPage.Menu, 'closeBtn');

    assert(ProjectsPage.Menu.closeBtn.isDisplayed(), 'Close menu button is not displayed');
});

Then('I can see Log Out option', () => {
    waitForElement(ProjectsPage.Menu, 'logoutBtn');

    assert(ProjectsPage.Menu.logoutBtn.isDisplayed(), 'Log Out button is not displayed');
});

Then('menu is closed', () => {
    waitForElement(ProjectsPage.Header, 'menuBtn');

    assert(!ProjectsPage.Menu.closeBtn.isDisplayed(), 'Menu is visible while it shouldn\'t');
});
