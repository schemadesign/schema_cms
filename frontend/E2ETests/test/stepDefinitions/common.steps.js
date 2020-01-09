import { Then } from 'cucumber';
import ProjectDetailsPage from '../pageobjects/projectDetails.page';
import { waitForElement } from '../utils/utils';
import ProjectsPage from '../pageobjects/projects.page';

Then('top header is displayed', () => {
  waitForElement(ProjectDetailsPage.TopHeader, 'logo');
  waitForElement(ProjectDetailsPage.TopHeader, 'menuBtn');
  waitForElement(ProjectDetailsPage.TopHeader, 'logoutBtn');
  waitForElement(ProjectDetailsPage.TopHeader, 'settingsBtn');

  assert(
    ProjectDetailsPage.TopHeader.logo.isDisplayed(),
    'Logo is not displayed'
  );
  assert(
    ProjectDetailsPage.TopHeader.menuBtn.isDisplayed(),
    'Menu button is not displayed'
  );
  assert(
    ProjectDetailsPage.TopHeader.logoutBtn.isDisplayed(),
    'Logout button is not displayed'
  );
  assert(
    ProjectDetailsPage.TopHeader.settingsBtn.isDisplayed(),
    'Settings button is not displayed'
  );
});

Then(/^I can see menu with all its content$/, function() {
  waitForElement(ProjectsPage.Menu, 'closeBtn');
  waitForElement(ProjectsPage.Menu, 'projects');
  waitForElement(ProjectsPage.Menu, 'users');
  waitForElement(ProjectsPage.Menu, 'aboutSchemaCMS');
  waitForElement(ProjectsPage.Menu, 'apiDoc');
  waitForElement(ProjectsPage.Menu, 'githubRepo');

  assert(
    ProjectsPage.Menu.closeBtn.isDisplayed(),
    'Close menu button is not displayed'
  );
  assert(
    ProjectsPage.Menu.projects.isDisplayed(),
    'Projects option is not displayed'
  );
  assert(
    ProjectsPage.Menu.users.isDisplayed(),
    'Users option is not displayed'
  );
  assert(
    ProjectsPage.Menu.aboutSchemaCMS.isDisplayed(),
    'About SchemaCMS link is not displayed'
  );
  assert(
    ProjectsPage.Menu.apiDoc.isDisplayed(),
    'API Doc link is not displayed'
  );
  assert(
    ProjectsPage.Menu.githubRepo.isDisplayed(),
    'Github link is not displayed'
  );
});
