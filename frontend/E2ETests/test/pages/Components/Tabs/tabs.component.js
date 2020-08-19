import { createSelectors } from '../../../helpers/utils';
import { expectElemsToHaveText } from '../../../helpers/expect';
import TABS_ELEMENT_VALUES from './tabs.constants';

const singleSelectors = {
  settings: '#settingsTab',
  sources: '#sourcesTab',
  content: '#contentTab',
  templates: '#templatesTab',
  users: '#usersTab',
};

const multiSelectors = { tabsContainer: '#tabsContainer' };

const convertedSingleSelectors = createSelectors([singleSelectors], []);

const expectTabsToBeDisplayed = () => () => {
  expectElemsToHaveText(convertedSingleSelectors, TABS_ELEMENT_VALUES);
};

const getFunctions = Tabs => ({
  expectTabsToBeDisplayed: expectTabsToBeDisplayed(Tabs),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
