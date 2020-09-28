import { camelize } from 'humps';
import { When, Then } from 'cucumber';
import Homepage from '../pages/Homepage/homepage.page';
import TopHeader from '../pages/Components/TopHeader/topHeader.component';
import Menu from '../pages/Components/Menu/menu.component';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../helpers/expect';

When('I( have) open(ed) menu', () => {
  TopHeader.openMenu();
});

When('I close menu', () => {
  Menu.closeMenu();
});

Then('I am on {string} page', pageName => {
  expectPageToHaveTitle(camelize(pageName));
  expectPageToHaveUrl(camelize(pageName));
});

Then(/^I can see Projects page with all its elements$/, () => {
  Homepage.expectHomepageToMatchDesign();
});

Then('I can see menu with all its content', () => {
  Menu.expectMenuToBeDisplayed();
});

Then('menu is no longer displayed', () => {
  expect(Menu.closeBtn()).not.toBeDisplayed();
});
