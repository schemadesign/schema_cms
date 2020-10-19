import { cond, T, match, always } from 'ramda';
import { camelize } from 'humps';
import PAGE_URL from '../../Constants/pageURL.constants';
import { createSelectors } from '../../../helpers/utils';
import { expectToBeDisplayed, expectElemsToHaveText } from '../../../helpers/expect';
import { CREATE_PROJECT_PAGE } from '../../CreateProject/createProject.constants';
import { HOMEPAGE } from '../../Homepage/homepage.constants';
import { DATA_SOURCE_MAIN_PAGE } from '../../DataSources/DataSource/dataSourcePage.constants';
import {
  SUBHEADER_CREATE_PROJECT_TITLE_VALUES,
  SUBHEADER_DATA_SOURCES_ELEMENT_VALUES,
  SUBHEADER_DATA_SOURCES_SUBTITLE,
  SUBHEADER_HOMEPAGE_TITLE_VALUES,
  SUBHEADER_ICON_LABELS,
} from './subHeader.constants';
import { clickElement } from '../../../helpers/actions';

const singleSelectors = {};

const multiSelectors = {};

const commonSelectors = {
  title: '#desktopHeaderTitle',
  subtitle: '#desktopHeaderSubtitle',
};

const homepageCtaSelectors = {
  createProjectBtn: '#addProjectDesktopBtn',
};

const createDataSourceCtaSelectors = {
  createDataSourceBtn: '#createDataSourceDesktopBtn',
};

const dataSourceCtaSelectors = {
  sourceBtn: '#sourceBtn',
  fieldsBtn: '#fieldsBtn',
  stepsBtn: '#stepsBtn',
  resultsBtn: '#resultsBtn',
  filtersBtn: '#filtersBtn',
  tagsBtn: '#tagsBtn',
  statesBtn: '#statesBtn',
  metaDataBtn: '#metaDataBtn',
};

const dataSourceTextSelectors = {
  sourceBtnLabel: 'div=Source',
  fieldsBtnLabel: 'div=Fields',
  stepsBtnLabel: 'div=Steps',
  resultsBtnLabel: 'div=Results',
  filtersBtnLabel: 'div=Filters',
  tagsBtnLabel: 'div=TagTemplates',
  statesBtnLabel: 'div=States',
  metaDataBtnLabel: 'div=Metadata',
};

const convertedCommonSelectors = createSelectors([commonSelectors], []);
const convertedHomepageCtaSelectors = createSelectors([homepageCtaSelectors], []);
const convertedDtsCtaSelectors = createSelectors([createDataSourceCtaSelectors], []);
const convertedDataSourceCtaSelectors = createSelectors([dataSourceCtaSelectors], []);
const convertedDataSourceTextSelectors = createSelectors([dataSourceTextSelectors], []);

const navigateToPage = SubHeader => pageName => clickElement(SubHeader[`${pageName}Btn`]());

const isHomepageSubHeaderDisplayed = () => () => {
  expectToBeDisplayed(convertedHomepageCtaSelectors);
  expectElemsToHaveText(convertedCommonSelectors, SUBHEADER_HOMEPAGE_TITLE_VALUES);
};

const isCreateProjectSubHeaderDisplayed = () => () => {
  expectElemsToHaveText(convertedCommonSelectors, SUBHEADER_CREATE_PROJECT_TITLE_VALUES);
};

const isDataSourceMainPageSubHeaderDisplayed = () => () => {
  expectToBeDisplayed(convertedDtsCtaSelectors);
  expectElemsToHaveText(convertedCommonSelectors, SUBHEADER_DATA_SOURCES_ELEMENT_VALUES);
};

const isDataSourceSubHeaderIconsDisplayed = () => () => {
  expectToBeDisplayed(convertedDataSourceCtaSelectors);
  expectElemsToHaveText(convertedDataSourceTextSelectors, SUBHEADER_ICON_LABELS);
};

const isDataSourceSubHeaderDisplayed = SubHeader => (dtsName, page) => {
  isDataSourceSubHeaderIconsDisplayed();
  expect(SubHeader.title()).toHaveText(dtsName);
  expect(SubHeader.subtitle()).toHaveText(SUBHEADER_DATA_SOURCES_SUBTITLE[camelize(page)]);
};

const expectSubHeaderToMatchPageUrl = SubHeader => url =>
  cond([
    [match(PAGE_URL[HOMEPAGE], url), isHomepageSubHeaderDisplayed(SubHeader)],
    [match(PAGE_URL[CREATE_PROJECT_PAGE], url), isCreateProjectSubHeaderDisplayed(SubHeader)],
    [match(PAGE_URL[DATA_SOURCE_MAIN_PAGE], url), isDataSourceMainPageSubHeaderDisplayed(SubHeader)],
    [(T, always(`Error: URL is ${url}`))],
  ]);

const getFunctions = SubHeader => ({
  expectSubHeaderToMatchPageUrl: expectSubHeaderToMatchPageUrl(SubHeader),
  isHomepageSubHeaderDisplayed: isHomepageSubHeaderDisplayed(SubHeader),
  isCreateProjectSubHeaderDisplayed: isCreateProjectSubHeaderDisplayed(SubHeader),
  isDataSourcesSubHeaderDisplayed: isDataSourceMainPageSubHeaderDisplayed(SubHeader),
  isDataSourceSubHeaderDisplayed: isDataSourceSubHeaderDisplayed(SubHeader),
  navigateToPage: navigateToPage(SubHeader),
});

const convertedSelectors = createSelectors(
  [singleSelectors, commonSelectors, homepageCtaSelectors, createDataSourceCtaSelectors, dataSourceCtaSelectors],
  [multiSelectors]
);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
