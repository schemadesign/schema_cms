import { createSelectors, getTranslateXvalueFromMatrix } from '../../../helpers/utils';
import { clickElement } from '../../../helpers/actions';
import { expectToBeDisplayed, expectElemsToHaveText } from '../../../helpers/expect';
import MENU_ELEMENT_TEXT_VALUES from './menu.constants';

const singleSelectors = {
  header: 'h2=Schema CMS',
  subHeader: 'h1=Menu',
  projectsOption: '#projectsNavBtn',
  usersOption: '#usersPageNavBtn',
  aboutSchemaCMS: '#aboutNavBtn',
  apiDoc: '#apiNavBtn',
  gitHubRepo: '#repositoryNavBtn',
};

const utilitySelectors = {
  container: '#menuContainer',
};

const multiSelectors = {};

const ctaSelectors = {
  closeBtn: '#desktopTopHeaderCloseMenuButton',
};

const convertedSingleSelectors = createSelectors([singleSelectors], []);
const convertedCtaSelectors = createSelectors([ctaSelectors], []);

const closeMenu = Menu => () => clickElement(Menu.closeBtn());

const expectMenuToBeDisplayed = () => () => {
  expectToBeDisplayed(convertedCtaSelectors);
  expectElemsToHaveText(convertedSingleSelectors, MENU_ELEMENT_TEXT_VALUES);
};

const waitForMenuToHide = Menu => (timeout = browser.config.waitforTimeout) => {
  browser.waitUntil(() => getTranslateXvalueFromMatrix(Menu.container().getCSSProperty('transform').value) === 595, {
    timeout,
    timeoutMsg: `Transform value equals ${getTranslateXvalueFromMatrix(
      Menu.container().getCSSProperty('transform').value
    )}`,
  });

  browser.waitUntil(() => !Menu.container().isDisplayedInViewport(), {
    timeout,
    timeoutMsg: 'Menu is still visible in the viewport',
  });
};

const getFunctions = Menu => ({
  closeMenu: closeMenu(Menu),
  expectMenuToBeDisplayed: expectMenuToBeDisplayed(Menu),
  waitForMenuToHide: waitForMenuToHide(Menu),
});

const convertedSelectors = createSelectors([singleSelectors, ctaSelectors, utilitySelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
