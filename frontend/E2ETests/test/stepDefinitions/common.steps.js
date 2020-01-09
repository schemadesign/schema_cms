import { Then } from 'cucumber';
import ProjectDetailsPage from '../pageobjects/projectDetails.page';
import { waitForElement } from '../utils/utils';

Then('Header is displayed', () => {
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

Then(/^Subheader is displayed$/, function() {
  waitForElement(ProjectDetailsPage.Subheader, 'settings');
  waitForElement(ProjectDetailsPage.Subheader, 'sources');
  waitForElement(ProjectDetailsPage.Subheader, 'users');
  waitForElement(ProjectDetailsPage.Subheader, 'pages');

  assert(
    ProjectDetailsPage.Subheader.settings.isDisplayed(),
    'Settings tab is not displayed'
  );
  assert(
    ProjectDetailsPage.Subheader.sources.isDisplayed(),
    'Sources tab is not displayed'
  );
  assert(
    ProjectDetailsPage.Subheader.users.isDisplayed(),
    'Settings tab is not displayed'
  );
  assert(
    ProjectDetailsPage.Subheader.pages.isDisplayed(),
    'Settings tab is not displayed'
  );
});
