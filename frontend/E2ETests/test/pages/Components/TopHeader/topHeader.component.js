import { clickElement } from '../../../helpers/actions';
import { expectToBeDisplayed } from '../../../helpers/expect';
import { createSelectors } from '../../../helpers/utils';
import { waitForElement } from '../../../helpers/waitFor';

const singleSelectors = {
  projectName: '#desktopTopHeaderProjectTitle',
  confirmLogoutModal: '#confirmLogoutModal',
  confirmLogoutBtn: '#confirmLogoutBtn',
};

const multiSelectors = {};

const ctaSelectors = {
  menuBtn: '#desktopTopHeaderOpenMenuButton',
  logo: '#desktopTopHeaderSchemaLogo',
  logoutBtn: '#desktopTopHeaderLogoutBtn',
  settingsBtn: '#desktopTopHeaderSettingsBtn',
};

const convertedCtaSelectors = createSelectors([ctaSelectors], []);

const openMenu = TopHeader => () => clickElement(TopHeader.menuBtn());

const openProfile = TopHeader => () => clickElement(TopHeader.settingsBtn());

const logOut = TopHeader => () => {
  if (TopHeader.logoutBtn().isExisting()) {
    clickElement(TopHeader.logoutBtn());
    waitForElement(TopHeader.confirmLogoutModal());
    clickElement(TopHeader.confirmLogoutBtn());
  }
};

const expectTopHeaderToBeDisplayed = () => () => {
  expectToBeDisplayed(convertedCtaSelectors);
};

const getFunctions = TopHeader => ({
  openProfile: openProfile(TopHeader),
  logOut: logOut(TopHeader),
  openMenu: openMenu(TopHeader),
  expectTopHeaderToBeDisplayed: expectTopHeaderToBeDisplayed(TopHeader),
});

const convertedSelectors = createSelectors([singleSelectors, ctaSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
