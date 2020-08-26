import { createSelectors } from '../../../helpers/utils';
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

const getFunctions = Menu => ({
  closeMenu: closeMenu(Menu),
  expectMenuToBeDisplayed: expectMenuToBeDisplayed(Menu),
});

const convertedSelectors = createSelectors([singleSelectors, ctaSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
