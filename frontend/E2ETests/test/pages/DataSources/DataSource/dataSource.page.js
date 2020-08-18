import TopHeader from '../../Components/TopHeader/topHeader.component';
import SubHeader from '../../Components/SubHeader/subHeader.component';
import Tabs from '../../Components/Tabs/tabs.component';
import { createSelectors } from '../../../helpers/utils';
import { waitForText } from '../../../helpers/waitFor';
import { expectElemsToHaveText } from '../../../helpers/expect';
import { DATA_SOURCE_STATUS } from '../Create/createDatasource.constants';
import { DATA_SOURCE_TILE_VALUES } from './dataSourcePage.constants';

const singleSelectors = {
  title: '#dataSourceContainer:first-child #dataSourceTitle',
  createDataSourceBtn: '#createDataSourceDesktopBtn',
  status: '#dataSourceStatus',
  sourceIcon: '#metaItemValue-0',
  jobListHeader: '#jobListHeader > span',
  jobStateValue: '#jobStateValue',
  jobIdLabel: '#jobIdLabel > span',
  jobIdValue: '#jobIdValue',
  updatedAtLabel: '#jobUpdatedAtLabel > span',
  updatedAtValue: '#jobUpdatedAtValue',
  backBtn: '#backBtn',
};

const multiSelectors = {
  dataSourceContainers: '#dataSourceContainer',
};

const textSelectors = {
  creationDate: '#dataSourceContainer:first-child #headerItem-0',
  creator: '#dataSourceContainer:first-child #headerItem-1',
  sourceLabel: '#dataSourceContainer:first-child #metaItem-0',
  itemsLabel: '#dataSourceContainer:first-child #metaItem-1',
  itemsValue: '#dataSourceContainer:first-child #metaItemValue-1',
  fieldsLabel: '#dataSourceContainer:first-child #metaItem-2',
  fieldsValue: '#dataSourceContainer:first-child #metaItemValue-2',
  filtersLabel: '#dataSourceContainer:first-child #metaItem-3',
  filtersValue: '#dataSourceContainer:first-child #metaItemValue-3',
  tagsLabel: '#dataSourceContainer:first-child #metaItem-4',
  tagsValue: '#dataSourceContainer:first-child #metaItemValue-4',
};

const convertedTextSelectors = createSelectors([textSelectors], []);

const waitForDataSourceStatusToChange = DataSources => dataSourceState =>
  DATA_SOURCE_STATUS[dataSourceState].forEach(item => waitForText(DataSources.status(), item));

const calculateAmountOfDataSources = DataSources => () => DataSources.dataSourceContainers().length;

const expectDataSourceTileToHaveProperData = DataSources => dtsTitle => {
  expectElemsToHaveText(convertedTextSelectors, DATA_SOURCE_TILE_VALUES);
  expect(DataSources.title()).toHaveText(dtsTitle);
  TopHeader.expectTopHeaderToBeDisplayed();
  const currentUrl = browser.getUrl();
  SubHeader.expectSubHeaderToMatchPageUrl(currentUrl);
  Tabs.expectTabsToBeDisplayed();
};

const isAnyDataSourcePresent = DataSources => () => DataSources.dataSourceContainers().length > 0;

const getFunctions = DataSources => ({
  waitForDataSourceStatusToChange: waitForDataSourceStatusToChange(DataSources),
  calculateAmountOfDataSources: calculateAmountOfDataSources(DataSources),
  expectDataSourceTileToHaveProperData: expectDataSourceTileToHaveProperData(DataSources),
  isAnyDataSourcePresent: isAnyDataSourcePresent(DataSources),
});

const convertedSelectors = createSelectors([singleSelectors, textSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
